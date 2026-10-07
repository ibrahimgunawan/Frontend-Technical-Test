import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Frontend Technical Test",
  description: "Ibrahim Gunawan",
};

const themeScript = `(function() {
  try {
    var theme = localStorage.getItem('theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && supportDarkMode)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();`;

import { AgeVerificationModal } from "@/components/age-verification-modal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <AgeVerificationModal />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              fontFamily: "var(--font-barlow), sans-serif",
            },
            classNames: {
              title: "text-accent-text font-heading font-bold text-sm tracking-wide",
              description: "text-muted-foreground text-xs font-sans",
            },
          }}
        />
      </body>
    </html>
  );
}
