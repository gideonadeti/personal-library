export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex-grow overflow-hidden">{children}</div>;
}
