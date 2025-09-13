import "./globals.css";
import "leaflet/dist/leaflet.css";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "SurgeAid",
  description: "Rapid volunteer mobilization for disasters",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900 overflow-x-hidden">
        <NavBar />
        <main className="max-w-xl mx-auto px-4 py-4 relative">{children}</main>
      </body>
    </html>
  );
}
