"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsHearts } from "react-icons/bs";

interface Model {
  model_image: string;
  model_name: string;
  model_location: string;
  model_age: number;
  slug: string;
  badge?: string;
}

export default function ModelCards() {

  const [models, setModels] = useState<Model[]>([]);
  const [openCard, setOpenCard] = useState<number | null>(null);


  async function fetchModels(){
    const response = await fetch('/api/website/models', {
      method: "GET"
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      return;
    }

    setModels(data.models);
  }

  useEffect(()=>{
    fetchModels();
  }, []);

  return (
    <section className="profile-section pt-12 pb-15 px-7 md:px-10 lg:px-15">
      <div className="flex flex-col justify-center items-center mb-8">
        <h1 className="text-xl md:text-2xl lg:text-4xl inline-flex items-center text-white font-semibold text-shadow-black mb-2">
          Our Models Profiles &nbsp; <span className="text-red-300"><BsHearts size={45} /></span>
        </h1>
        <p className="w-full lg:w-220 text-sm md:text-md lg:text-lg text-center text-white/90 text-shadow-black">
         In a city where luxury often comes with a hefty price tag, Lollipop Escorts stands as a beacon of affordability redefining
          what it means to enjoy premium companionship without the gatekeeping of exorbitant fees.
        </p>
      </div>
      <div className="grid gap-6 sm:gap-8 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {models.map((model, index) => (
          <div key={index} className="profile-card relative rounded-xl overflow-hidden border-2 border-white group cursor-pointer"
            onClick={() => setOpenCard(openCard === index ? null : index)}>
            {/* model-image-section */}
            <div className="relative w-full aspect-2/3">
              <Image src={model.model_image} alt={model.model_name} fill className="object-cover rounded-md" priority={false} />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            {/* model-content-section */}
            <div className={`model-content w-full absolute bottom-0 left-0 right-0 bg-linear-to-t from-red-700/70 via-transparent to-transparent transition-all duration-500 ease-in-out flex flex-col justify-end py-4
              /* Desktop hover (existing behaviour) */ group-hover:top-0 group-hover:bottom-0 group-hover:h-full group-hover:bg-red-800/90 group-hover:justify-center
              /* Mobile tap (new behaviour) */ ${openCard === index ? ` top-0 bottom-0 pb-12 h-full bg-red-800/90 justify-center` : ""}`}>
              <div className="transition-all duration-500">
                <h3 className="text-2xl font-semibold text-white bg-linear-to-l to-red-600 from-red-750 rounded-tr-xl rounded-br-xl px-5 mb-2 mr-10">
                  {model.model_name}
                </h3>
                <div className="flex gap-1 px-5 mb-1">
                    <span className="text-yellow-400 text-xl text-shadow-sm text-shadow-black/30">★★★★★</span>
                </div>
                <p className="text-sm text-white text-shadow-sm text-shadow-black/30 px-5 mb-3">
                  {model.model_location}
                </p>
              </div>
              <div className={`model-details px-5 opacity-0 transition-all duration-500 ease-in-out 
                max-h-0 group-hover:opacity-100 group-hover:max-h-52 ${openCard === index ? "opacity-100 max-h-52" : ""}`}>
                <div className="border-t border-white/40 pt-4 mt-2">
                  <h4 className="text-xl font-semibold text-white text-shadow-sm text-shadow-black/40 mb-1">About Me</h4>
                  <p className="text-md text-shadow-sm text-white text-shadow-black/30 mb-2">Age: {model.model_age}</p>
                  <p className="text-sm text-shadow-sm text-white text-shadow-black/30 leading-relaxed mb-4">
                    Professional and friendly service. Available for outcall appointments.
                    Providing premium companionship experience.
                  </p>
                  <div className="model-buttons flex flex-wrap justify-between items-center">
                    <Link href={`/models/${model.slug}`} className="basis-[53%] text-center bg-red-400 text-white border border-white rounded-full py-1 text-md font-medium hover:shadow-lg transition-all duration-300 hover:bg-red-600 cursor-pointer">
                      View Profile
                    </Link>
                    <Link href="tel:+923402690068" className="basis-[45%] text-center bg-red-500 text-white border border-white rounded-full py-1 text-md font-medium hover:shadow-lg transition-all duration-300 hover:bg-red-600 cursor-pointer">
                      Call Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {model.badge && (
              <div className="absolute top-3 right-3 bg-white text-pink-500 px-4 py-1 border border-pink-500 rounded-full text-sm font-bold z-10">
                {model.badge}
              </div>
            )}

          </div>
        ))}
      </div>
    </section>
  );
}
