import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { SITE_NAME } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/products");
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground relative">
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      <div className="hidden lg:flex lg:w-1/2 p-8 lg:p-16 flex-col justify-between border-r border-border relative overflow-hidden bg-chrome text-chrome-foreground">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none z-0"
        >
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 bg-gradient-to-r from-chrome/60 via-chrome/25 to-transparent pointer-events-none z-1"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl uppercase tracking-widest text-accent">
              {SITE_NAME}
            </span>
            <span className="h-2 w-2 rounded-full bg-accent" />
          </div>
        </div>

        <div className="my-8 space-y-6 max-w-lg relative z-10">
          <div className="bg-accent h-1.5 w-12 rounded-sm shadow-xs" />
          <h1 className="font-heading font-bold text-4xl lg:text-5xl uppercase tracking-wider leading-tight text-chrome-foreground drop-shadow-sm">
            Akses Eksklusif Menuju Dunia Rasa Terbaik.
          </h1>
          <p className="text-sm lg:text-base opacity-90 font-sans leading-relaxed text-chrome-foreground drop-shadow-xs">
            Masuk untuk menjelajahi kurasi device, liquid premium, dan penawaran terbatas yang dirancang khusus untuk pencinta vape sejati.
          </p>
        </div>

        <div className="text-xs opacity-60 font-mono relative z-10">
          Khusus pengguna 21+
        </div>
      </div>

      <div className="flex-1 min-h-screen lg:min-h-0 lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <span className="font-heading font-bold text-2xl uppercase tracking-widest text-accent">
              {SITE_NAME}
            </span>
            <span className="h-2 w-2 rounded-full bg-accent" />
          </div>

          <div className="space-y-1">
            <h2 className="font-heading font-bold text-2xl uppercase tracking-wide">
              Selamat Datang
            </h2>
            <p className="text-sm text-muted-foreground">
              Masukkan akun Anda untuk masuk.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
