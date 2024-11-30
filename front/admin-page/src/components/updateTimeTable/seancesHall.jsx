import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import MovieInSeancesHall from "./MovieInSeancesHall.jsx";


export default function SeancesHall({hallId}) {

    const {halls} = useSelector(state => state.halls);
    const hall = halls[hallId];
    const films = hall.movies;
    console.log("SeancesHall films", films);

    return (
        <div className="conf-step__seances-hall">
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
        </div>
    );
}
//{movies.map((movie, index) => <Movie key={index} movie={movie} index={index}/>)}