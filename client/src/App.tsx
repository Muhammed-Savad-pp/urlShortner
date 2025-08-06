import { Route, Routes } from "react-router-dom"
import SignUpPage from "./pages/signUp";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ErrorPage from './pages/404page';
import UserLoginProtector from "./protectedRoutes/UserLoginProtector";
import UserProtectedRoute from "./protectedRoutes/UserProtectedRoute";

function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route element={<UserLoginProtector/>}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login/>}/>
        </Route>
        <Route element={<UserProtectedRoute/>}>
          <Route path="/" element={<Home/>}/>
        </Route>
        <Route path="/*" element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default App
