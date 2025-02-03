"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import HeroSection from "@/components/home/HeroSection";

const DEFAULT_BANNER = {
  image: "",
  event: "",
  titleLine1: "",
  titleLine2: "",
  description: "",
  highlightedWords: [],
  stats: [],
  features: [],
  styles: {
    backgroundColor: {
      from: "#111827",
      via: "#000000",
      to: "#111827",
    },
    eventBadge: {
      textColor: "#FCD34D",
      backgroundColor: "rgba(251, 191, 36, 0.1)",
    },
    title: {
      glowColor: "#FCD34D",
      gradientColors: {
        from: "#FCD34D",
        via: "#EF4444",
        to: "#9333EA",
      },
    },
    description: {
      textColor: "#D1D5DB",
    },
    buttons: {
      primary: {
        textColor: "#000000",
        backgroundColor: "#FFFFFF",
        hoverBackgroundColor: "#FCD34D",
      },
      secondary: {
        textColor: "#FFFFFF",
        borderColor: "#FFFFFF",
        hoverBackgroundColor: "#FFFFFF",
        hoverTextColor: "#000000",
      },
    },
    stats: {
      valueColor: "#FFFFFF",
      labelColor: "#9CA3AF",
    },
    glowEffects: {
      topLeft: {
        color: "#FCD34D",
        opacity: 0.5,
        blur: 100,
      },
      bottomRight: {
        color: "#9333EA",
        opacity: 0.5,
        blur: 100,
      },
    },
  },
  overlayOpacity: 0.2,
  particlesEnabled: true,
};

interface HeroBanner {
  image: string;
  event: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  highlightedWords: Array<{ text: string; color: string }>;
  stats: Array<{ value: string; label: string }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
    iconBgColor: string;
  }>;
  styles: {
    backgroundColor: {
      from: string;
      via: string;
      to: string;
    };
    eventBadge: {
      textColor: string;
      backgroundColor: string;
    };
    title: {
      glowColor: string;
      gradientColors: {
        from: string;
        via: string;
        to: string;
      };
    };
    description: {
      textColor: string;
    };
    buttons: {
      primary: {
        textColor: string;
        backgroundColor: string;
        hoverBackgroundColor: string;
      };
      secondary: {
        textColor: string;
        borderColor: string;
        hoverBackgroundColor: string;
        hoverTextColor: string;
      };
    };
    stats: {
      valueColor: string;
      labelColor: string;
    };
    glowEffects: {
      topLeft: {
        color: string;
        opacity: number;
        blur: number;
      };
      bottomRight: {
        color: string;
        opacity: number;
        blur: number;
      };
    };
  };
  overlayOpacity: number;
  particlesEnabled: boolean;
}

