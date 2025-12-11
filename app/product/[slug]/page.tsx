

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    return (
        <div className="border border-red-600 ml-20 gap-5 p-4">
            Showing product for: <span className="font-semibold">{slug}</span>
        </div>
    );
}
