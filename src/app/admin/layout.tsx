import { AdminNav } from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Local SEO Admin</div>
            <p className="text-xs text-slate-600">
              Protected by ADMIN_PASSWORD. Publish or edit locations and global settings.
            </p>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            Secure
          </span>
        </div>
        <div className="mt-4">
          <AdminNav />
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
