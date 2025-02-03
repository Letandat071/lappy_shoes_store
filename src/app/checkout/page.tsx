"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShippingForm from "@/components/checkout/ShippingForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { useCartContext } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setCart } = useCartContext();
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shipping, setShipping] = useState(30000);
  const [estimatedTime, setEstimatedTime] = useState("Đang tính...");

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleShippingSubmit = async (address: {
    fullName: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
  }) => {
    try {
      // Gọi API tính phí ship
      const params = new URLSearchParams({
        userAddress: address.address,
        province: address.province,
        district: address.district,
        ward: address.ward,
      });

      const res = await fetch(`/api/shipping-estimate?${params}`);
      if (res.ok) {
        const data = await res.json();
        setShipping(data.shippingCost);
        setEstimatedTime(data.estimatedTime);
      } else {
        setShipping(subtotal >= 1000000 ? 0 : 30000);
        setEstimatedTime("Không xác định");
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      setShipping(subtotal >= 1000000 ? 0 : 30000);
      setEstimatedTime("Không xác định");
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Vui lòng nhập thông tin giao hàng");
      return;
    }

    const isConfirmed = window.confirm("Bạn có chắc muốn đặt hàng không?");
    if (!isConfirmed) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            color: "default",
          })),
          totalAmount: subtotal + shipping,
          shippingAddress: {
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            province: shippingAddress.province,
            district: shippingAddress.district,
            ward: shippingAddress.ward,
          },
          paymentMethod: "COD",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Đặt hàng thất bại");
      }

      toast.success("Đặt hàng thành công!");
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      window.location.href = "/checkout/success";
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng");
      window.location.href = "/checkout/failed";
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressSelect = (address: any) => {
    setShippingAddress({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      province: address.province,
      district: address.district,
      ward: address.ward,
    });
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link href="/cart" className="hover:text-black">
              Giỏ hàng
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">Thanh toán</span>
          </nav>
        </div>

        {/* Checkout Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Forms */}
            <div className="lg:w-2/3 space-y-6">
              <ShippingForm onSubmit={handleShippingSubmit} />
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <CheckoutSummary
                items={cart.items}
                subtotal={subtotal}
                shipping={shipping}
                total={subtotal + shipping}
                estimatedTime={estimatedTime}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
