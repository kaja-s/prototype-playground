import NavBar from "../components/NavBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <NavBar />
      <div className="mt-10 opacity-100 transition-opacity duration-300 ease-out starting:opacity-0 motion-reduce:transition-none">
        {children}
      </div>
    </div>
  );
}
