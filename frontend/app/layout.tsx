import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider"; // or wherever it's from

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
<body className="bg-[linear-gradient(135deg,#e6e6ee,#e8e8ff)] text-[#575C75] font-sans min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}