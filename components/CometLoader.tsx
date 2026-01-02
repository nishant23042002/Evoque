"use client";

export default function CometLogoLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <img
                src="/images/logo.gif"
                className="w-[250px] h-[250px] object-contain"
            />
        </div>

    );
}
