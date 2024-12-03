export default function MyButton({text, onClick}) {
    return (
        <button className="acceptin-button" onClick={onClick}>{text}</button>
    )
}