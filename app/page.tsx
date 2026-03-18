import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.10),transparent_25%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="text-xl font-bold tracking-tight">Fiadaputins</div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-6 py-20">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm text-cyan-300">
              Comunidades em tempo real
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Conecte pessoas,
              <span className="block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                ideias e conversas
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Crie servidores, organize canais, compartilhe projetos, música e experiências
              em um ambiente moderno, rápido e cheio de personalidade.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:scale-[1.02]"
              >
                Começar agora
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-xl">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-zinc-900/70">
              <div className="border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
              </div>

              <div className="grid min-h-[420px] grid-cols-[84px_220px_1fr]">
                <div className="border-r border-white/10 bg-zinc-950/80 p-4">
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-12 w-12 rounded-2xl bg-white/8 ring-1 ring-white/10"
                      />
                    ))}
                  </div>
                </div>

                <div className="border-r border-white/10 bg-zinc-900/60 p-4">
                  <div className="mb-4 h-5 w-28 rounded bg-white/10" />
                  <div className="space-y-3">
                    {["geral", "networking", "música", "projetos"].map((channel) => (
                      <div
                        key={channel}
                        className={`rounded-xl px-3 py-2 text-sm ${
                          channel === "networking"
                            ? "bg-white/10 text-white"
                            : "text-zinc-400"
                        }`}
                      >
                        # {channel}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col bg-zinc-950/40 p-5">
                  <div className="mb-6">
                    <div className="text-sm text-zinc-500">Canal ativo</div>
                    <div className="text-xl font-semibold text-white"># networking</div>
                  </div>

                  <div className="space-y-4">
                    <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="mb-1 text-xs font-medium text-zinc-500">Ana</div>
                      <div className="text-sm text-zinc-200">
                        Alguém topa abrir uma sala focada em projetos?
                      </div>
                    </div>

                    <div className="ml-auto max-w-[85%] rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
                      <div className="mb-1 text-xs font-medium text-zinc-500">Lucas</div>
                      <div className="text-sm text-zinc-100">
                        Bora. Também queria separar um canal só pra música.
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-500">
                      Envie uma mensagem...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}