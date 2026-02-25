// category/[category]/page.tsx

import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import CategoryPageClient from "./CategoryPageClient";

interface PageProps {
    params: Promise<{ category: string }>;
}

/* =========================
   ✅ Dynamic SEO Metadata
========================= */
export async function generateMetadata({ params }: PageProps) {
    const { category } = await params;

    await connectDB();

    const categoryData = await Category.findOne({
        slug: category,
        isActive: true,
    }).lean();

    if (!categoryData) {
        return {
            title: "Category Not Found",
            description: "This category does not exist.",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    return {
        title:
            categoryData.seo?.title ||
            `${categoryData.name} for Men | Your Brand Name`,

        description:
            categoryData.seo?.description ||
            categoryData.description ||
            `Shop premium ${categoryData.name} online.`,

        keywords: categoryData.seo?.keywords || [],

        openGraph: {
            title: categoryData.seo?.title || categoryData.name,
            description:
                categoryData.seo?.description ||
                categoryData.description,
            images: categoryData.categoryPageBanner
                ? [{ url: categoryData.categoryPageBanner }]
                : [],
        },

        alternates: {
            canonical: `${baseUrl}/categories/${category}`,
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}
/* =========================
   ✅ Category Page
========================= */
export default async function Page({ params }: PageProps) {
    const { category } = await params;

    await connectDB();

    const categoryData = await Category.findOne({
        slug: category,
        isActive: true,
    }).lean();

    if (!categoryData) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: process.env.NEXT_PUBLIC_SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: categoryData.name,
                item: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${category}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageClient category={category} />
        </>

    )
}