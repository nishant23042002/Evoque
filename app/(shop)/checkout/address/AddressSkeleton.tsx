export default function AddressSkeleton() {
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            {[1, 2].map(i => (
                <div
                    key={i}
                    className="h-24 bg-gray-100 animate-pulse rounded"
                />
            ))}
        </div>
    );
}
