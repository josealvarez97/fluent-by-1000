// import "@/styles/globals.css";
import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import { getBible } from "@/lib/getBible";

export const metadata = {
  title: "Bible Reader",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bible = getBible();

  //   return (
  //     <html lang="zh">
  //       <body className="flex h-screen bg-gray-50">
  //         <Sidebar books={bible.books} />
  //         <main className="flex-1 overflow-auto p-6">{children}</main>
  //       </body>
  //     </html>
  //   );
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar books={bible.books} />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
