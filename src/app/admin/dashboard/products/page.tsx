"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useImageUpload } from "@/lib/cloudinary";
import mongoose from "mongoose";
import ProductCard from "@/components/admin/ProductCard";

interface Category {
  _id: string;
  name: string;
}

interface Feature {
  _id: string;
  name: string;
  icon: string;
}

interface ProductImage {
  url: string;
  color?: string;
  version?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

interface ProductResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: Array<{
    url: string;
    color?: string;
    version?: string;
  }>;
  category: {
    _id: mongoose.Types.ObjectId;
    name: string;
  } | null;
  features: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    icon: string;
  }>;
  status: string;
  rating?: number;
  reviewCount?: number;
  brand: string;
  colors: string[];
  sizes: Array<{
    size: string;
    quantity: number;
  }>;
  totalQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  images: ProductImage[];
  category: string;
  features: string[];
  targetAudience: string;
  sizes: ProductSize[];
  brand: string;
  colors: string[];
  status: "in-stock" | "out-of-stock" | "coming-soon";
}

interface ProductSize {
  size: string;
  quantity: number;
}

interface ApiResponse {
  products: ProductResponse[];
  pagination: Pagination;
}

export default function ProductsPage() {
  const { uploadImage } = useImageUpload();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(
    null
  );
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });

  const initialFormData: FormData = {
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    images: [],
    category: "",
    features: [],
    targetAudience: "",
    sizes: [],
    brand: "",
    colors: [],
    status: "in-stock",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Bọc fetchProducts bằng useCallback để tránh cảnh báo dependency của useEffect
  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...filters,
        });

        const response = await fetch(
          "/api/admin/products?" + queryParams.toString()
        );
        const data: ApiResponse = await response.json();

        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch {
        toast.error("Lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, filters]
  );

  // Fetch categories và features
  const fetchCategoriesAndFeatures = async () => {
    try {
      const [categoriesRes, featuresRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/features"),
      ]);

      const categoriesData = await categoriesRes.json();
      const featuresData = await featuresRes.json();

      if (categoriesData.categories) setCategories(categoriesData.categories);
      if (featuresData.features) setFeatures(featuresData.features);
    } catch {
      toast.error("Lỗi khi tải danh mục và tính năng");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndFeatures();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(1);
  }, [filters, fetchProducts]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? "/api/admin/products"
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";
      const body = editingProduct
        ? { ...formData, id: editingProduct._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          editingProduct
            ? "Cập nhật sản phẩm thành công"
            : "Thêm sản phẩm thành công"
        );
        fetchProducts(pagination.page);
        setModalOpen(false);
        resetForm();
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã có lỗi xảy ra");
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string | mongoose.Types.ObjectId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        const response = await fetch(`/api/admin/products?id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Xóa sản phẩm thành công");
          fetchProducts(pagination.page);
        } else {
          throw new Error(data.error);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Đã có lỗi xảy ra");
        }
      }
    }
  };

  // Handle edit
  const handleEdit = (product: ProductResponse) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      images: product.images.map((image) => ({
        url: image.url,
        color: image.color,
        version: image.version,
        isUploading: false,
        uploadProgress: 0,
      })),
      category: product.category ? product.category._id.toString() : "",
      features: product.features.map((f) => f._id.toString()),
      targetAudience: (product as any).targetAudience || "",
      sizes: product.sizes,
      brand: product.brand,
      colors: product.colors,
      status: product.status as "in-stock" | "out-of-stock" | "coming-soon",
    });
    setModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProduct(null);
  };

  // Xử lý upload ảnh
  const handleImageUpload = useCallback(
    async (files: FileList) => {
      const newImages: ProductImage[] = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        isUploading: true,
        uploadProgress: 0,
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          const url = await uploadImage(file);
          setFormData((prev) => {
            const updatedImages = [...prev.images];
            const currentIndex = prev.images.length - files.length + index;
            updatedImages[currentIndex] = {
              url,
              color: "",
              version: "",
              isUploading: false,
              uploadProgress: 100,
            };
            return { ...prev, images: updatedImages };
          });
        } catch {
          toast.error(`Lỗi khi tải ảnh ${file.name}`);
          setFormData((prev) => {
            const updatedImages = prev.images.filter(
              (_, i) => i !== prev.images.length - files.length + index
            );
            return { ...prev, images: updatedImages };
          });
        }
      });

      await Promise.all(uploadPromises);
    },
    [uploadImage]
  );

  // Xử lý xóa ảnh
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Xử lý cập nhật thông tin ảnh
  const handleImageUpdate = (index: number, updates: Partial<ProductImage>) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = { ...updatedImages[index], ...updates };
      return { ...prev, images: updatedImages };
    });
  };

  if (loading) {
    return <div className="p-4">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData(initialFormData);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border rounded-lg px-4 py-2"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <select
          className="border rounded-lg px-4 py-2"
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="border rounded-lg px-4 py-2"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="">Tất cả trạng thái</option>
          <option value="in-stock">Còn hàng</option>
          <option value="out-of-stock">Hết hàng</option>
          <option value="coming-soon">Sắp về hàng</option>
        </select>
        <input
          type="number"
          placeholder="Giá tối thiểu"
          className="border rounded-lg px-4 py-2"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Giá tối đa"
          className="border rounded-lg px-4 py-2"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
          }
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((__, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => fetchProducts(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {[...Array(pagination.totalPages)].map((__, i) => (
                <button
                  key={i}
                  onClick={() => fetchProducts(i + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    pagination.page === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  fetchProducts(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-box-open text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy sản phẩm nào
          </h3>
          <p className="text-gray-500">
            Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="relative bg-white rounded-lg w-full max-w-2xl my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <form
                  id="product-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block mb-2">Tên sản phẩm</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Hình ảnh sản phẩm</label>
                    <div className="space-y-4">
                      {/* Image Upload Area */}
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files && handleImageUpload(e.target.files)
                          }
                        />
                        <p>Kéo thả ảnh vào đây hoặc click để chọn ảnh</p>
                      </div>

                      {/* Image Preview List */}
                      <div className="grid grid-cols-2 gap-4">
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative border rounded-lg p-2"
                          >
                            {image.url && (
                              <div className="relative h-40 mb-2">
                                <Image
                                  src={image.url}
                                  alt={`Product image ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {image.isUploading && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="w-full max-w-[80%]">
                                      <div className="bg-gray-200 rounded-full h-2.5">
                                        <div
                                          className="bg-blue-600 h-2.5 rounded-full"
                                          style={{
                                            width: `${image.uploadProgress}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Màu sắc"
                                value={image.color || ""}
                                onChange={(e) =>
                                  handleImageUpdate(index, {
                                    color: e.target.value,
                                  })
                                }
                                className="w-full border rounded px-2 py-1 text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Phiên bản"
                                value={image.version || ""}
                                onChange={(e) =>
                                  handleImageUpdate(index, {
                                    version: e.target.value,
                                  })
                                }
                                className="w-full border rounded px-2 py-1 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="text-red-500 text-sm hover:text-red-700"
                                disabled={image.isUploading}
                              >
                                Xóa ảnh
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Giá</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Giá gốc</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Danh mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Tính năng</label>
                    <select
                      multiple
                      value={formData.features}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          features: Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          ),
                        })
                      }
                      className="w-full border rounded-lg p-2"
                    >
                      {features.map((feature) => (
                        <option key={feature._id} value={feature._id}>
                          {feature.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Đối tượng</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAudience: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    >
                      <option value="">Chọn đối tượng</option>
                      <option value="men">Nam</option>
                      <option value="women">Nữ</option>
                      <option value="unisex">Unisex</option>
                      <option value="kids">Trẻ em</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Kích cỡ và số lượng</label>
                    <div className="space-y-2">
                      {formData.sizes.map((size, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={size.size}
                            onChange={(e) => {
                              const newSizeValue = e.target.value.trim();
                              const isDuplicate = formData.sizes.some(
                                (s, idx) =>
                                  idx !== index &&
                                  s.size.trim().toLowerCase() ===
                                    newSizeValue.toLowerCase()
                              );
                              if (newSizeValue !== "" && isDuplicate) {
                                toast.error("Kích thước đã được thêm rồi");
                                return;
                              }
                              const newSizes = [...formData.sizes];
                              newSizes[index].size = e.target.value;
                              setFormData({ ...formData, sizes: newSizes });
                            }}
                            className="border rounded-lg p-2 w-1/2"
                            placeholder="Kích cỡ"
                          />
                          <input
                            type="number"
                            value={size.quantity}
                            onChange={(e) => {
                              const newSizes = [...formData.sizes];
                              newSizes[index].quantity = Number(e.target.value);
                              setFormData({ ...formData, sizes: newSizes });
                            }}
                            className="border rounded-lg p-2 w-1/2"
                            placeholder="Số lượng"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSizes = formData.sizes.filter(
                                (_, i) => i !== index
                              );
                              setFormData({ ...formData, sizes: newSizes });
                            }}
                            className="text-red-500"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            sizes: [
                              ...formData.sizes,
                              { size: "", quantity: 0 },
                            ],
                          })
                        }
                        className="text-blue-500"
                      >
                        Thêm kích cỡ
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Thương hiệu</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Màu sắc</label>
                    <input
                      type="text"
                      value={formData.colors.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          colors: e.target.value
                            .split(",")
                            .map((c) => c.trim()),
                        })
                      }
                      className="w-full border rounded-lg p-2"
                      placeholder="Các màu cách nhau bằng dấu phẩy"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as typeof formData.status,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                      required
                    >
                      <option value="in-stock">Còn hàng</option>
                      <option value="out-of-stock">Hết hàng</option>
                      <option value="coming-soon">Sắp về</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2"
                      rows={4}
                      required
                    />
                  </div>
                </form>
              </div>

              <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  form="product-form"
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingProduct ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
