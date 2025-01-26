export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0
  });
};

export const formatNumber = (number: number): string => {
  return number.toLocaleString('vi-VN', {
    maximumFractionDigits: 0
  });
}; 