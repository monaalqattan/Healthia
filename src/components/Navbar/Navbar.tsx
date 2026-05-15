import { Bell, UserCircle } from "lucide-react"
import SearchNavbar from "../SearchNavbar/SearchNavbar"

function Navbar() {
    return (
        <div className="w-full px-4 py-3 bg-white shadow-sm mb-4">
            <div className="grid grid-cols-12 gap-4 items-center">

               
                <div className="col-span-6 lg:col-span-3">
                    <h1 className="text-[#065F46] font-bold plus-jakarta text-xl md:text-2xl">
                        Healthia
                    </h1>
                </div>

              
                <div className="hidden lg:block lg:col-span-6">
                    <SearchNavbar />
                </div>

            
                <div className="col-span-6 lg:col-span-3 flex items-center justify-end">
                    <div className="notification relative">
                        <span className="bg-red-700 absolute top-0 right-0 rounded-full w-2 h-2 block"></span>
                        <Bell className="text-[#64748B]" />
                    </div>
                    <span className="bg-[#E2E8F0] w-0.5 h-7 block mx-4"></span>
                    <div className="flex items-center gap-1">
                        <UserCircle className="text-[#065F46]" />
                  
                        <a href="#" className="hidden sm:block text-[#065F46] text-sm">
                            My Account
                        </a>
                    </div>
                </div>

            </div>


            <div className="block lg:hidden mt-3">
                <SearchNavbar />
            </div>
        </div>
    )
}

export default Navbar