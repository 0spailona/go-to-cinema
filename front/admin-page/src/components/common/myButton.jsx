export default function MyButton({type, text, onclick}) {

    const style = type === "reset" ? "regular" : type === "trash" ? "trash" : "accent";
    const btnType = type === "trash" ? "button" : type;

    return (
        <button type={btnType} className={`conf-step__button conf-step__button-${style}`}
                onClick={onclick}>{text ? text : ""}</button>
    );
}