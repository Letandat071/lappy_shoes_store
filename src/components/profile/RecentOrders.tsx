import React from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  productName: string;
  image: string;
  status: string;
  date: string;
  price: number;
}

const RecentOrders = () => {
  const orders: Order[] = [
    {
      id: '12345',
      productName: 'Nike Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      status: 'Delivered',
      date: 'Nov 8, 2023',
      price: 129.99
    },
    {
      id: '12346',
      productName: 'Adidas Ultraboost',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
      status: 'In Transit',
      date: 'Nov 5, 2023',
      price: 159.99
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Recent Orders</h3>
        <Link href="/orders" className="text-black hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <img 
              src={order.image}
              alt={order.productName}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{order.productName}</h4>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                </div>
                <span className={`text-sm ${
                  order.status === 'Delivered' ? 'text-green-500' : 'text-blue-500'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">{order.date}</span>
                <span className="font-semibold">${order.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders; 