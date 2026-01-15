import { Suspense } from "react";
import AdminLoginClient from "./ui";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md panel">Loading…</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
