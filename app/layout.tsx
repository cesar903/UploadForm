// app/layout.tsx
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { FileProvider } from "@/app/context/FileContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xl">
                <span>Layout Base</span>
              </div>

              <ModeToggle />
            </div>
          </header>

          <main className="max-w-7xl mx-auto p-6">
            <FileProvider>
              {children}
            </FileProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}