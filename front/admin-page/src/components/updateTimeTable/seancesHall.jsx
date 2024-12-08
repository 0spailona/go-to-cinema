import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import MovieInSeancesHall from "./MovieInSeancesHall.jsx";
import Movie from "./movie.jsx";


export default function SeancesHall({hallId, updateIsDropAnimating, itemOnDragX, updateIsDragoverLists}) {

    const {halls} = useSelector(state => state.halls);
    const {seances} = useSelector(state => state.films);
    const hall = halls[hallId];
    const filmsInHall = seances[hallId];
    const id = `seances-hall-${hallId}`;

     const getListStyle = (isDraggingOver, id) => {
        if (isDraggingOver) {
            setTimeout(() => updateIsDragoverLists(id.includes("seances-hall")), 1);
        }

        return {
            background: isDraggingOver ? "lightblue" : "lightgrey",
            //display: "flex",
        };
    }

    //console.log("SeancesHall hall", hall);
    //console.log("SeancesHall filmsInHall", filmsInHall);

    return (
        <div className="conf-step__seances-hall">
            <h3 className="conf-step__seances-title">{hall.name}</h3>
            <Droppable droppableId={id} direction="horizontal" index={hallId}>
                {(provided, snapshot) => (
                    <div className="conf-step__seances-timeline" id={id}
                         ref={provided.innerRef}
                         style={getListStyle(snapshot.isDraggingOver, id)}
                         {...provided.droppableProps}>

                        {filmsInHall ? filmsInHall.map((seance, index) => (
                            " ")): ""}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>

    );
}

/*<MovieInSeancesHall key={index}
                                                movieId={seance.filmId}
                                                hallId={hallId}
                                                index={index}
                                                itemOnDragX={itemOnDragX}
                                                updateIsDropAnimating={bool => updateIsDropAnimating(bool)}/>
                        )) :*/