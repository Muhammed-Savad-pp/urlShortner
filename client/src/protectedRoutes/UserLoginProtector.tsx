import type React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const UserLoginProtector: React.FC = () => {

    const { isLoggedIn } = useSelector((state: any) => state.auth);

    if(isLoggedIn) {
        return <Navigate to={'/'} replace/>
    }

    return <Outlet/>
}

export default UserLoginProtector