import AuthGuard from "@/components/AuthGuard";
import LogoutButton from "@/components/LogoutButton";

// Wraps every /products page: header with logout + the auth guard.
export default function ProductsLayout({ children }) {
  return (
    <AuthGuard>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold text-slate-900">Product Admin</span>
          <LogoutButton />
        </div>
      </header>
      {/* w-full: the body is a flex column, where mx-auto would otherwise shrink this to its content */}
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </AuthGuard>
  );
}
