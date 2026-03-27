"use client";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiPhoneCall } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs"
import Link from "next/link";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setAnimate(true), 50);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setAnimate(false);
    setTimeout(() => setVisible(false), 200);
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity 
      ${animate ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-white rounded-xl shadow-xl p-8 w-95 relative transform transition-all duration-300 
        ${animate ? "scale-100 translate-y-0" : "scale-90 translate-y-4"}`} onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 bg-red-600 p-2 rounded-md text-white cursor-pointer" onClick={closePopup}>
          <IoMdClose />
        </button>
        <div className="welcome-content text-center">
          <h1 className="text-3xl font-bold text-red-700 underline">
            Swati<span className="text-red-500">Kaur</span>
          </h1>
          <h2 className="mt-3 text-xl font-semibold text-gray-800">
            Welcome — Your Premium Companion Experience
          </h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            We offer discreet, elegant and professional companion services.
            Relax, unwind, and enjoy a personalized experience tailored just for you.
          </p>
          <div className="mt-5">
            <Link href="tel:+923402690068" className="w-full inline-flex justify-center items-center bg-red-600 text-white font-semibold mb-3 py-2 rounded-md hover:bg-red-700 transition">
              <FiPhoneCall /> &nbsp; Call Now
            </Link>
            <Link href="https://wa.me/923402690068" target="_blank" className="w-full inline-flex justify-center items-center bg-green-600 text-white font-semibold py-2 rounded-md hover:text-white hover:bg-green-700 transition">
              <BsWhatsapp /> &nbsp; Chat on WhatsApp
            </Link>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}
