"use client";

import React from 'react';

interface ShippingAddressPreviewProps {
  addressDetail: string;
  regionName: string;
}

const ShippingAddressPreview: React.FC<ShippingAddressPreviewProps> = ({ addressDetail, regionName }) => {
  return (
    <div className="mt-4 p-3 border rounded">
      <h4 className="font-semibold mb-2">Địa chỉ hiển thị</h4>
      <p>
        {addressDetail}
        {regionName && `, ${regionName}`}
      </p>
    </div>
  );
};

export default ShippingAddressPreview; 