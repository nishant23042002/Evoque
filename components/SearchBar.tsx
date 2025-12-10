import { Search } from "lucide-react";

const SearchBar = () => {
    return(
        <div className="relative p-2 flex items-center justify-center w-full">
            <Search className="absolute left-4 w-5 h-5 text-slate-800 hover:text-brand-red hoverEffect" />
            <input type="search" className="px-8 p-1 border border-slate-500 w-full rounded-full" />
        </div>
    )
}

export default SearchBar;