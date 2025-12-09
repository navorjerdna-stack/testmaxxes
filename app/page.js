import Link from "next/link";
import Image from "next/image";

const companions = [
  { id: "lana", name: "Lana", desc: "Slovenka", img: "https://i.imgur.com/5t1jK8E.jpg" },
  { id: "lan", name: "Lan", desc: "Slovenec", img: "https://i.imgur.com/3d8kL2m.jpg" },
  { id: "sofia", name: "Sofia", desc: "Rusinja", img: "https://i.imgur.com/9kLmP2x.jpg" },
  { id: "sergei", name: "Sergei", desc: "Rus", img: "https://i.imgur.com/7aBcD4e.jpg" },
  { id: "mei", name: "Mei", desc: "Kitajka", img: "https://i.imgur.com/Qw3rT6y.jpg" },
  { id: "liwei", name: "Li Wei", desc: "Kitajec", img: "https://i.imgur.com/Zx9vB1n.jpg" },
  { id: "aiko", name: "Aiko", desc: "Anime Waifu", img: "https://i.imgur.com/8fGhJ2k.jpg" },
  { id: "haruto", name: "Haruto", desc: "Anime Husbando", img: "https://i.imgur.com/1pLmN5v.jpg" },
  { id: "emma", name: "Emma", desc: "Dominantna Angležinica", img: "https://i.imgur.com/Rt5yH9u.jpg" },
  { id: "james", name: "James", desc: "Dominantni Anglež", img: "https://i.imgur.com/Mk8pQ3w.jpg" },
  // Dodaj ostalih 10 po želji – isti format
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          AI Companion
        </h1>
        <p className="text-xl text-white/80 text-center mb-12">
          Izberi svojega AI prijatelja
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companions.map((c) => (
            <Link key={c.id} href={`/chat/${c.id}`}>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:border-white/40">
                <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={c.img}
                    alt={c.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{c.name}</h2>
                <p className="text-white/70">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
