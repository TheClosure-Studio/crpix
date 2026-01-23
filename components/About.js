import Image from "next/image";

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Sophie Bennett",
    role: "Photographer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    stats: { shots: 312, rating: 4.8 },
  },
  {
    id: 2,
    name: "Ethan Walker",
    role: " Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    stats: { shots: 250, rating: 4.9 },
  },
  {
    id: 3,
    name: "Olivia Rose",
    role: " Editor & Stylist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
    stats: { shots: 400, rating: 4.7 },
  },
];

export default function About() {
  return (
    <section id="about" className="text-black py-24 w-full flex items-center justify-center">
      <div className="max-w-7xl px-6">
        <h2 className="text-4xl md:text-7xl font-extrabold text-center mb-16 font-space-grotesk">
          About Us.
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-7 md:gap-30 mb-20">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl md:text-4xl font-extrabold leading-snug font-space-grotesk">
              Capture moments that carve a forever space in your heart.
            </h3>
            <p className="text-neutral-500 text-sm md:text-md tracking-tight ">
              Welcome to CR Pix Photography, a premier photography studio based in Tirupati,
              Andhra Pradesh, dedicated to transforming everyday moments into timeless
              masterpieces. Our team of skilled photographers blends creativity with technical
              expertise to deliver stunning visuals for weddings, portraits, events, and more. We
              prioritize client stories, ensuring every image resonates with emotion and
              authenticity.
            </p>
          </div>

          <div className=" lg:flex justify-center md:justify-end hidden  ">
            <div className="relative w-50 h-50 md:w-60 md:h-60 px-20">
              <Image
                src="/logo.svg"
                alt="CR Pix Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-3 md:gap-2 gap-1   justify-items-center">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="relative w-full max-w-sm aspect-[3/5] lg:aspect-[3/3] rounded-sm overflow-hidden "
            >
              {/* Profile Image */}
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />

              {/* Glassmorphism Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-1 text-white rounded-b-lg shadow-sm text-center bg-gradient-to-t from-black/60 via-black/30 to-transparent ">
                <div className="flex items-center justify-center md:gap-2 ">
                   <h3 className="text-white font-bold text-xs md:text-sm lg:text-lg font-space-grotesk">{member.name}</h3>
                </div>
                
                <p className="text-white text-xs md:text-sm lg:text-base font-medium mb-2 font-space-grotesk">{member.role}</p>

                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
