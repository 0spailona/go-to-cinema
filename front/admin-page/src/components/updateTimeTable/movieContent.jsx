import DefaultPoster from "../../assets/i/poster.png";
import {backgroundColorForMovie} from "../../js/info.js";

export default function MovieContent({isDragOverHall, isDraggingElem, isRenderInHall, title, poster, duration, time,index}) {
    // console.log("Movie Content time", time);

    return (isDragOverHall && isDraggingElem) || isRenderInHall ?
            <div className="conf-step__seances-movie" style={{backgroundColor:backgroundColorForMovie[index]}}>
                <p className="conf-step__seances-movie-title">{title}</p>
                <p className="conf-step__seances-movie-start">{time}</p>
            </div>
            :
            <div className="conf-step__movie" style={{backgroundColor:backgroundColorForMovie[index]}}>
                <img className="conf-step__movie-poster" alt="poster"
                     src={poster ? poster : DefaultPoster}/>
                <h3 className="conf-step__movie-title">{title}</h3>
                <p className="conf-step__movie-duration">{duration} минут</p>
            </div>;
}