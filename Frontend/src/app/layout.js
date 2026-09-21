import Providers from "./providers";
import Footer from "@/components/Footer";
export const metadata = {
  title: "Arena",
  description: "Gaming Community & Tournament Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
