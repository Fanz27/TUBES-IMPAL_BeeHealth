import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import{ Link } from "react-router-dom"
import LoginPage from './pages/login.jsx'
import RegisterPage from './pages/register.jsx'
import NotFoundPage from './pages/404.jsx'
import DashboardPage from './pages/dashboard.jsx'
import CalculatePage from './pages/calculate.jsx'
import PageAddMakanan from './pages/addMakananPage.jsx'
import RekomendasiPage from './pages/RekomendasiPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProtectedRoute from './components/Fragments/ProtectedRoute.jsx'
import NotebookPage from './pages/notebookPage.jsx'
import TimelinePage from './pages/timelinePage.jsx'

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
    path: "/home",
    element: <DashboardPage/>
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
  },
  {
    path: "/calculate",
    element: <ProtectedRoute requiredRole="PENGGUNA_UMUM">
      <CalculatePage/>
    </ProtectedRoute>
  },
  {
    path: "/notebook",
    element: <ProtectedRoute requiredRole="PENGGUNA_UMUM">
      <NotebookPage/>
    </ProtectedRoute>
  },
  {
    path: "/addMakanan",
    element: <ProtectedRoute requiredRole="ADMIN">
      <PageAddMakanan/>
    </ProtectedRoute>
  },
  {
    path: "/Rekomendasi",
    element: <RekomendasiPage/>
  },
  {
    path: "/About",
    element: <AboutPage/>
  },
  {
    path: "/Timeline",
    element: <TimelinePage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
