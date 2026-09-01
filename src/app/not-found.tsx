import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold tracking-[0.2em] text-sky-700">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Page not found.</h1>
        <Link className="text-sm font-medium text-sky-700 underline-offset-4 hover:underline" href="/">
          Return to home
        </Link>
      </div>
    </main>
  );
}
