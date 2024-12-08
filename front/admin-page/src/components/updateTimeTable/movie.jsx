import Poster from "../../assets/i/poster.png";
import {useSelector} from "react-redux";
import {Draggable} from "react-beautiful-dnd";
import {backgroundColorForMovie} from "../../js/info.js";
import {useEffect, useState} from "react";
import {getItemOnDragX, getViewTime, minutesToPx, pxToMinutes} from "../../js/utils.js";


export default function Movie({
                                  movieId,
                                  hallId,
                                  index,
                                  itemOnDragX,
                                  isDragOverHall,
                                  isRenderInHall,
                                  isDragOverRemove,
                                  updateIsDropAnimating
                              }) {

    const {films, seances} = useSelector(state => state.films);
    const film = films[movieId];
    const id = isRenderInHall ? `movie-in-seance-hall${index}-${hallId}-${movieId}` : `movie-in-list-${movieId}`;
    const backGroundColorIndex = Object.keys(films).indexOf(movieId);
    const width = minutesToPx(film.time);

    let filmStart = null;
    let timeStart = "";
    let offset = 0;

    if (isRenderInHall) {
        filmStart = seances[hallId].find(x => x.filmId === movieId).start;
        timeStart = getViewTime(filmStart);
        offset = minutesToPx(filmStart);
    }


    const [containerHeight, setContainerHeight] = useState(0);
    const [isDraggingElem, setIsDraggingElem] = useState(false);

    useEffect(() => {
        let rect = document.getElementById(id).getBoundingClientRect();
        //console.log(index, rect);
        setContainerHeight(rect.height);
    }, []);

    const getItemStyle = (snapshot, draggableStyle) => {
        //console.log("Movie isDragOverHall", isDragOverHall);
        // console.log("Movie getItemStyle isDropAnimating", snapshot.isDropAnimating);
        draggableStyle = {...draggableStyle};
        draggableStyle.background = backgroundColorForMovie[backGroundColorIndex];

        updateIsDropAnimating(snapshot.isDropAnimating);

        if (snapshot.isDropAnimating) {
            draggableStyle.left = itemOnDragX;
            draggableStyle.transitionDuration = "0.00001s";
        }

        const isDragging = snapshot.isDragging;


        if ((isRenderInHall && !isDragging) || (isRenderInHall && isDragging && isDragOverHall) || (!isRenderInHall && isDragging && isDragOverHall)) {
            draggableStyle.width = `${width}px`;
        }

        if (isDragging) {
            setTimeout(() => setIsDraggingElem(true), 1);
        }
        else {
            setTimeout(() => setIsDraggingElem(false), 1);
        }

        const timeElem = document.getElementById(id)?.getElementsByClassName("conf-step__seances-movie-start")[0];

        if (timeElem && snapshot.isDragging && !snapshot.isDropAnimating) {
            console.log("timeElem", timeElem);
            const newItemOnDragX = getItemOnDragX(id, `seances-hall-${hallId}`);
            console.log("newItemOnDragX", newItemOnDragX);
            timeElem.innerText = getViewTime(pxToMinutes(newItemOnDragX));
        }

        if (!snapshot.isDragging) {
            draggableStyle.transform = null;
            if (isRenderInHall) {
                draggableStyle.left = `${offset}px`;
            }
            else {
                draggableStyle.width = "100%";
            }

        }

        if (isDragging && isDragOverRemove) {
            draggableStyle.minHeight = "30px";
            draggableStyle.minWidth = "60px";
            draggableStyle.width = "200px";
            draggableStyle.height = "30px";
            draggableStyle.overflow = "hidden";
            draggableStyle.borderRadius = "5px";
        }

        /*else if (!isDragging) {
            draggableStyle.transform = null;
            draggableStyle.width = "100%";
        }*/
        return draggableStyle;
    };

    return (
        <div className="conf-step__movie-wrp" key={index}
             style={{width: "calc((100% - 30px) / 3)", height: containerHeight}}>
            <Draggable draggableId={id}
                       index={index}>
                {(provided, snapshot) => (
                    <div
                        className={`${(isDragOverHall && isDraggingElem) || isRenderInHall ? "conf-step__seances-movie" : "conf-step__movie"}`}
                        id={id}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot,
                            provided.draggableProps.style)}
                        ref={provided.innerRef}>
                        {((isDragOverHall && isDraggingElem) || isRenderInHall) ?
                            <>
                                <p className="conf-step__seances-movie-title">{film.title}</p>
                                <p className="conf-step__seances-movie-start">{timeStart}</p>
                            </>
                            :
                            <>
                                <img className="conf-step__movie-poster" alt="poster"
                                     src={film.poster ? film.poster : Poster}/>
                                <h3 className="conf-step__movie-title">{film.title}</h3>
                                <p className="conf-step__movie-duration">{film.time} минут</p></>
                        }
                    </div>
                )}
            </Draggable>
        </div>
    );
}


/*
*{isDragOverHall && isDraggingElem ?
                            <p className="conf-step__seances-movie-title">${film.title}</p> :
                            <>
                                <img className="conf-step__movie-poster" alt="poster"
                                   src={film.poster ? film.poster : Poster}/>
                                <h3 className="conf-step__movie-title">{film.title}</h3>
                                <p className="conf-step__movie-duration">{film.time} минут</p></>
                        } */
/*
* <Draggable draggableId={`movie-${movieId}`} index={index}>
        {(provided) => (
            <div className="conf-step__movie"
                 ref={provided.innerRef}
                 {...provided.draggableProps}
                 {...provided.dragHandleProps} >
                    <img className="conf-step__movie-poster" alt="poster"
                                                         src={film.poster ? film.poster : Poster}/>
                    <h3 className="conf-step__movie-title">{film.title}</h3>
                    <p className="conf-step__movie-duration">{film.time} минут</p>
                </div>)}
        </Draggable> */