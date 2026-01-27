export interface Category {
    _id: string;
    name: string;
    slug: string;
}


export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch("/api/categories", {
        cache: "force-cache",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
}
