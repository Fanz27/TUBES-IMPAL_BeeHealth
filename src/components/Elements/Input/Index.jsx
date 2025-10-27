import Label from "./Labels.jsx";
import Input from "./input.jsx";

const InputForm = (props) => {
    const { label, nama, type, placeholder, value, onChange } = props;
    return (
        <div className="mb-6">
            <Label htmlFor={name}>{label}</Label>
            <Input 
            nama={nama} 
            type={type} 
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            />
        </div>
    )
}

export default InputForm