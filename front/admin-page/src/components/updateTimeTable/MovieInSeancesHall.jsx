import {useSelector} from "react-redux";
import {Draggable} from "react-beautiful-dnd";
import {getItemOnDragX, getViewTime, minutesToPx, pxToMinutes} from "../../js/utils.js";
import {backgroundColorForMovie} from "../../js/info.js";
import {useState} from "react";

/*export default function MovieInSeancesHall({movieId, hallId, index, itemOnDragX, updateIsDropAnimating}) {

    //const {films, seances} = useSelector(state => state.films);
    //const filmStart = seances[hallId].find(x => x.filmId === movieId).start;
    //const timeStart = getViewTime(filmStart);
   // const offset = minutesToPx(filmStart);

    //console.log(filmStart, offset);

    //const backGroundColorIndex = Object.keys(films).indexOf(movieId);
    //const film = films[movieId];
    //const id = `movie-in-seance-hall${index}-${hallId}-${movieId}`;
    //const width = minutesToPx(film.time);
    //console.log("width", width)

    const getItemInListStyle = (snapshot, draggableStyle) => {
        draggableStyle = {...draggableStyle};
        updateIsDropAnimating(snapshot.isDropAnimating);

        if (snapshot.isDropAnimating) {
            draggableStyle.left = itemOnDragX;
            draggableStyle.transitionDuration = "0.00001s";
        }

        draggableStyle.width = `${width}px`;
        //draggableStyle.background = backgroundColorForMovie[backGroundColorIndex];

        const timeElem = document.getElementById(id)?.getElementsByClassName("conf-step__seances-movie-start")[0];

        if (timeElem && snapshot.isDragging && !snapshot.isDropAnimating) {
            const newItemOnDragX = getItemOnDragX(id,`seances-hall-${hallId}`)
            timeElem.innerText = getViewTime(pxToMinutes(newItemOnDragX));
        }

        if (!snapshot.isDragging) {
            draggableStyle.transform = null;
            draggableStyle.left = `${offset}px`;
        }

        return draggableStyle;
    };


    return (
        <Draggable draggableId={id}
                   index={index}>
            {(provided, snapshot) => (
                <div className="conf-step__seances-movie" id={id}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     style={getItemInListStyle(snapshot,
                         provided.draggableProps.style)}
                     ref={provided.innerRef}>
                    <p className="conf-step__seances-movie-title">{film.title}</p>
                    <p className="conf-step__seances-movie-start">{timeStart}</p>
                </div>
            )}
        </Draggable>
    );
}*/
