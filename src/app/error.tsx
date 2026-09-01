"use client";

export default function GlobalError({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="id">
      <body>
        <main className="grid min-h-dvh place-items-center px-6 text-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-slate-950">Something went wrong.</h1>
            <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" onClick={reset} type="button">
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
