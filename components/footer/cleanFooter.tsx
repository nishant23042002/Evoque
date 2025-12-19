import { CiInstagram, CiLinkedin } from "react-icons/ci";
import { PiWhatsappLogoLight } from "react-icons/pi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";

export default function CleanFooter() {
    return (
        <footer className="ml-18 mt-30 max-[490px]:ml-15 bg-black text-white">
            <div className="max-w-[1400px] mx-auto px-8 py-16">

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-14">

                    {/* LEFT */}
                    <div className="space-y-6 text-sm">
                        <h3 className="font-semibold tracking-wide flex items-center gap-2">
                            <HiOutlineMail /> GET IN TOUCH
                        </h3>

                        <div className="space-y-2 text-white/80">
                            <p>
                                Whatsapp:{" "}
                                <span className="text-white">+91 9606081463</span>
                            </p>
                            <p>
                                Support:{" "}
                                <span className="underline">hello@wearcomet.com</span>
                            </p>
                            <p>
                                Corporate Orders:{" "}
                                <span className="underline">bulkorders@wearcomet.com</span>
                            </p>
                        </div>

                        <div className="pt-6 border-t border-white/20 space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <IoLocationOutline /> REACH US
                            </h4>
                            <p className="text-white/70 leading-relaxed">
                                57, 60 Feet Rd, KHB Colony,
                                <br />
                                6th Block, Koramangala,
                                <br />
                                Bengaluru, Karnataka 560095
                            </p>
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="font-semibold tracking-wide mb-4">SOCIAL</h3>
                            <div className="flex gap-6 text-2xl">
                                <CiInstagram className="cursor-pointer hover:text-brand-red transition" />
                                <CiLinkedin className="cursor-pointer hover:text-brand-red transition" />
                                <PiWhatsappLogoLight className="cursor-pointer hover:text-brand-red transition" />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold tracking-wide mb-4">ABOUT US</h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li className="hover:text-white cursor-pointer">About Us</li>
                                <li className="hover:text-white cursor-pointer">Craftsmanship</li>
                                <li className="hover:text-white cursor-pointer">The Vault</li>
                                <li className="hover:text-white cursor-pointer">The Garage</li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                        <h3 className="font-semibold tracking-wide mb-4">QUICK LINKS</h3>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li className="hover:text-white cursor-pointer">Home</li>
                            <li className="hover:text-white cursor-pointer">My Account</li>
                            <li className="hover:text-white cursor-pointer">Store Locator</li>
                            <li className="hover:text-white cursor-pointer">Return & Exchange</li>
                            <li className="hover:text-white cursor-pointer">FAQ</li>
                            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-white cursor-pointer">Refund Policy</li>
                        </ul>
                    </div>

                </div>

                {/* BOTTOM */}
                <div className="mt-16 border-t border-white/20 pt-6 text-center text-xs text-white/60">
                    © 2025 Grails Marketing Private Limited. All Rights Reserved.
                </div>

            </div>
        </footer>
    );
}
