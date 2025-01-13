import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const orders = [
  {
    id: '1',
    date: '2024-01-15',
    status: 'Delivered',
    total: 199.99,
    items: [
      {
        id: '1',
        name: 'Nike Air Max 270',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        price: 159.99,
        quantity: 1
      }
    ]
  },
  {
    id: '2', 
    date: '2024-01-10',
    status: 'Processing',
    total: 299.99,
    items: [
      {
        id: '2',
        name: 'Nike Air Zoom Pegasus',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
        price: 129.99,
        quantity: 2
      }
    ]
  }
];

const RecentOrders = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'Delivered' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </div>
            
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="font-bold">${item.price}</p>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="font-bold">Total: ${order.total}</span>
              <Link
                href={`/orders/${order.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders; 