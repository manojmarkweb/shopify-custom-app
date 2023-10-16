import { ProgressBar as PolarisProgressBar } from '@shopify/polaris';
import React from 'react';

export default function CustomProgressBar() {
  return (
    <div style={{ width: 225 }}>
      <PolarisProgressBar progress={75} />
    </div>
  );
}
