import { NextResponse } from "next/server";

// -----------------------
// Định nghĩa giao diện cho tọa độ
// -----------------------
interface Coordinates {
  lat: number;
  lon: number;
}

// -----------------------
// Hàm chuyển đổi các mã (ward, district, province) thành địa chỉ dạng text (Mapping cố định)
// Nếu có mapping cố định, trả về địa chỉ dạng text; nếu không có thì trả về chuỗi rỗng
// Ví dụ: với district=205 và province=22, trả về "Thành phố Đông Triều, Tỉnh Quảng Ninh"
async function getAddressFromCodes(
  ward: string,
  district: string,
  province: string
): Promise<string> {
  if (district === "205" && province === "22") {
    return "Thành phố Đông Triều, Tỉnh Quảng Ninh";
  }
  return "";
}

// -----------------------
// Hàm gọi API provinces.open-api.vn để chuyển đổi mã (dựa vào district và ward) thành tên địa chỉ chính xác
// Endpoint: https://provinces.open-api.vn/api/d/{district}?depth=2
// Nếu có ward thì sẽ tìm trong danh sách wards; sau đó trả về chuỗi: 
//    "<wardName>, <districtName>, <provinceName>" hoặc "<districtName>, <provinceName>" nếu không có ward
// -----------------------
async function getAddressFromProvinceAPI(
  ward: string,
  district: string
): Promise<string> {
  const url = `https://provinces.open-api.vn/api/d/${district}?depth=2`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error fetching province API:", response.statusText);
      return "";
    }
    const data = await response.json();
    if (!data) return "";

    // Lấy tên huyện và tên tỉnh từ kết quả trả về
    const districtName = data.name; // Tên huyện
    const provinceName = data.province?.name || "";
    
    // Nếu có ward, tìm kiếm trong mảng wards (chú ý: chuyển về string để so sánh)
    let wardName = "";
    if (ward && data.wards && Array.isArray(data.wards)) {
      const foundWard = data.wards.find((w: any) => w.code.toString() === ward);
      if (foundWard) {
        wardName = foundWard.name;
      }
    }

    // Nếu có wardName thì trả về đầy đủ thông tin, ngược lại chỉ trả về huyện và tỉnh
    if (wardName) {
      return `${wardName}, ${districtName}, ${provinceName}`;
    } else {
      return `${districtName}, ${provinceName}`;
    }
  } catch (error) {
    console.error("Error in getAddressFromProvinceAPI:", error);
    return "";
  }
}

// -----------------------
// Hàm lấy tọa độ từ API Nominatim dựa vào truy vấn địa chỉ
// -----------------------
async function getUserCoordinatesByAddress(query: string): Promise<Coordinates | null> {
  // console.log("Geocoding address:", query);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ShippingEstimateAPI/1.0 (your_email@example.com)", // Cập nhật email nếu cần
        "Accept-Language": "vi,en;q=0.9",
      },
    });
    if (!response.ok) {
      console.error("Error fetching geocode:", response.statusText);
      return null;
    }
    const data = await response.json();
    // console.log("Nominatim response:", data);
    if (Array.isArray(data) && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      console.warn("Không tìm thấy kết quả từ Nominatim cho truy vấn:", query);
    }
  } catch (error) {
    console.error("Error in getUserCoordinatesByAddress:", error);
  }
  return null;
}

// -----------------------
// Hàm lấy tọa độ người dùng dựa vào 3 mã: ward, district, province
// Sử dụng mapping cố định nếu có; nếu không thì gọi API provinces.open-api.vn để chuyển đổi
// Cuối cùng xây dựng truy vấn cho Nominatim
// -----------------------
async function getUserCoordinatesFromCodes(
  ward: string,
  district: string,
  province: string
): Promise<Coordinates | null> {
  // Bước 1: Thử lấy địa chỉ từ mapping cố định
  let address: string = await getAddressFromCodes(ward, district, province);

  // Bước 2: Nếu không có mapping cố định, gọi API provinces.open-api.vn để chuyển đổi mã
  if (!address) {
    address = await getAddressFromProvinceAPI(ward, district);
    if (address) {
      // console.log("Province API chuyển đổi thành công, address:", address);
    }
  }

  // Bước 3: Nếu vẫn không có kết quả, sử dụng fallback là chuỗi gồm các mã
  let query = "";
  if (address) {
    query = `${address}, Vietnam`;
    // console.log("Geocoding converted address:", query);
  } else {
    query = `${ward}, ${district}, ${province}, Vietnam`;
    console.warn("Không chuyển đổi được các mã sang địa chỉ hợp lệ. Sử dụng fallback query:", query);
  }

  return await getUserCoordinatesByAddress(query);
}

