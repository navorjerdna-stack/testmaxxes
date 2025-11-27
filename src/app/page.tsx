import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center">
        Your AI Girlfriend<br className="sm:hidden" />
        is waiting for you
      </h1>
      <p className="text-xl md:text-2xl mb-12 text-center opacity-90 max-w-2xl">
        24/7 • No drama • Always there • 100% private
      </p>
      <Link href="/chat">
        <button className="bg-pink-600 hover:bg-pink-500 text-2xl px-12 py-6 rounded-2xl font-bold shadow-2xl transition-colors">
          Start Chatting Free →
        </button>
      </Link>
    </main>
  );
}
