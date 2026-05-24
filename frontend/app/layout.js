import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Recipe AI",
  description: "A recipe finder app built with Next.js, Tailwind CSS, and OpenAI's API. Find recipes based on ingredients you have at home and get step-by-step cooking instructions. ",
};

export default function RootLayout({ children }) {
  return ( 
  <ClerkProvider  appearance={{
    theme: dark,
    signIn: { theme: neobrutalism },
  }}>
    <html
      lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Header />
      <main className="min-h-screen">  {children} </main> 
      <Toaster richColors />
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <p className="text-stone-500 text-sm">
            &copy; 2026 Recipe AI. All rights reserved.
            Made with ❤️ by Tudip.
          </p>
        </div>
      </footer>
      </body>
    </html>
  </ClerkProvider>
  );
}