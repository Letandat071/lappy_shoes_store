const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
};

export default ProductSkeleton; 