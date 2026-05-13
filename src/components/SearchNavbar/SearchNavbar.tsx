import { Search } from "lucide-react"


function SearchNavbar() {
  return (
 <div className="search relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
  <input
    type="search"
    name="search"
    id="search"
    className="bg-[#F4F3F3] rounded-2xl py-2 pr-4 pl-10 h-10 w-full md:w-80 lg:w-96 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30"
    placeholder="Search patients, records, or labs..."
  />
</div>
  )
}

export default SearchNavbar
