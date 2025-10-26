const Button = (props) => {
  const { children, classname = "bg-black" } = props;
  return (
    <button className={`bg-[#CEE397] hover:bg-[#CEE397] text-white font-bold py-2 px-4 rounded ${classname}`} type="submit">
      {children}
    </button>
  )
}

export default Button