// -----------------------
// Hàm chuyển đổi độ sang radian (dùng trong công thức Haversine)
// -----------------------
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// -----------------------
// Hàm tính khoảng cách giữa 2 điểm theo công thức Haversine
// -----------------------
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Bán kính Trái đất (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// -----------------------
// Hàm tính phí vận chuyển (làm tròn đến 1000đ)
// -----------------------
function calculateShippingCost(distanceKm: number): number {
  const baseFee = 15000; // Phí cơ bản
  const maxDistance = 50; // Khoảng cách áp dụng giá cơ bản
  const roundToThousand = (num: number) => Math.ceil(num / 1000) * 1000;

  if (distanceKm > maxDistance) {
    if (distanceKm <= 100) {
      return roundToThousand(baseFee + distanceKm * 400);
    } else if (distanceKm <= 300) {
      return roundToThousand(baseFee + 40000 + (distanceKm - 100) * 200);
    } else {
      return roundToThousand(baseFee + 40000 + 40000 + (distanceKm - 300) * 50);
    }
  }
  return roundToThousand(baseFee + distanceKm * 400);
}

// -----------------------
// Hàm ước tính thời gian giao hàng (tính theo giây)
// -----------------------
function estimateDeliveryTime(distanceKm: number): number {
  const averageSpeed = 20; // km/h
  const timeInHours = distanceKm / averageSpeed;
  const processingHours = 48; // giờ xử lý đơn hàng
  return (timeInHours + processingHours) * 3600;
}

// -----------------------
// Hàm định dạng thời gian từ giây sang "ngày giờ"
// -----------------------
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} ngày ${remainingHours} giờ`;
  }
  return `${hours} giờ`;
}

// -----------------------
// API Handler GET
// -----------------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Lấy 3 thông tin: ward, district, province từ query parameters
    const ward = searchParams.get("ward") || "";
    const district = searchParams.get("district") || "";
    const province = searchParams.get("province") || "";

    // Kiểm tra bắt buộc (district và province phải có)
    if (!district || !province) {
      return NextResponse.json(
        { error: "Thiếu thông tin địa chỉ. Vui lòng cung cấp các mã: district, province và ward nếu có." },
        { status: 400 }
      );
    }

    // Tọa độ shop (cố định)
    const shopCoords = { lat: 10.825751, lon: 106.701578 };

    // Lấy tọa độ người dùng dựa vào 3 mã (ward, district, province)
    const userCoords = await getUserCoordinatesFromCodes(ward, district, province);
    if (!userCoords) {
      return NextResponse.json(
        { error: `Không thể tìm thấy tọa độ cho các thông tin: ward="${ward}", district="${district}", province="${province}". Vui lòng kiểm tra lại thông tin.` },
        { status: 400 }
      );
    }

    // Tính khoảng cách giữa shop và người dùng
    const distanceKm = calculateDistance(shopCoords.lat, shopCoords.lon, userCoords.lat, userCoords.lon);
    const durationSeconds = estimateDeliveryTime(distanceKm);

    // console.log("Calculation results:", {
    //   distance: distanceKm,
    //   duration: durationSeconds,
    //   from: shopCoords,
    //   to: userCoords,
    // });

    return NextResponse.json({
      shippingCost: calculateShippingCost(distanceKm),
      estimatedTime: formatDuration(durationSeconds),
      distance: Math.round(distanceKm * 10) / 10,
    });
  } catch (error) {
    console.error("Shipping estimate error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
