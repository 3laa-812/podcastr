export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        <p>LEFT SIDEBAR</p>
        {children}
        <p>RIGHT SIDEBAR</p>
      </main>
    </div>
  );
}
