const Button = (props) => {
  const { 
    children, 
    className = "", 
    onClick = () => {}, 
    type = "button",
    variant = "default" 
  } = props;
  
  
  const baseClasses = "font-bold py-2 px-4 rounded transition-colors duration-200";
  
  const variants = {
    default: "bg-[#CEE397] hover:bg-[#b8d182] text-white",
    dark: "bg-black hover:bg-gray-800 text-white",
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      type={type} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button