import Image from "next/image";
import { CiLinkedin, CiFacebook, CiInstagram } from "react-icons/ci";
import { PiWhatsappLogoLight } from "react-icons/pi";


export default function Footer() {
    return (
        <footer className="ml-15 max-[768px]:ml-12 text-[#111] mt-30">
            <div className="bg-accent-sand md:max-w-[90%] mx-2 md:mx-auto px-8 py-14">

                {/* Title */}
                <h2 className="text-[18px] font-extrabold mb-8">
                    More about shopping At Snitch for men
                </h2>

                {/* TOP CATEGORIES */}
                <section>
                    <h3 className="text-[16px] font-extrabold mb-1.5 tracking-wide">
                        TOP CATEGORIES
                    </h3>

                    <div className="grid grid-cols-3 max-sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-14 gap-y-2 text-[13px] leading-5 tracking-normal">
                        <Column items={["T-shirts", "Bags", "Co-ords", "Shoes"]} />
                        <Column items={["Shirts", "Accessories", "Hoodies", "Sunglasses"]} />
                        <Column items={["Joggers", "Belts", "Jackets"]} />
                        <Column items={["Shorts", "Blazers", "Jeans"]} />
                        <Column items={["Trousers", "Boxers", "Night Suit & Pyjamas"]} />
                        <Column items={["Sweatshirts & Hoodies", "Cargo Pants", "Overshirt"]} />
                        <Column items={["Sweaters", "Chinos", "Perfumes"]} />
                    </div>
                </section>

                {/* POPULAR SEARCHES */}
                <section className="mt-14">
                    <h3 className="text-[16px] font-extrabold mb-1.5 tracking-wide">
                        POPULAR SEARCHES
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-x-14 gap-y-2 text-[13px] leading-5">
                        <Column items={[
                            "shirts for men", "hoodie", "polo t-shirts for men",
                            "trousers for men", "branded shirts for men", "mens tshirt"
                        ]} />

                        <Column items={[
                            "jackets for men", "joggers for men", "formal trousers for men",
                            "cargo jeans", "linen shirt"
                        ]} />

                        <Column items={[
                            "t-shirts for men", "baggy jeans mens", "sweatshirt",
                            "oversized shirt", "check shirt for men", "denim jeans"
                        ]} />

                        <Column items={[
                            "cargo", "straight fit jeans", "white shirt for men",
                            "denim", "casual shirts for men", "baggy pants men"
                        ]} />

                        <Column items={[
                            "baggy jeans", "printed shirts for men", "black shirt",
                            "linen pants", "chinos for men", "varsity jacket mens"
                        ]} />

                        <Column items={[
                            "mens jeans", "varsity jacket", "korean pants",
                            "crochet shirt", "formal shirts for men", "black t-shirt men"
                        ]} />

                        <Column items={[
                            "polo t-shirts", "formal pants for men", "baggy pants",
                            "old money outfits", "printed shirts", "club wear for men"
                        ]} />
                    </div>
                </section>

                {/* ACCESSORIES */}
                <section className="mt-14">
                    <h3 className="text-[16px] font-extrabold mb-1.5 tracking-wide">
                        MOST POPULAR ACCESSORIES
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-2 text-[13px] leading-5">
                        <Column items={[
                            "Ravenwood Braided Bracelet", "Divine Skull Cross Chain",
                            "Debonair Black Bracelet", "Abstract Trio Metal Bracelet",
                            "Rover Wrap Black Bracelet", "Bold Swirl Bracelet",
                            "Wavecrest Dollar Brown Bracelet"
                        ]} />

                        <Column items={[
                            "EternaWrap Black Bracelet", "Bar of Luxe Chain",
                            "Solid Block SS Chain", "Rattle Square Chain",
                            "Mafia SS Chain", "Grey Cuboid SS Chain"
                        ]} />

                        <Column items={[
                            "Obsidian Blue Braided Bracelet", "Rogue Bullet Pendant",
                            "Hyphenated Weave Braided Bracelet",
                            "Blacksmith Nail Braided Bracelet",
                            "Nob Nail Edge Braided Bracelet",
                            "Midnight Eclipse Braid Bracelet"
                        ]} />

                        <Column items={[
                            "Rustic Revolve Brown Braided Bracelet",
                            "Pirate's Anchor Steel Chain",
                            "Metal Black Trio Bracelet",
                            "Duo Gold & Silver SS Chain",
                            "Hexa Beads Bracelet",
                            "Black Cuboid SS Chain"
                        ]} />
                    </div>
                </section>

                {/* COMPANY */}
                <section className="mt-14">
                    <h3 className="text-[16px] font-extrabold mb-1.5 tracking-wide">
                        COMPANY
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-14 text-[13px] leading-5">
                        {[
                            "About Us", "Privacy Policy", "Terms & Conditions",
                            "Return/Exchange Policy", "Contact Us", "Sitemap", "Stakeholders"
                        ].map(item => (
                            <p key={item}>{item}</p>
                        ))}
                    </div>
                </section>

                {/* SOCIAL + APP */}
                <div className="mt-16 flex flex-col items-center gap-8">
                    <div className="flex gap-6 text-[20px]">
                        <span className="text-brand-red cursor-pointer"><CiFacebook /></span>
                        <span className="text-brand-red cursor-pointer"><CiInstagram /></span>
                        <span className="text-brand-red cursor-pointer"><CiLinkedin /></span>
                        <span className="text-brand-red cursor-pointer"><PiWhatsappLogoLight /></span>
                    </div>

                    <div className="text-center">
                        <p className="text-[13px] font-extrabold tracking-wide">
                            DOWNLOAD APP
                        </p>
                        <div className="flex justify-center items-center">
                            <img alt="appstore" className="h-15 sm:h-20" src="/images/appstore.png" />
                            <img alt="playstore" className="h-25 sm:h-30" src="/images/playstore.png" />
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}

/* Column helper */
function Column({ items }: { items: string[] }) {
    return (
        <div className="space-y-0.5">
            {items.map(item => (
                <p className="cursor-pointer hover:underline decoration-brand-red hover:text-brand-red" key={item}>{item}</p>
            ))}
        </div>
    );
}
