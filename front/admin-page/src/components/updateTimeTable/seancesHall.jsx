import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import MovieInSeancesHall from "./MovieInSeancesHall.jsx";


export default function SeancesHall({hallId, updateIsDropAnimating, itemOnDragX, updateIsDragoverLists}) {

    const {halls} = useSelector(state => state.halls);
    const hall = halls[hallId];
    const films = hall.movies;

     const getListStyle = (isDraggingOver, id) => {
        if (isDraggingOver) {
            setTimeout(() => updateIsDragoverLists(id.includes("seances-hall")), 1);
        }

        return {
            background: isDraggingOver ? "lightblue" : "lightgrey",
            //display: "flex",
        };
    }

    //console.log("SeancesHall films", films);

    return (
        <div className="conf-step__seances-hall">
            <h3 className="conf-step__seances-title">{hall.name}</h3>
            <Droppable droppableId={`seances-hall-${hallId}`} direction="horizontal" index={hallId}>
                {(provided, snapshot) => (
                    <div className="conf-step__seances-timeline" id={`seances-hall-${hallId}`}
                         ref={provided.innerRef}
                         style={getListStyle(snapshot.isDraggingOver, `seances-hall-${hallId}`)}
                         {...provided.droppableProps}>

                        {films ? films.map((id, index) => (
                            <MovieInSeancesHall key={id}
                                                movieId={id}
                                                index={index} blockKey={id}
                                                itemOnDragX={itemOnDragX}
                                                updateIsDropAnimating={bool => updateIsDropAnimating(bool)}/>
                        )) : ""}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>

    );
}

/*<div className="conf-step__seances-hall">
    <h3 className="conf-step__seances-title">{hall.name}</h3>
    <Droppable droppableId={`${hallId}`}>
        {(provided) => (
            <div className="conf-step__seances-timeline"
                 {...provided.droppableProps}
                 ref={provided.innerRef}>
                {films ? films.map((id, index) => {
                    return <MovieInSeancesHall key={id}
                                               movieId={id} index={index}/>;
                }) : ""}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
</div>*/
//{movies.map((movie, index) => <Movie key={index} movie={movie} index={index}/>)}