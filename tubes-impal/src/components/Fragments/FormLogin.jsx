import InputForm from "../Elements/Input/Index"
import Button from "../Elements/Button/Index.jsx"

const FormLogin = () => {
    return (
        <form action="">
            <InputForm label="Username" type="text" placeholder="BeeHealth" name="name"></InputForm>
            <InputForm label="Email" type="email" placeholder="example@gmail.com" name="email"></InputForm>
            <InputForm label="Password" type="password" placeholder="Harus 8 karakter" name="password"></InputForm>
            <Button classname ="w-full">Login</Button>
        </form>
    )
}

export default FormLogin