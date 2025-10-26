import InputForm from "../Elements/Input/Index"
import Button from "../Elements/Button/Index.jsx"

const FormRegister = () => {
    return (
        <form action="">
            <InputForm label="Name" type="text" placeholder="Masukkan nama anda" name="name"></InputForm>
            <InputForm label="Email" type="email" placeholder="beehealth001@gmail.com" name="email"></InputForm>
            <InputForm label="Username" type="text" placeholder="beehealth" name="username"></InputForm>
            <InputForm label="Password" type="password" placeholder="8+character"
             name="password"></InputForm>
            <Button classname ="w-full">Daftar</Button>
        </form>
    )
}

export default FormRegister