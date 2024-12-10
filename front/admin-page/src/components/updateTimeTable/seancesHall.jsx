import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import Movie from "./movie.jsx";


export default function SeancesHall({hallId, updateIsDropAnimating, itemOnDragX}) {

    const {halls} = useSelector(state => state.halls);
    const {seances} = useSelector(state => state.films);
    const hall = halls[hallId];
    const filmsInHall = seances[hallId];
    const id = `seances-hall-${hallId}`;

    const getListStyle = (isDraggingOver, id) => {

        return {
            background: isDraggingOver ? "lightblue" : "lightgrey",
            display:"flex",
        };
    };


    return (
        <div className="conf-step__seances-hall">
            <h3 className="conf-step__seances-title">{hall.name}</h3>
            <Droppable droppableId={id}  index={hallId}>
                {(provided, snapshot) => (
                    <div className="conf-step__seances-timeline" id={id}
                         ref={provided.innerRef}
                         style={getListStyle(snapshot.isDraggingOver, id)}
                         {...provided.droppableProps}>

                        {filmsInHall ? filmsInHall.map((seance, index) => (
                            <Movie index={index} key={index} hallId={hallId}
                                   movieId={seance.filmId} itemOnDragX={itemOnDragX}
                                   updateIsDropAnimating={updateIsDropAnimating}
                                   seanceId={seance.id}/>)) : ""}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}