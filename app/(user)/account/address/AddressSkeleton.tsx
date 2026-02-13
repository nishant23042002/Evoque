export default function AddressSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
            {[1, 2].map(i => (
                <div key={i} className="h-28 border animate-pulse" />
            ))}
        </div>

    );
}
