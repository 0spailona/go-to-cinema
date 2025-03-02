import {backgroundColorForMovie} from "../../js/info.js";

export default function MovieContent({
                                         isDragOverHall,
                                         isDraggingElem,
                                         isRenderInHall,
                                         title,
                                         movieId,
                                         duration,
                                         startTime,
                                         index
                                     }) {
    if (isDragOverHall || isRenderInHall){
        //console.log("MovieContent title",title,"startTime",startTime)
    }


    if (isRenderInHall && !isDragOverHall && isDraggingElem) {
        return <div className="conf-step__seances-movie small-movie"
                    style={{backgroundColor: backgroundColorForMovie[index]}}>
            <p className="conf-step__seances-movie-title">{title}</p>
        </div>;
    }
    else if (isDragOverHall || isRenderInHall) {
        return <div className="conf-step__seances-movie" style={{backgroundColor: backgroundColorForMovie[index]}}>
            <p className="conf-step__seances-movie-title">{title}</p>
            <p className="conf-step__seances-movie-start">{startTime}</p>
        </div>;
    }
    else {
        return <div className="conf-step__movie" style={{backgroundColor: backgroundColorForMovie[index]}}>
            <img className="conf-step__movie-poster" alt="poster"
                 src={`api/posterByMovieId/${movieId}`}/>
            <h3 className="conf-step__movie-title">{title}</h3>
            <p className="conf-step__movie-duration">{duration} минут</p>
        </div>;
    }

}
