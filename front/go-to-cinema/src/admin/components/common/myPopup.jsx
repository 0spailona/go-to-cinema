import './popup.css'
import MyButton from "./myButton.jsx";

export default function MyPopup(props) {
    return (
        <div className="popup">
            <div className="popup-header">
                save changes?
            </div>
            <MyButton type="reset" text="Reset changes"/>
            <MyButton type="submit" text="Submit"/>
        </div>
    )
}