import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  onBack?: () => void;
}

export default function Layout({ children, title, onBack }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-wide">
          {title ?? "משחקי חשבון 🎮"}
        </h1>
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-xl bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/20"
          >
            → חזרה לתפריט
          </button>
        )}
      </header>
      <main className="px-4 pb-12">{children}</main>
    </div>
  );
}
