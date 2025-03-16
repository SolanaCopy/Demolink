// app/layout.tsx
import React from "react";
import { TraderProvider } from "../context/TraderContext"; // Pas de pad aan indien nodig

export const metadata = {
  title: "TradingVault",
  description: "Overview of trading strategies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body>
        <TraderProvider>{children}</TraderProvider>
      </body>
    </html>
  );
}
