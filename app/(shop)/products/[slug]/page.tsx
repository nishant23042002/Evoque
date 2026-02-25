import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ✅ SEO + dynamic metadata
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;

    await connectDB();
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: product.seo?.title || product.name,
        description: product.seo?.description || product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images?.[0]?.url
                ? [{ url: product.images[0].url }]
                : [],
        },
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;

    await connectDB();
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
        notFound(); // ✅ proper 404 page
    }

    return <ProductPageClient slug={slug} />;
}