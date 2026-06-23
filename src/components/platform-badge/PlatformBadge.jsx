import React from 'react';

export default function PlatformBadge({ platform }) {
  if (!platform) return null;

  const { name, brand_color } = platform;

  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
      style={{ backgroundColor: brand_color || '#3f3f46' }}
    >
      {name}
    </span>
  );
}
