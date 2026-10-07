import { SITE_NAME } from "@/lib/site";

export function AppFooter() {
  return (
    <footer className="bg-chrome text-chrome-foreground border-t border-border py-4 px-6 text-xs opacity-80 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div>
          © {SITE_NAME}. Hak cipta dilindungi undang-undang.
        </div>
        <div className="font-mono text-[11px] opacity-75">
          Khusus pengguna 21+
        </div>
      </div>
    </footer>
  );
}
