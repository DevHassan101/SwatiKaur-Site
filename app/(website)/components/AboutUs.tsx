import Image from "next/image"
import { FaHandHoldingHeart } from "react-icons/fa6";
import { GrUserFemale } from "react-icons/gr";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdOutlinePrivacyTip } from "react-icons/md";

export default function AboutUs() {
    return (
        <>
            <section className="about-section flex flex-col lg:flex-row flex-wrap justify-between items-start h-full pt-12 pb-15 px-7 md:px-10 lg:px-15">
                <div className="mainabout-content w-full lg:w-auto basis-[64%]">
                    <div className="about-head pl-0 lg:pl-5">
                        <h5 className="text-xl lg:text-3xl font-bold text-purple-200 mb-1 lg:mb-2 
                        inline-flex justify-start items-center">
                            About Us
                        </h5>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-2 w-fullmd:max-w-160 lg:max-w-155">
                            A Geniune Spot Of Call Girl Services Noida & Ghaziabad
                            <span className="text-purple-200 inline-flex ml-0 lg:ml-2 mr-1">SwatiKaur <FaHandHoldingHeart /></span>
                        </h1>
                        <p className="text-sm md:text-md mb-2 max-w-xl text-white">
                            Looking for a smooth, private way to meet a trusted companion in a busy aity? connects you with verified profiles across Noida and Ghaziabad, so you can relax, feel safe, and enjoy quality time that fits your schedule and mood. From quick meetups to longer bookings, you get prompt replies, clear options, and zero drama.
                        </p>
                        <p className="text-sm md:text-md mb-3 max-w-xl text-white">
                            We focus on adults only, with consent, privacy, and comfort at the center. In India, companionship is allowed when it is private and consensual, but any public solicitation or legal activity is not. Our platform is built for discretion, simple booking, and respectful meetings that stay within legal limits. You choose how to spend your time, and we keep it confidential.
                        </p>
                        <div className="about-icon flex flex-col justify-start items-start">
                            <div className="icon-box flex flex-col justify-start items-start lg:flex-row lg:justify-center lg:items-center py-2 rounded-md">
                                <span className="icon bg-white text-purple-500 w-12 h-12 border-3 border-purple-300 flex justify-center items-center rounded-full mr-3 text-xs">
                                    <GrUserFemale size={18} />
                                </span>
                                <span className="text mt-2 md:mt-0 lg:mt-0">
                                    <h5 className="text-purple-200 font-semibold text-sm md:text-md">
                                        Verified Profiles
                                    </h5>
                                    <p className="text-xs md:text-sm text-white">
                                        We craft smart, scalable solutions that address real business challenges.
                                    </p>
                                </span>
                            </div>
                            <div className="icon-box flex flex-col justify-start items-start lg:flex-row lg:justify-center lg:items-center py-2 rounded-md">
                                <span className="icon bg-white text-purple-500 w-12 h-12 border-3 border-purple-300 flex justify-center items-center rounded-full mr-3 text-xs">
                                    <RiCustomerService2Line size={18} />
                                </span>
                                <span className="text mt-2 md:mt-0 lg:mt-0">
                                    <h5 className="text-purple-200 font-semibold text-sm md:text-md">
                                        Quick Replies 24/7
                                    </h5>
                                    <p className="text-xs md:text-sm text-white">
                                        Our mission is to drive growth with innovation, and our vision is to be a trusted global digital partner.
                                    </p>
                                </span>
                            </div>
                            <div className="icon-box flex flex-col justify-start items-start lg:flex-row lg:justify-center lg:items-center py-2 rounded-md">
                                <span className="icon bg-white text-purple-500 w-12 h-12 border-3 border-purple-300 flex justify-center items-center rounded-full mr-3 text-xs">
                                    <MdOutlinePrivacyTip size={18} />
                                </span>
                                <span className="text mt-2 md:mt-0 lg:mt-0">
                                    <h5 className="text-purple-200 font-semibold text-sm md:text-md">
                                        Your Privacy Our Priority
                                    </h5>
                                    <p className="text-xs md:text-sm text-white">
                                        Our mission is to drive growth with innovation, and our vision is to be a trusted global digital partner.
                                    </p>
                                </span>
                            </div>
                        </div>
                        <div className="about-foot flex flex-col md:flex-row justify-start items-start md:items-center mt-3">
                            <button className="bg-purple-500 transition-all duration-0.5 hover:bg-purple-600 cursor-pointer border border-white py-2 px-6 md:py-3 md:px-7 rounded-full flex text-white text-sm md:text-md font-medium mb-4 lg:mb-0 mr-10">
                                Explore More
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mainabout-image bg-white border-6 border-purple-200 shadow-xl mt-5 md:mt-0 lg:mt-0 mx-auto lg:mx-0 w-full lg:w-auto basis-[35%]">
                    <div className="img1 relative w-full h-150">
                        <Image src="/images/about1.jpg" alt="" className="w-full h-auto lg:h-full" fill priority={false} />
                        <div className="img2 absolute w-full md:w-85 lg:w-90 h-65 lg:h-60 -bottom-3 lg:-bottom-7 right-0 -rotate-10 border-5 border-purple-200 shadow-xl">
                            <Image src="/images/about2.png" alt="" className="h-full" fill priority={false} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
