import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "אמא אוכלת - מדריך תזונה להריון",
  description: "מדריך תזונה חכם לאמהות בהריון - מה מותר ומה אסור לאכול",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ fontFamily: "'Heebo', sans-serif", margin: 0 }} className="min-h-full antialiased">
        {children}
      </body>
    </html>
  );
}
