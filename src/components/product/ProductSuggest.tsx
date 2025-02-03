import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ProductSuggestProps {
  categoryId: string;
  currentProductId: string;
}

const relatedProducts = [
  {
    id: "2",
    name: "Nike Air Zoom Pegasus",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    rating: 4.8,
    reviewCount: 95,
  },
  {
    id: "3",
    name: "Nike Free RN",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329",
    rating: 4.6,
    reviewCount: 82,
  },
  {
    id: "4",
    name: "Nike Revolution",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1605408499391-6368c628ef42",
    rating: 4.4,
    reviewCount: 67,
  },
];

const ProductSuggest: React.FC<ProductSuggestProps> = ({
  currentProductId,
  categoryId: _unusedCategoryId,
}) => {
  const filteredProducts = relatedProducts.filter(
    (prod) => prod.id !== currentProductId
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="relative mb-4 aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-blue-600">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star${
                        i + 1 > product.rating ? "-half-alt" : ""
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount})
                </span>
              </div>
              <span className="font-bold">${product.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductSuggest;
