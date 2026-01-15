'use client';

import { useState } from 'react';
import { LocalPagesGenerator } from '@/components/LocalPagesGenerator';

export default function AdminLocalPagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Service Pages</h1>
        <p className="text-sm text-slate-600">
          Generate, review, and publish location-based service pages for hood cleaning.
        </p>
      </div>
      <LocalPagesGenerator />
    </div>
  );
}
