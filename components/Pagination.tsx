"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: Props) {

    const generatePages = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2, 3, 4, 5, "...", totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col items-center gap-6 py-10">
            {/* LOAD NEXT PAGE BUTTON */}
            <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`
                            uppercase md:w-[25%] p-4 transition
                            ${currentPage >= totalPages
                        ? "bg-black/60 text-white cursor-not-allowed"
                        : "bg-black hover:bg-black/70 text-white cursor-pointer"}
                    `}
            >
                Load Next Page
            </button>


            {/* NUMBER PAGINATION */}
            <div className="flex items-center gap-6 text-sm font-light">

                {/* LEFT ARROW */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="disabled:opacity-30 cursor-pointer"
                >
                    <ChevronLeft size={18} />
                </button>

                {generatePages().map((p, i) =>
                    p === "..." ? (
                        <span key={i}>...</span>
                    ) : (
                        <button
                            key={i}
                            onClick={() => onPageChange(Number(p))}
                            className={`px-1 cursor-pointer ${currentPage === p ? "font-medium" : "text-gray-400"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* RIGHT ARROW */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="disabled:opacity-30"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
