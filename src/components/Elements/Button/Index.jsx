const Button = (props) => {
  const { children, classname = "bg-black", 
    onClick = () => {}, 
    type = "button" } = props;
  return (
    <button className={`bg-[#CEE397] hover:bg-[#CEE397] text-white font-bold py-2 px-4 rounded ${classname}`} 
      type={type} onClick={() => {onClick()}}>
      {children}
    </button>
  )
}

export default Button