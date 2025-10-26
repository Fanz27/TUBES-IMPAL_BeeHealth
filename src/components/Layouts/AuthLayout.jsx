import {Link} from "react-router-dom"

const AuthLayout = (props) => {
    const { children, title, type } = props;
    return (
      <div className="flex justify-center min-h-screen items-center bg-white">
        <div className="w-full max-w-xs">
          <h1 className="text-4xl font-semibold mb-7 text-[#CEE397] text-center">{title}</h1>
          {children}
          <p className="text-sm mt-5 text-center flex justify-center items-center gap-x-1">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"} 

          {type === 'login' && ( <Link to="/register" className="font-bold text-[#9BAA71]">Sign Up</Link>) }
          {type === 'register' && ( <Link to="/login" className="font-bold text-[#9BAA71]">Sign In</Link>) }
          </p>
        </div> 
      </div>
    )
}

export default AuthLayout