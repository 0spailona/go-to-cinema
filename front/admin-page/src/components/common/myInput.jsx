export default function MyInput({label, placeholder, value, onChange, onBlur}) {
    return (
        <label className="conf-step__label">{label}
            <input type="text" className="conf-step__input"
                   placeholder={placeholder} value={value ? value : ""}
                   onChange={onChange} onBlur={onBlur}/>
        </label>
    );
}