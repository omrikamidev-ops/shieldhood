'use client';

import { useState } from 'react';
import { LocalPagesGenerator } from '@/components/LocalPagesGenerator';

export default function AdminLocalPagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Local SEO Pages</h1>
        <p className="text-sm text-slate-600">
          Generate, review, and publish location-based SEO pages for hood cleaning services.
        </p>
      </div>
      <LocalPagesGenerator />
    </div>
  );
}
