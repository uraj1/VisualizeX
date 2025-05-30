import Providers from "@/app/Providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <section>{children}</section>
    </Providers>
  );
}
