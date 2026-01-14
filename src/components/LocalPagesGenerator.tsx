'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRIMARY_KEYWORDS, INTENT_OPTIONS, isValidPrimaryKeyword } from '@/lib/localPagesConfig';
import type { LocalPageData, BulkCsvRow } from '@/lib/localPages/types';

type Tab = 'generate' | 'bulk' | 'recent';

export function LocalPagesGenerator() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate Draft tab state
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [intent, setIntent] = useState('');
  const [locationType, setLocationType] = useState<'city' | 'zip'>('city');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [county, setCounty] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  // Bulk CSV tab state
  const [csvContent, setCsvContent] = useState('');
  const [skipExisting, setSkipExisting] = useState(true);
  const [bulkLog, setBulkLog] = useState<string[]>([]);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  // Recent Pages tab state
  const [recentPages, setRecentPages] = useState<LocalPageData[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Load recent pages
  useEffect(() => {
    loadRecentPages();
  }, []);

  const loadRecentPages = async () => {
    try {
      const res = await fetch('/api/local-pages/list?limit=100');
      const data = await res.json();
      setRecentPages(data);
    } catch (err) {
      console.error('Failed to load recent pages:', err);
    }
  };

  // Auto-generate slug
  useEffect(() => {
    if (!slugTouched && primaryKeyword) {
      if (locationType === 'zip' && zip) {
        setSlug(`/${primaryKeyword}-${zip}`);
      } else if (locationType === 'city' && city) {
        const citySlug = city.toLowerCase().replace(/\s+/g, '-');
        setSlug(`/${primaryKeyword}/${citySlug}-ca`);
      }
    }
  }, [primaryKeyword, locationType, city, zip, slugTouched]);

  const handleGenerateDraft = async () => {
    if (!primaryKeyword || !intent) {
      setError('Primary keyword and intent are required');
      return;
    }
    if (locationType === 'city' && !city) {
      setError('City is required');
      return;
    }
    if (locationType === 'zip' && !zip) {
      setError('ZIP is required');
      return;
    }
    if (locationType === 'zip' && !/^\d{5}$/.test(zip)) {
      setError('ZIP must be 5 digits');
      return;
    }
    if (!slug) {
      setError('Slug is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/local-pages/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryKeyword: PRIMARY_KEYWORDS.find((kw) => kw.slug === primaryKeyword)?.label || primaryKeyword,
          primaryKeywordSlug: primaryKeyword,
          city: locationType === 'city' ? city : undefined,
          zip: locationType === 'zip' ? zip : undefined,
          county: county || undefined,
          state: 'CA',
          intent,
          slug,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate draft');
      }

      router.refresh();
      loadRecentPages();
      setActiveTab('recent');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate draft');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!csvContent.trim()) {
      setError('CSV content is required');
      return;
    }

    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows: BulkCsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row: BulkCsvRow = {
        primary_keyword_slug: values[0] || '',
        city: values[1] || undefined,
        zip: values[2] || undefined,
        county: values[3] || undefined,
        intent: values[4] || 'information',
        slug: values[5] || undefined,
      };
      rows.push(row);
    }

    setBulkProgress({ current: 0, total: rows.length });
    setBulkLog([]);
    setLoading(true);
    setError('');

    const log = (message: string) => {
      setBulkLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      setBulkProgress({ current: i + 1, total: rows.length });

      // Validate row
      if (!isValidPrimaryKeyword(row.primary_keyword_slug)) {
        log(`Row ${i + 1}: Invalid primary keyword "${row.primary_keyword_slug}"`);
        continue;
      }
      if (!row.city && !row.zip) {
        log(`Row ${i + 1}: Must provide city or zip`);
        continue;
      }
      if (row.zip && !/^\d{5}$/.test(row.zip)) {
        log(`Row ${i + 1}: Invalid ZIP "${row.zip}"`);
        continue;
      }

      // Check if slug exists
      if (skipExisting && row.slug) {
        try {
          const checkRes = await fetch('/api/local-pages/check-slugs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slugs: [row.slug] }),
          });
          const checkData = await checkRes.json();
          if (checkData.existing.includes(row.slug)) {
            log(`Row ${i + 1}: Skipping existing slug "${row.slug}"`);
            continue;
          }
        } catch (err) {
          log(`Row ${i + 1}: Error checking slug: ${err}`);
        }
      }

      // Generate draft
      try {
        const res = await fetch('/api/local-pages/generate-draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            primaryKeyword: PRIMARY_KEYWORDS.find((kw) => kw.slug === row.primary_keyword_slug)?.label || row.primary_keyword_slug,
            primaryKeywordSlug: row.primary_keyword_slug,
            city: row.city,
            zip: row.zip,
            county: row.county,
            state: 'CA',
            intent: row.intent,
            slug: row.slug,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          log(`Row ${i + 1}: Error - ${data.error || 'Failed'}`);
        } else {
          log(`Row ${i + 1}: Success`);
        }
      } catch (err) {
        log(`Row ${i + 1}: Error - ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      // Delay between requests
      if (i < rows.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    setLoading(false);
    loadRecentPages();
    log('Bulk generation complete');
  };

  const handlePublish = async (id: string, force = false) => {
    if (!force) {
      const page = recentPages.find((p) => p.id === id);
      if (page && page.safetyFlags.length > 0) {
        const confirm = window.confirm(
          `This page has safety flags: ${page.safetyFlags.join(', ')}. Publish anyway?`,
        );
        if (!confirm) return;
        force = true;
      }
    }

    try {
      const res = await fetch('/api/local-pages/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, force }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to publish');
      }

      loadRecentPages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to publish');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const res = await fetch('/api/local-pages/unpublish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to unpublish');
      }

      loadRecentPages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unpublish');
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Delete this draft?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/local-pages/delete?id=${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      loadRecentPages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleBulkPublish = async () => {
    const drafts = recentPages.filter((p) => p.status === 'draft' && selectedIds.has(p.id));
    if (drafts.length === 0) return;

    const hasFlags = drafts.some((p) => p.safetyFlags.length > 0);
    if (hasFlags) {
      const confirm = window.confirm(
        'Some selected pages have safety flags. Publish all anyway?',
      );
      if (!confirm) return;
    }

    for (const draft of drafts) {
      await handlePublish(draft.id, true);
    }

    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === 'generate'
              ? 'border-b-2 border-sky-600 text-sky-800'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Generate Draft
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === 'bulk'
              ? 'border-b-2 border-sky-600 text-sky-800'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bulk CSV
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === 'recent'
              ? 'border-b-2 border-sky-600 text-sky-800'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recent Pages
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      {/* Generate Draft Tab */}
      {activeTab === 'generate' && (
        <div className="panel space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Primary Keyword *
              </label>
              <select
                value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Select keyword...</option>
                {PRIMARY_KEYWORDS.map((kw) => (
                  <option key={kw.slug} value={kw.slug}>
                    {kw.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Intent *</label>
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Select intent...</option>
                {INTENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Location Type *
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as 'city' | 'zip')}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="city">City</option>
                <option value="zip">ZIP Code</option>
              </select>
            </div>

            {locationType === 'city' ? (
              <div>
                <label className="block text-sm font-semibold text-slate-900">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Los Angeles"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-900">ZIP Code *</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="90001"
                  maxLength={5}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900">County</label>
              <input
                type="text"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Los Angeles"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="/hood-cleaning/los-angeles-ca"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={loading}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Draft'}
          </button>
        </div>
      )}

      {/* Bulk CSV Tab */}
      {activeTab === 'bulk' && (
        <div className="panel space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900">CSV Content</label>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              rows={10}
              placeholder={`primary_keyword_slug,city,zip,county,intent,slug\nhood-cleaning,Los Angeles,,Los Angeles,information,\nhood-cleaning,,90001,Los Angeles,information,/hood-cleaning-90001`}
            />
            <p className="mt-1 text-xs text-slate-600">
              CSV format: primary_keyword_slug,city,zip,county,intent,slug
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={skipExisting}
                onChange={(e) => setSkipExisting(e.target.checked)}
              />
              <span className="text-sm text-slate-700">Skip existing slugs</span>
            </label>
          </div>

          <button
            onClick={handleBulkGenerate}
            disabled={loading}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50"
          >
            {loading
              ? `Generating... (${bulkProgress.current}/${bulkProgress.total})`
              : 'Generate Drafts'}
          </button>

          {bulkLog.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 text-sm font-semibold text-slate-900">Generation Log</div>
              <div className="max-h-64 overflow-y-auto text-xs font-mono text-slate-700">
                {bulkLog.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Pages Tab */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-slate-600">
                {recentPages.filter((p) => p.status === 'draft').length} drafts,{' '}
                {recentPages.filter((p) => p.status === 'published').length} published
              </span>
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkPublish}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
              >
                Publish Selected ({selectedIds.size})
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        recentPages.filter((p) => p.status === 'draft').length > 0 &&
                        recentPages
                          .filter((p) => p.status === 'draft')
                          .every((p) => selectedIds.has(p.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const draftIds = new Set(
                            recentPages.filter((p) => p.status === 'draft').map((p) => p.id),
                          );
                          setSelectedIds(draftIds);
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Location</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Keyword</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Uniqueness</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Flags</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {page.status === 'draft' && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(page.id)}
                          onChange={(e) => {
                            const newSet = new Set(selectedIds);
                            if (e.target.checked) {
                              newSet.add(page.id);
                            } else {
                              newSet.delete(page.id);
                            }
                            setSelectedIds(newSet);
                          }}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {page.city || page.zip || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-600">{page.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{page.primaryKeywordSlug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          page.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {page.uniquenessScore !== null && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            page.uniquenessScore >= 0.9
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {Math.round(page.uniquenessScore * 100)}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {page.safetyFlags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {page.safetyFlags.slice(0, 3).map((flag) => (
                            <span
                              key={flag}
                              className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800"
                            >
                              {flag}
                            </span>
                          ))}
                          {page.safetyFlags.length > 3 && (
                            <span className="text-xs text-slate-600">
                              +{page.safetyFlags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {page.status === 'published' ? (
                          <>
                            <a
                              href={page.slug}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-sky-600 hover:underline"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleUnpublish(page.id)}
                              className="text-xs text-amber-600 hover:underline"
                            >
                              Unpublish
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handlePublish(page.id)}
                              className="text-xs text-green-600 hover:underline"
                            >
                              Publish
                            </button>
                            <button
                              onClick={() => handleDelete(page.id)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