export default function BannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<HeroBanner>(DEFAULT_BANNER);

  useEffect(() => {
    setMounted(true);
    fetchHeroBanner();
  }, []);

  const fetchHeroBanner = async () => {
    try {
      const res = await fetch("/api/admin/banner");
      if (!res.ok) {
        throw new Error("Failed to fetch hero banner");
      }
      const data = await res.json();
      // Đảm bảo data có đầy đủ styles
      setFormData({
        ...DEFAULT_BANNER,
        ...data,
        styles: {
          ...DEFAULT_BANNER.styles,
          ...(data.styles || {}),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error);
        setError(error.message);
      } else {
        console.error("Unknown error:", error);
        setError("Đã có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.image) {
        throw new Error("Vui lòng tải lên hình ảnh banner");
      }

      const res = await fetch("/api/admin/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Không thể cập nhật banner");
      }

      router.push("/admin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error);
        setError(error.message);
      } else {
        console.error("Unknown error:", error);
        setError("Đã có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tránh render khi chưa hydrate
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Hero Banner</h1>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          {showPreview ? "Ẩn xem trước" : "Xem trước"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      {showPreview && (
        <div className="mb-8 border rounded-lg overflow-hidden">
          <HeroSection banner={formData} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Cài đặt chung</h2>

          <ImageUploader
            currentImage={formData.image}
            onImageUpload={handleImageUpload}
            onError={setError}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Màu nền</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Màu bắt đầu
                </label>
                <input
                  type="color"
                  value={formData.styles.backgroundColor.from}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      styles: {
                        ...prev.styles,
                        backgroundColor: {
                          ...prev.styles.backgroundColor,
                          from: e.target.value,
                        },
                      },
                    }))
                  }
                  className="mt-1 block w-full h-10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Màu giữa
                </label>
                <input
                  type="color"
                  value={formData.styles.backgroundColor.via}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      styles: {
                        ...prev.styles,
                        backgroundColor: {
                          ...prev.styles.backgroundColor,
                          via: e.target.value,
                        },
                      },
                    }))
                  }
                  className="mt-1 block w-full h-10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Màu kết thúc
                </label>
                <input
                  type="color"
                  value={formData.styles.backgroundColor.to}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      styles: {
                        ...prev.styles,
                        backgroundColor: {
                          ...prev.styles.backgroundColor,
                          to: e.target.value,
                        },
                      },
                    }))
                  }
                  className="mt-1 block w-full h-10 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Độ mờ overlay
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.overlayOpacity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    overlayOpacity: parseFloat(e.target.value),
                  }))
                }
                className="mt-1 block w-full"
              />
              <span className="text-sm text-gray-500">
                {formData.overlayOpacity}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.particlesEnabled}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    particlesEnabled: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-indigo-600 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Bật hiệu ứng particles
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Nội dung</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sự kiện
            </label>
            <input
              type="text"
              value={formData.event}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, event: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tiêu đề dòng 1
              </label>
              <input
                type="text"
                value={formData.titleLine1}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    titleLine1: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tiêu đề dòng 2
              </label>
              <input
                type="text"
                value={formData.titleLine2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    titleLine2: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Highlighted Words */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Từ nổi bật</h2>
          {formData.highlightedWords.map((word, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={word.text}
                onChange={(e) => {
                  const newWords = [...formData.highlightedWords];
                  newWords[index].text = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    highlightedWords: newWords,
                  }));
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Nội dung"
              />
              <input
                type="color"
                value={word.color}
                onChange={(e) => {
                  const newWords = [...formData.highlightedWords];
                  newWords[index].color = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    highlightedWords: newWords,
                  }));
                }}
                className="w-32 h-10 rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  const newWords = formData.highlightedWords.filter(
                    (_, i) => i !== index
                  );
                  setFormData((prev) => ({
                    ...prev,
                    highlightedWords: newWords,
                  }));
                }}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                highlightedWords: [
                  ...prev.highlightedWords,
                  { text: "", color: "#000000" },
                ],
              }));
            }}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Thêm từ nổi bật
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Thống kê</h2>
          {formData.stats.map((stat, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...formData.stats];
                  newStats[index].value = e.target.value;
                  setFormData((prev) => ({ ...prev, stats: newStats }));
                }}
                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Giá trị"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...formData.stats];
                  newStats[index].label = e.target.value;
                  setFormData((prev) => ({ ...prev, stats: newStats }));
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Nhãn"
              />
              <button
                type="button"
                onClick={() => {
                  const newStats = formData.stats.filter((_, i) => i !== index);
                  setFormData((prev) => ({ ...prev, stats: newStats }));
                }}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                stats: [...prev.stats, { value: "", label: "" }],
              }));
            }}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Thêm thống kê
          </button>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Tính năng</h2>
          {formData.features.map((feature, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-2 mb-4 p-4 border rounded-md"
            >
              <div>
                <label className="block text-xs text-gray-500">
                  Icon (Font Awesome)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index].icon = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        features: newFeatures,
                      }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ví dụ: fa-shoe-prints"
                  />
                  <div className="text-xs text-gray-500">
                    Một số icon phổ biến:
                    <ul className="mt-1 grid grid-cols-2 gap-2">
                      <li>
                        <code>fa-shoe-prints</code> - 👟 Icon giày
                      </li>
                      <li>
                        <code>fa-tag</code> - 🏷️ Icon thẻ giá
                      </li>
                      <li>
                        <code>fa-truck</code> - 🚚 Icon vận chuyển
                      </li>
                      <li>
                        <code>fa-box</code> - 📦 Icon hộp
                      </li>
                      <li>
                        <code>fa-star</code> - ⭐ Icon sao
                      </li>
                      <li>
                        <code>fa-check</code> - ✓ Icon tích
                      </li>
                      <li>
                        <code>fa-gift</code> - 🎁 Icon quà
                      </li>
                      <li>
                        <code>fa-heart</code> - ❤️ Icon tim
                      </li>
                    </ul>
                    <p className="mt-1">
                      Xem thêm icon tại:{" "}
                      <a
                        href="https://fontawesome.com/icons"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Font Awesome Icons
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500">
                  Màu nền icon
                </label>
                <input
                  type="color"
                  value={feature.iconBgColor}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index].iconBgColor = e.target.value;
                    setFormData((prev) => ({ ...prev, features: newFeatures }));
                  }}
                  className="w-full h-10 rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500">Tiêu đề</label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index].title = e.target.value;
                    setFormData((prev) => ({ ...prev, features: newFeatures }));
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Tiêu đề tính năng"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500">Mô tả</label>
                <textarea
                  value={feature.description}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index].description = e.target.value;
                    setFormData((prev) => ({ ...prev, features: newFeatures }));
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={2}
                  placeholder="Mô tả tính năng"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newFeatures = formData.features.filter(
                      (_, i) => i !== index
                    );
                    setFormData((prev) => ({ ...prev, features: newFeatures }));
                  }}
                  className="px-2 py-1 text-red-600 hover:text-red-800"
                >
                  Xóa tính năng
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                features: [
                  ...prev.features,
                  {
                    icon: "",
                    title: "",
                    description: "",
                    iconBgColor: "#ffffff",
                  },
                ],
              }));
            }}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Thêm tính năng
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
