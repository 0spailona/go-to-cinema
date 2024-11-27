// eslint-disable-next-line react/prop-types
export default function MyButton({type,text,onclick}){
    //console.log("type", type);
    const style = type === "reset" ? "regular" : "accent";

    return (
        <button className={`conf-step__button conf-step__button-${style}`} onClick={onclick}>{text}</button>
    )
}