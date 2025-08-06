import { useDispatch } from "react-redux";
import { logoutUser } from "../services/user/userService"
import { logOut } from "../redux/authSlice";
import { Link } from "lucide-react";

function Navbar() {

    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {

            const response: any = await logoutUser();
            if (response.success) {
                dispatch(logOut());
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <nav className="bg-black border-b border-green-500/30 p-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link className="text-green-400" size={24} />
                        <span className="text-white font-bold text-xl">LinkShort</span>
                    </div>
                    <button onClick={handleLogout} className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition'>
                        Logout
                    </button>

                </div>
            </nav>
        </>
    )
}

export default Navbar