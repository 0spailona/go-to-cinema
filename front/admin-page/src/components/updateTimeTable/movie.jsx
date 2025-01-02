import {useSelector} from "react-redux";
import {Draggable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {getItemOnDragX, getViewTime, minutesToPx, pxToMinutes} from "../../js/utils.js";
import MovieContent from "./movieContent.jsx";
import {draggableIdsBase, droppableIdsBase} from "./utilsFunctions.js";


export default function Movie({
                                  movieId,
                                  hallId,
                                  seanceId,
                                  index,
                                  itemOnDragX,
                                  updateIsDropAnimating
                              }) {

    //console.log("movie id", movieId)
//console.log("movie itemOnDragX", itemOnDragX);
    const {films, seances,chosenDate} = useSelector(state => state.films);
    const film = films[movieId];
    //console.log("movie film", film);
    const id = hallId ? `${draggableIdsBase.movieInSeance}${seanceId}-${hallId}-${movieId}` : `${draggableIdsBase.movieInList}${movieId}`;
    const backGroundColorIndex = Object.keys(films).indexOf(movieId);
    const width = minutesToPx(film.duration);
    //console.log("movie width", minutesToPx(12));
    const height = 40;

    let filmStart = null;
    let timeStart = "";
    let offset = 0;
    let isRenderInHall = false;

    if (hallId) {
        filmStart = seances[chosenDate][hallId].find(x => x.id === seanceId).start;
        timeStart = getViewTime(filmStart);
        offset = minutesToPx(filmStart);
        isRenderInHall = true;
    }

    const [time, setTime] = useState(timeStart);

    const [containerHeight, setContainerHeight] = useState(0);
    const [isDraggingElem, setIsDraggingElem] = useState(false);
    const [isDragOverHall, setIsDragOverHall] = useState(false);
    const [clickCoords, setClickCoords] = useState({});

    useEffect(() => {
        let rect = document.getElementById(id).getBoundingClientRect();
        setContainerHeight(rect.height);
    }, []);

    const getItemStyle = (snapshot, draggableStyle) => {
        draggableStyle = {...draggableStyle};

        updateIsDropAnimating(snapshot.isDropAnimating);

        if (snapshot.isDropAnimating) {
           // console.log("movie getItemStyle draggableStyle.left",draggableStyle.left)
            draggableStyle.left = itemOnDragX;
            draggableStyle.transitionDuration = "0.00001s";
        }


        const isDragging = snapshot.isDragging;
        const draggingOver = snapshot.draggingOver;

        draggableStyle.position = isDragging ? "fixed" : isRenderInHall ? "absolute" : "relative";
       // console.log("draggingOver",draggingOver)
        if (!draggingOver) {

            setTimeout(() => setIsDragOverHall(false), 1);
        }
        else if (draggingOver?.includes(droppableIdsBase.seanceHall)) {
            setTimeout(() => setIsDragOverHall(true), 1);
        }
        else if (draggingOver?.includes(droppableIdsBase.allMovies)) {

            setTimeout(() => setIsDragOverHall(false), 1);
        }
//console.log("IsDragOverHall",isDragOverHall)


        if ((isRenderInHall && !isDragging) || (isRenderInHall && isDragging && isDragOverHall) || (!isRenderInHall && isDragging && isDragOverHall)) {
            draggableStyle.width = `${width}px`;
            draggableStyle.height = `${height}px`;
        }

        if (isDragging) {
            setTimeout(() => setIsDraggingElem(true), 1);
            //console.log('clickCoords',clickCoords)
            //console.log('width',width)
            draggableStyle.left = clickCoords.x - (width / 2);
            draggableStyle.top = clickCoords.y - (height / 2);
        }
        else {
            setTimeout(() => setIsDraggingElem(false), 1);
        }

        if ((hallId || isDragOverHall) && snapshot.isDragging && !snapshot.isDropAnimating) {
            const newItemOnDragX = getItemOnDragX(id);
            setTimeout(() => setTime(getViewTime(pxToMinutes(newItemOnDragX))), 1);
        }

        if (!snapshot.isDragging) {
            draggableStyle.transform = null;
            if (hallId) {
                draggableStyle.left = `${offset}px`;
            }
            else {
                draggableStyle.width = "100%";
            }

        }

        if (isDragging && draggingOver?.includes(droppableIdsBase.removeFromAllMovies) && !isRenderInHall) {
            draggableStyle.minHeight = "30px";
            draggableStyle.minWidth = "60px";
            draggableStyle.width = "30px";
            draggableStyle.height = "30px";
            draggableStyle.overflow = "hidden";
            draggableStyle.borderRadius = "5px";
        }
        //console.log("movie getItemStyle draggableStyle",draggableStyle)

        return draggableStyle;
    };
    const onMouseDown = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        //console.log("x.y",x,y)
        setClickCoords({x, y});

    };

    return (
        <div className={`${isRenderInHall ? "conf-step__seances-movie-wrp" : "conf-step__movie-wrp"}`} key={index}
             style={{
                 height: containerHeight
             }}>
            <Draggable draggableId={id}
                       index={index}>
                {(provided, snapshot) => (
                    <div id={id}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                         style={getItemStyle(snapshot,
                             provided.draggableProps.style)}
                         ref={provided.innerRef}
                         onMouseDown={onMouseDown}>
                        <MovieContent isRenderInHall={isRenderInHall} isDragOverHall={isDragOverHall}
                                      isDraggingElem={isDraggingElem} title={film.title}
                                      poster={film.poster} duration={film.duration}
                                      startTime={time}
                                      index={backGroundColorIndex}/>
                    </div>
                )}
            </Draggable>
        </div>
    );
}
