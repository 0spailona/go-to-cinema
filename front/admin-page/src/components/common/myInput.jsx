export default function MyInput({label, placeholder, value, onChange, onBlur, size, name, isRequired, type, max, min}) {

    const sizeClassName = size ? `conf-step__label-${size}size` : "";

    return (
        <label className={`conf-step__label ${sizeClassName}`} htmlFor={name}>{label}
            <input type={`${type ? type : "text"}`} className="conf-step__input"
                   placeholder={placeholder} value={value ? value : ""}
                   name={name ? name : ""}
                   id={name}
                   onChange={onChange}
                   onBlur={onBlur}
                   required={isRequired}
                   maxLength={max ? max : ""}
                   minLength={min ? min : ""}
            />
        </label>
    );
}