import Poster from "../../assets/i/poster.png";
import {useSelector} from "react-redux";
import {Draggable} from "react-beautiful-dnd";
import {backgroundColorForMovie} from "../../js/info.js";
import {useEffect, useState} from "react";
import {getWidth} from "../../js/utils.js";


export default function Movie({movieId, index, itemOnDragX, isDragOverHall,isDragOverRemove, updateIsDropAnimating}) {

    const {films} = useSelector(state => state.films);
    const film = films[movieId];
    const [containerHeight, setContainerHeight] = useState(0);
    const [isDraggingElem, setIsDraggingElem] = useState(false);

    useEffect(() => {
        let rect = document.getElementById(`movie-in-list-${index}`).getBoundingClientRect();
        //console.log(index, rect);
        setContainerHeight(rect.height);
    }, []);

    const getItemStyle = (snapshot, draggableStyle, id, index) => {
        //console.log("Movie isDragOverHall", isDragOverHall);

        draggableStyle = {...draggableStyle};
        draggableStyle.background = backgroundColorForMovie[index];

        updateIsDropAnimating(snapshot.isDropAnimating);

        const isDragging = snapshot.isDragging;
        const elem = document.getElementById(id);

        if (isDragging) {
            setTimeout(() => setIsDraggingElem(true), 1);
        }
        else {
            setTimeout(() => setIsDraggingElem(false), 1);
        }

        if (snapshot.isDropAnimating) {
            draggableStyle.left = itemOnDragX;
            draggableStyle.transitionDuration = "0.00001s";
        }


        if (elem) {
            // elem.innerText = itemOnDragX;
        }

        if (isDragging && isDragOverHall) {
            draggableStyle.width = getWidth(film.time);
            draggableStyle.height = "40px";
            draggableStyle.padding = "10px 2px 10px 10px";
            draggableStyle.overflow = "hidden";
        }
        else if (isDragging && isDragOverRemove){
            draggableStyle.minHeight = "30px";
            draggableStyle.minWidth = "60px";
            draggableStyle.width = "200px";
            draggableStyle.height = "30px";
            draggableStyle.overflow = "hidden";
            draggableStyle.borderRadius = "5px";
        }

        else if (!isDragging) {
            draggableStyle.transform = null;
            draggableStyle.width = "100%";
        }
        return draggableStyle;
    };

//console.log("containerHeight",containerHeight)
//console.log("isDragOverHall && isDraggingElem",isDragOverHall, isDraggingElem)
    return (
        <div className="conf-step__movie-wrp" key={index}
             style={{width: "calc((100% - 30px) / 3)", height: containerHeight}}>
            <Draggable draggableId={`movie-in-list-${index}`}
                       index={index}>
                {(provided, snapshot) => (
                    <div className="conf-step__movie" id={`movie-in-list-${index}`}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                         style={getItemStyle(snapshot,
                             provided.draggableProps.style, `movie-in-list-${index}`, index)}
                         ref={provided.innerRef}>
                        {(isDragOverHall && isDraggingElem) ?
                            <p className="conf-step__seances-movie-title">${film.title}</p> :
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