import Image from "next/image";
import { FaPlay } from "react-icons/fa6";

export default function HeroSection() {
  return (
    <section className="hero-section relative w-full h-180 lg:h-screen pt-30">
      <div className="model-section flex flex-col md:flex-row lg:flex-row xl:flex-row justify-center items-center w-full h-full">
        {/* Left Image */}
        <div className="img-box static lg:relative basis-[30%] shrink-0 h-auto lg:h-full">
          <Image src="/images/model1.png" alt="model" fill className="object-contain" priority />
        </div>
        {/* Text Section */}
        <div className="text-box basis-[38%] bg-red-600/30 py-5 lg:bg-transparent absolute z-10 bottom-0 lg:relative px-6 text-center">
          <div className="text-head -rotate-1">
            <h1 className="text-5xl lg:text-7xl font-extrabold m-0 p-0 text-white">LET&apos;S</h1>
            <h1 className="text-5xl lg:text-7xl font-extrabold m-0 p-0 text-black opacity-80 relative">PARTY</h1>
            <h1 className="text-5xl lg:text-7xl font-extrabold m-0 p-0 text-red-500 absolute bottom-8 lg:absolute lg:bottom-10 left-0 right-0">PARTY</h1>
            <h5 className="text-xl lg:text-3xl font-bold m-0 p-0 text-white">Tonight</h5>
          </div>
          <div className="text-para text-sm w-full flex flex-wrap justify-center items-center mt-5">
            <p className="mb-5 text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
              ducimus facilis voluptatem, itaque porro quibusdam accusamus
              tempore magni deserunt temporibus fuga.
            </p>
            <button
              className="flex items-center bg-white text-md text-red-600 font-bold px-5 py-2 lg:px-8 lg:py-3 rounded-full">
              DISCOVER NOW
              <span className="ml-2 lg:ml-5 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-white">
                <FaPlay />
              </span>
            </button>
          </div>
        </div>
        {/* Right Image */}
        <div className="img-box static hidden lg:relative lg:block basis-[30%] shrink-0 h-auto lg:h-full">
          <Image
            src="/images/model2.png"
            alt="model"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
