import React from 'react';
import { Dialog } from '@headlessui/react';
import { formatPrice } from '@/utils/format';
import ImageWithFallback from '@/components/common/ImageWithFallback';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  size: string;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  createdAt: string;
}

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_MAP = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};

const PAYMENT_STATUS_MAP = {
  pending: 'Chờ thanh toán',
  completed: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  refunded: 'Đã hoàn tiền'
};

const PAYMENT_METHOD_MAP = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'VNPay',
  ZALOPAY: 'ZaloPay'
};

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Chi tiết đơn hàng #{order._id.slice(-6)}
          </Dialog.Title>

          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin đơn hàng */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Thông tin đơn hàng</h3>
                <dl className="mt-2 text-sm text-gray-600">
                  <div className="flex justify-between py-2">
                    <dt>Trạng thái</dt>
                    <dd className="font-medium">{STATUS_MAP[order.status as keyof typeof STATUS_MAP]}</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt>Ngày đặt</dt>
                    <dd className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt>Phương thức thanh toán</dt>
                    <dd className="font-medium">
                      {PAYMENT_METHOD_MAP[order.paymentMethod as keyof typeof PAYMENT_METHOD_MAP]}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt>Trạng thái thanh toán</dt>
                    <dd className="font-medium">
                      {PAYMENT_STATUS_MAP[order.paymentStatus as keyof typeof PAYMENT_STATUS_MAP]}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Thông tin giao hàng */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Thông tin giao hàng</h3>
                <dl className="mt-2 text-sm text-gray-600">
                  <div className="py-2">
                    <dt className="font-medium">Người nhận</dt>
                    <dd>{order.shippingAddress.fullName}</dd>
                  </div>
                  <div className="py-2">
                    <dt className="font-medium">Số điện thoại</dt>
                    <dd>{order.shippingAddress.phone}</dd>
                  </div>
                  <div className="py-2">
                    <dt className="font-medium">Địa chỉ</dt>
                    <dd>{order.shippingAddress.address}</dd>
                  </div>
                  <div className="py-2">
                    <dt className="font-medium">Thành phố</dt>
                    <dd>{order.shippingAddress.city}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Sản phẩm</h3>
              <div className="mt-2 divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="py-4 flex">
                    <div className="flex-shrink-0 w-24 h-24 relative">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price)}₫
                        </p>
                      </div>
                      <div className="mt-1 flex text-sm text-gray-600">
                        <p>Size: {item.size}</p>
                        <p className="ml-4">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="mt-6 flex justify-end">
              <div className="text-sm">
                <div className="flex justify-between font-medium">
                  <dt>Tổng tiền</dt>
                  <dd className="text-gray-900">{formatPrice(order.totalAmount)}₫</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Đóng</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 