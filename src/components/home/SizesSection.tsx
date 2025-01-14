import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SizesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Find Your Perfect Fit</h2>
            <p className="text-gray-600 mb-8">
              Not sure about your size? Use our size guide to find the perfect fit for your feet.
            </p>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Size Conversion Chart</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2">US</th>
                      <th className="px-4 py-2">UK</th>
                      <th className="px-4 py-2">EU</th>
                      <th className="px-4 py-2">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className="border px-4 py-2 text-center">6</td>
                    <td className="border px-4 py-2 text-center">5.5</td>
                    <td className="border px-4 py-2 text-center">39</td>
                    <td className="border px-4 py-2 text-center">24</td>
                                </tr>
                                <tr>
                    <td className="border px-4 py-2 text-center">7</td>
                    <td className="border px-4 py-2 text-center">6.5</td>
                    <td className="border px-4 py-2 text-center">40</td>
                    <td className="border px-4 py-2 text-center">24.5</td>
                  </tr>
                    <tr>
                      <td className="border px-4 py-2 text-center">8</td>
                      <td className="border px-4 py-2 text-center">7.5</td>
                      <td className="border px-4 py-2 text-center">41</td>
                      <td className="border px-4 py-2 text-center">25</td>
                                </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Link
              href="/size-guide"
              className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              View Size Guide
            </Link>
          </div>

          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
              alt="Shoe Measurement"
              width={800}
              height={400}
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-black p-4 rounded-xl shadow-lg">
              <p className="font-semibold">Pro Tip:</p>
              <p className="text-sm">Measure your feet in the evening when they're at their largest</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizesSection; 