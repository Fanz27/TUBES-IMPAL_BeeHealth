import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import{ Link } from "react-router-dom"
import LoginPage from './pages/login.jsx'
import RegisterPage from './pages/register.jsx'
import NotFoundPage from './pages/404.jsx'
import DashboardPage from './pages/dashboard.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="flex justify-center min-h-screen items-center bg-white">
      <Link to="/register" className="text-5xl font-bold text-slate-700 hover:text-[#CEE397]">
        Welcome To BeeHealth
      </Link>
    </div>,
    
    errorElement: <NotFoundPage/>,
  },
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/register",
    element: <div><RegisterPage/></div>
  },
  {
    path: "/dashboard",
    element: <DashboardPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
