"use client";


export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">
            {children}
        </div>
    );
}
