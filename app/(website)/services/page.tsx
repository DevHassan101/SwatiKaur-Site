import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";

export default function Services() {

  const services = [
    {
      name: "Blonde Escorts",
      desc: "Stunning companions featuring a variety of golden hues, from platinum to honey-toned, paired with vibrant personalities.",
      image: "/images/service1.webp",
    },
    {
      name: "Dinner Date Escorts",
      desc: "Sophisticated, eloquent companions perfect for high-end galas, business dinners, or intimate evenings at the city's finest restaurants.",
      image: "/images/service2.webp",
    },
    {
      name: "RolePlay Escorts",
      desc: "Creative and immersive companions who bring your favorite scenarios and fantasies to life through dedicated performance.",
      image: "/images/service1.webp",
    },
    {
      name: "Russian Escorts",
      desc: "Striking Eastern European beauty characterized by elegance, poise, and a captivating cultural charm.",
      image: "/images/service2.webp",
    },
    {
      name: "Milf Escorts",
      desc: "Experienced, mature, and confident companions who offer a refined level of conversation and worldly allure.",
      image: "/images/service1.webp",
    },
    {
      name: "Latina Escorts",
      desc: "High-energy socialites ready to light up any event, from VIP club nights to lively private celebrations.",
      image: "/images/service2.webp",
    },
    {
      name: "Asian Escorts",
      desc: "Charming and dainty companions known for their graceful stature and playful, captivating energy.",
      image: "/images/service1.webp",
    },
    {
      name: "Travel Escorts",
      desc: "Skilled practitioners focusing on the art of touch, providing a sensory journey designed for deep relaxation and connection.",
      image: "/images/service2.webp",
    },
  ]

  return (
    <section className="main-service-section pt-12 pb-15 px-7 md:px-10 lg:px-20">
      <div className="service-box mt-20">
        <div className="services-head text-center flex flex-col justify-center items-center">
          <h2 className="text-white text-shadow-black text-shadow-xs text-2xl lg:text-3xl font-medium pb-1 lg:pb-3">Explore Our Premium Services</h2>
          <p className="text-white/90 text-sm lg:text-md pb-2 w-auto lg:w-185">Welcome to our Services page, where each offering is a gateway to unparalleled relaxation and rejuvenation. From the transformative touch of Tantric Massage to the synchronised harmony of 4 Hands Massage, our curated selection promises a journey that caters to your deepest desires for connection, exploration, and tranquility.</p>
        </div>
        <div className="service-cards grid gap-5 md:gap-2 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-5">
            {services.map((service, index) => (
              <div key={index} className="cards bg-red-400 relative w-full h-50 border border-white rounded-lg">
                <Image src={service.image} alt={service.name} fill className="object-cover rounded-lg w-full" />
                <div className="service-overlay absolute top-0 left-0 right-0 w-full h-full 
                 bg-black/65 backdrop-blur-[1px] rounded-lg text-center px-5 flex flex-col justify-center items-center">
                  <h2 className="text-white text-shadow-black text-shadow-md text-xl font-medium pb-1">{service.name}</h2>
                  <p className="text-sm text-white/95 text-shadow-black text-shadow-2xs pb-2">{service.desc}</p>
                  <button className="flex justify-center items-center bg-red-600 
                  border border-white/70 rounded-full py-1 px-4 text-white text-sm">Explore Now <LuArrowUpRight size={16} /></button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
