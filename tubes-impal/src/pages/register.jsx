import AuthLayout from "../components/Layouts/AuthLayout"
import FormRegister from '../components/Fragments/FormRegister'

const RegisterPage = () => {
    return (
        <AuthLayout title="Create Account" type="register">
            <FormRegister></FormRegister>
        </AuthLayout>
    )
}

export default RegisterPage