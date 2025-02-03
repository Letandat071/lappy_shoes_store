import { NextResponse } from "next/server";

// Thêm interface cho tọa độ
interface Coordinates {
  lat: number;
  lon: number;
}

// Hàm lấy tọa độ từ mã quận/huyện
async function getDistrictCoordinates(provinceCode: string, districtCode: string): Promise<Coordinates | null> {
  // Tọa độ trung tâm các quận/huyện (có thể thêm vào khi cần)
  const DISTRICT_COORDS: Record<string, Coordinates> = {
    // Quảng Ninh
    "205": { lat: 21.120651, lon: 107.467896 }, // TP Đông Triều
    "206": { lat: 21.133333, lon: 107.333333 }, // Thị xã Quảng Yên
    
    // Hà Nội
    "001": { lat: 21.028511, lon: 105.804817 }, // Quận Hoàn Kiếm
    "002": { lat: 21.025466, lon: 105.841171 }, // Quận Ba Đình
    "003": { lat: 21.008777, lon: 105.850735 }, // Quận Hai Bà Trưng
    
    // TP.HCM
    "765": { lat: 10.825751, lon: 106.701578 }, // Quận Bình Thạnh
    "760": { lat: 10.775490, lon: 106.701920 }, // Quận 1
    "764": { lat: 10.758930, lon: 106.662810 }, // Quận 5
    "768": { lat: 10.847840, lon: 106.646270 }, // Quận 12
    "769": { lat: 10.856320, lon: 106.744730 }, // Quận Thủ Đức

    // Hải Phòng (17)
    "150": { lat: 20.864889, lon: 106.683333 }, // Quận Hồng Bàng
    "151": { lat: 20.849720, lon: 106.688330 }, // Quận Ngô Quyền
    "152": { lat: 20.837780, lon: 106.695830 }, // Quận Lê Chân
  };

  // Log để debug
  console.log('Looking for coordinates:', { provinceCode, districtCode });
  const coords = DISTRICT_COORDS[districtCode];
  if (!coords) {
    console.log('District coordinates not found:', districtCode);
  }

  return DISTRICT_COORDS[districtCode] || null;
}

// Hàm này sẽ gọi API lấy toàn bộ dữ liệu các địa danh ở Việt Nam (depth=3 bao gồm cả ward)
async function getRegionMapping(): Promise<any[]> {
  const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
  return res.json();
}

// Hàm chuyển đổi mã vùng thành tên địa danh
function getLocationName(mappingData: any[], code: string, type: 'province' | 'district' | 'ward'): string {
  const entry = mappingData.find((item: any) => String(item.code) === code);
  if (!entry) {
    console.error(`Không tìm thấy ${type} với mã: ${code}`);
  }
  return entry?.name || '';
}

// Hàm chuyển đổi mã vùng từ MongoDB thành địa chỉ đầy đủ
function getFullAddress(mappingData: any[], data: { address: string; ward: string; district: string; province: string }): string {
  const province = mappingData.find((p: any) => String(p.code) === data.province);
  if (!province) return `${data.address}, Việt Nam`;

  const district = province.districts.find((d: any) => String(d.code) === data.district);
  if (!district) return `${data.address}, ${province.name}, Việt Nam`;

  const ward = district.wards.find((w: any) => String(w.code) === data.ward);
  if (!ward) return `${data.address}, ${district.name}, ${province.name}, Việt Nam`;

  // Format địa chỉ theo cách Nominatim có thể hiểu tốt hơn
  return `${data.address} ${ward.name}, ${district.name}, ${province.name}, Vietnam`;
}

// Hàm tính khoảng cách giữa 2 điểm theo công thức Haversine
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính trái đất tính bằng km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Khoảng cách tính bằng km
  return d;
}

// Hàm chuyển đổi độ sang radian
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Hàm tính phí vận chuyển
function calculateShippingCost(distanceKm: number): number {
  const baseFee = 15000;  // Phí cơ bản
  const maxDistance = 50;  // Khoảng cách áp dụng giá cơ bản
  
  // Hàm làm tròn đến 1000đ
  const roundToThousand = (num: number) => Math.ceil(num / 1000) * 1000;
  
  if (distanceKm > maxDistance) {
    // Áp dụng biểu phí theo khoảng cách
    if (distanceKm <= 100) {
      return roundToThousand(baseFee + distanceKm * 400); // 400đ/km cho 100km đầu
    } else if (distanceKm <= 300) {
      return roundToThousand(baseFee + 40000 + (distanceKm - 100) * 200); // 200đ/km từ 100-300km
    } else {
      return roundToThousand(baseFee + 40000 + 40000 + (distanceKm - 300) * 50); // 50đ/km trên 300km
    }
  }
  return roundToThousand(baseFee + distanceKm * 400); // 400đ/km trong phạm vi 50km
}

// Hàm ước tính thời gian giao hàng
function estimateDeliveryTime(distanceKm: number): number {
  const averageSpeed = 20; // Giảm tốc độ trung bình xuống 20km/h
  const timeInHours = distanceKm / averageSpeed;
  // Thêm thời gian xử lý đơn hàng và nghỉ
  const processingHours = 48; // Tăng thời gian xử lý lên 48 giờ
  const totalHours = timeInHours + processingHours;
  return totalHours * 3600; // Chuyển giờ sang giây
}

// Model cho cache tọa độ
interface LocationCache {
  address: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  createdAt: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceCode = searchParams.get("province");
    const districtCode = searchParams.get("district");

    // Lấy tọa độ shop (cố định)
    const shopCoords: Coordinates = {
      lat: 10.825751,
      lon: 106.701578
    };

    // Lấy tọa độ quận/huyện của người dùng
    const userCoords = await getDistrictCoordinates(provinceCode || "", districtCode || "");

    if (!userCoords) {
      return NextResponse.json({
        error: `Chưa có dữ liệu tọa độ cho quận/huyện mã ${districtCode}. Vui lòng liên hệ admin để được hỗ trợ.`,
        details: {
          provinceCode,
          districtCode
        }
      }, { status: 400 });
    }

    // Tính khoảng cách
    const distanceKm = calculateDistance(
      shopCoords.lat,
      shopCoords.lon,
      userCoords.lat,
      userCoords.lon
    );

    // Ước tính thời gian giao hàng
    const durationSeconds = estimateDeliveryTime(distanceKm);

    console.log('Calculation results:', {
      distance: distanceKm,
      duration: durationSeconds,
      from: shopCoords,
      to: userCoords
    });

    return NextResponse.json({
      shippingCost: calculateShippingCost(distanceKm),
      estimatedTime: formatDuration(durationSeconds),
      distance: Math.round(distanceKm * 10) / 10
    });

  } catch (error) {
    console.error("Shipping estimate error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}

// Hàm định dạng thời gian
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  // Chuyển sang ngày nếu > 24 giờ
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} ngày ${remainingHours} giờ`;
  }
  
  return `${hours} giờ`;
}
