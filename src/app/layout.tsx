import type { Metadata } from "next";
import { DM_Sans, Hind_Siliguri } from "next/font/google";
import { MotionProvider } from "@/components/ui/motion";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "KPESH | Kashmiri Power Engineering Solution Hub",
    template: "%s | KPESH",
  },
  description: "Solar, IPS, inverter and battery solutions in Muksudpur, Gopalganj, Bangladesh.",
  applicationName: "KPESH",
  keywords: [
    "KPESH",
    "Kashmiri Power Engineering Solution Hub",
    "solar",
    "IPS",
    "inverter",
    "battery",
    "Muksudpur",
    "Gopalganj",
    "Bangladesh",
  ],
};

const themeBootstrap = `
  (() => {
    try {
      const saved = localStorage.getItem("kpesh-theme");
      const mode = saved === "light" || saved === "dark" ? saved : "system";
      const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.dataset.theme = mode;
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${dmSans.variable} ${hindSiliguri.variable} antialiased`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
