import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import Movie from "./movie.jsx";
import {toISOStringNoMs} from "../../js/utils.js";


export default function SeancesHall({hallName,hallId,filmsInHall,dropId, updateIsDropAnimating, itemOnDragX, showRemoveBtn}) {
    const removeId = `remove-movie-from-hall-${hallId}`
    //console.log("seancesHall removeId", removeId);
    const getListStyle = (isDraggingOver) => {
        return {
            background: isDraggingOver ? "lightblue" : "lightgrey",
            display: "flex",
        };
    };

    return (
        <div className="conf-step__seances-hall-wrp">
            <div className="conf-step__seances-hall">
                <h3 className="conf-step__seances-title">{hallName}</h3>
                <Droppable droppableId={dropId}>
                    {(provided, snapshot) => (
                        <div className="conf-step__seances-timeline"
                             id={dropId}
                             ref={provided.innerRef}
                             style={getListStyle(snapshot.isDraggingOver)}
                             {...provided.droppableProps}>

                            {filmsInHall ? filmsInHall.map((seance, index) => (
                                <Movie index={index} key={index} hallId={hallId}
                                       movieId={seance.filmId} itemOnDragX={itemOnDragX}
                                       updateIsDropAnimating={updateIsDropAnimating}
                                       seanceId={seance.id}/>)) : null}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
            <div className={`drop-for-remove-wrp d-block ${showRemoveBtn ? '' : 'invisible'}`}>
                <Droppable droppableId={removeId}>
                    {(provided) => (
                        <div className="drop-for-remove border"
                             id={removeId}
                             ref={provided.innerRef}
                             style={{
                                 top: 0,
                                 right: 0,
                                 width: 65,
                                 height: 65
                             }}
                             {...provided.droppableProps} >
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
}