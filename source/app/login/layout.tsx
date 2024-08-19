const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Login - Bull Family Real State",
//   description: "",
// };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground">
      <main className="min-h-screen ">{children}</main>
    </div>
  );
}
