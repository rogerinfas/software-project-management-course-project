import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Frontend (placeholder)
          </h1>
          <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Proyecto Next.js + React + Tailwind listo para empezar. Cambia este
            contenido cuando definas el alcance.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <Card
            title="Docs de Next.js"
            description="Guía oficial para rutas, data fetching y despliegue."
            href="https://nextjs.org/docs"
          />
          <Card
            title="Tailwind CSS"
            description="Utilidades para construir UI rápidamente."
            href="https://tailwindcss.com/docs"
          />
        </section>

        <footer className="pt-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="#" className="underline decoration-zinc-300 underline-offset-4">
            Actualiza esta página cuando tengas el tema del proyecto
          </Link>
        </footer>
      </main>
    </div>
  );
}

function Card(props: { title: string; description: string; href: string }) {
  return (
    <a
      className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900/60"
      href={props.href}
      target="_blank"
      rel="noreferrer"
    >
      <div className="text-base font-medium">{props.title}</div>
      <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {props.description}
      </div>
    </a>
  );
}
