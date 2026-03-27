import Image from "next/image";
import { FiPhoneCall } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { GiBodyHeight } from "react-icons/gi";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoIosPin } from "react-icons/io";
import { notFound } from "next/navigation";
import prisma from "../../../lib/db";
import Link from 'next/link';


type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;

  // Fetch model by slug from database
  const model = await prisma.model.findUnique({
    where: { slug },
  });

  // If model not found, show 404
  if (!model) {
    notFound();
  }

  // Console logging for debugging
  console.log("Slug value:", slug);
  console.log("Model found:", model.model_name);

  return (
    <>
      <section className="main-model-section pt-12 pb-15 px-7 md:px-10 lg:px-20">
        {/* Flex ki jagah Grid use karein for better stability */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-20 items-start">

          {/* Model Profile Picture - Takes 4 columns on desktop */}
          <div className="lg:col-span-4 border-3 border-white rounded-xl shadow-xl overflow-hidden">
            <div className="relative w-full aspect-[3/4] md:h-160 lg:h-[600px]">
              <Image
                src={model.model_image || "/images/profile1.webp"}
                alt={model.model_name}
                fill
                className="object-cover"
                priority
              />
              <div className="image-overlay absolute bottom-0 left-0 right-0 w-full h-1/3 bg-gradient-to-t from-red-700/70 to-transparent"></div>
            </div>
          </div>

          {/* Model Profile Content - Takes 8 columns on desktop */}
          <div className="lg:col-span-8 min-w-0"> {/* min-w-0 is key for grid content overflow */}

            {/* Profile Head */}
            <div className="profile-head flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-white/50 gap-4">
              <div className="profile-left">
                <h1 className="text-2xl lg:text-4xl text-white font-bold">{model.model_name}</h1>
                <div className="flex gap-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-lg text-white/90">{model.model_location}</p>
              </div>
              <Link href={`tel:${'+923402690068'}`}
                className="bg-white py-2 px-8 border-2 border-red-500 rounded-full text-red-500 font-semibold flex items-center hover:bg-red-500 hover:text-white transition-all"
              >
                <FiPhoneCall className="mr-2" /> Call Now
              </Link>
            </div>

            {/* Profile Mid - Details */}
            <div className="pt-5">
              <h3 className="text-xl text-white font-semibold mb-3">About Me:</h3>
              <div className="flex flex-wrap gap-4 lg:gap-8 mb-6">
                <span className="flex items-center text-white/90 gap-2"><FaUser /> <b>Age:</b> {model.model_age}</span>
                {/* <span className="flex items-center text-white/90 gap-2"><GiBodyHeight /> <b>Height:</b> 5'6" (168 cm)</span>
                <span className="flex items-center text-white/90 gap-2"><IoLogoWhatsapp /> <b>Whatsapp:</b> 0335 5343882</span> */}
                <span className="flex items-center text-white/90 gap-2"><IoIosPin /> <b>Location:</b> {model.model_location}</span>
              </div>

              {/* Rich Text Description - Cleaned up classes */}
              <div
                className="prose prose-invert max-w-none 
            prose-p:text-white/90 prose-p:leading-relaxed
            prose-strong:text-white 
            prose-li:text-white/90
            break-words overflow-hidden"
                dangerouslySetInnerHTML={{ __html: model.model_desc }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}