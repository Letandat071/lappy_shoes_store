export const formatPrice = (price: number | undefined | null): string => {
  if (typeof price !== 'number') {
    console.warn('Invalid price value:', price);
    return '0';
  }
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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
