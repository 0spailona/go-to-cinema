export default function UploadButton({onChange,name,text}) {


    return (
        <label htmlFor="upload" className="conf-step__button" style={{cursor:"pointer"}}>
            <button type="button" className="conf-step__button conf-step__button-accent"
                    name={name} style={{pointerEvents:"none"}}>{text}</button>
            <input type="file" id="upload" style={{display: "none"}} onChange={onChange} accept="image/png,image/jpeg,image/jpg"/>
        </label>
    );
}