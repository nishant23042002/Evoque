import { Search } from "lucide-react";

const SearchBar = () => {
    return(
        <div className="relative p-2 mx-3 flex items-center justify-center w-full">
            <Search className="absolute left-4 w-5 h-5 text-gray-700 hover:text-brand-red hoverEffect" />
            <input placeholder="Search" type="search" className="px-8 p-2 focus:bg-gray-300/50 hover:bg-gray-300/50 outline-none text-gray-700 w-full rounded-md" />
        </div>
    )
}

export default SearchBar;