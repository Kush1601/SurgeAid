import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "SurgeAid",
  description: "Rapid volunteer mobilization for disasters",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen text-gray-900 overflow-x-hidden" style={{ backgroundColor: '#fefbf3' }}>
          <NavBar />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
