export default function MyInput({label,placeholder,value}){
    return (<label className="conf-step__label">{label}<input
        type="text" className="conf-step__input" placeholder={placeholder} value={value?value:""}/></label>)
}