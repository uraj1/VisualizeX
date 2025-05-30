import Providers from "@/app/Providers";

export default function WorkspaceLayout({
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
