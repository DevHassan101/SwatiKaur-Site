import { FiPhoneCall } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs"
import Link from "next/link";

export default function ActionButtons() {
    return (
        <>
            <section className="action-buttons flex justify-between items-start fixed bottom-0 left-0 right-0 z-20 ">
                <Link href="tel:+923402690068" className="call-now basis-[50%] flex justify-center items-center
               bg-white py-3 text-xl text-blue-600 font-semibold cursor-pointer">
                    <span className="mr-2"><FiPhoneCall /></span>
                    Call Now
                </Link>
                <Link href="https://wa.me/923402690068" target="_blank" className="call-now basis-[50%] flex justify-center items-center
               bg-green-600 py-3 text-xl text-white font-semibold cursor-pointer">
                    <span className="mr-2"><BsWhatsapp /></span>
                    Whatsapp
                </Link>
            </section>
        </>
    );
}

