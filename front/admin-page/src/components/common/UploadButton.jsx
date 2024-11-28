export default function UploadButton({onChange}) {
    return (
        <label htmlFor="upload" className="conf-step__button" style={{cursor:"pointer"}}>
            <button type="button" className="conf-step__button conf-step__button-accent" style={{pointerEvents:"none"}}>Загрузить постер</button>
            <input type="file" id="upload" style={{display: "none"}} onChange={onChange}/>
        </label>
    );
}