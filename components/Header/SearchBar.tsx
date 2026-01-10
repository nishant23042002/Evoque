import { Search } from "lucide-react";

const SearchBar = () => {
    return (
        <div className="relative w-full">
            <Search className="
                absolute left-2 top-1/2 -translate-y-1/2
                w-4 h-4 text-gray-500
            " />

            <input
                type="search"
                placeholder="Search shirts, jeans, jackets..."
                className="
                    w-full h-10 pl-8
                    rounded-sm
                    bg-accent-rose/20
                    text-sm text-gray-700
                    outline-none
                    focus:bg-accent-rose/50
                    transition
                "
            />
        </div>
    );
};

export default SearchBar;
