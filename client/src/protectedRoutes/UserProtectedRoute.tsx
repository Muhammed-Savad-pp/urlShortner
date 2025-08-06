import type React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const UserProtectedRoute: React.FC = () => {

    const { isLoggedIn } = useSelector((state: any) => state.auth);
    console.log(isLoggedIn, 'islOggedin');
    
    if(!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <Outlet/>
}

export default UserProtectedRoute;