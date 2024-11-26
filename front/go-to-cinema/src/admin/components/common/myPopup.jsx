import './popup.css'
import MyButton from "./myButton.jsx";

export default function MyPopup({isVisible, name,event}) {
    //console.log("MyPopup isVisible",isVisible);
    //console.log("MyPopup name",name);
    const classNamePopup = `popup ${name} ${!isVisible ? 'popup-invisible' : ''}`
    //console.log("MyPopup classNamePopup",classNamePopup)
    return (
        <div className={`${classNamePopup}`}>
            <div className="popup-header">
                save changes?
            </div>
            <div className="popup-buttons">
                <MyButton type="reset" text="Reset changes" onclick={()=>event("reset")}/>
                <MyButton type="submit" text="Submit" onclick={()=>event("submit")}/>
            </div>
        </div>
    )
}