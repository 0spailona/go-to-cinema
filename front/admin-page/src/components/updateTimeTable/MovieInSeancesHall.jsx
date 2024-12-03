import {useSelector} from "react-redux";
import {Draggable} from "react-beautiful-dnd";
import {getWidth} from "../../js/utils.js";

export default function MovieInSeancesHall({movieId, index}) {

    const {films} = useSelector(state => state.films);
    const film = films[movieId];
    console.log("MovieInSeancesHall: movieId", movieId);
    const width = getWidth(film.time)
    console.log("width", width)

    return (
        <Draggable draggableId={`MovieInSeancesHall-${movieId}`} index={index}>
            {(provided) => (
                <div className="conf-step__seances-movie"
                     ref={provided.innerRef} id={movieId}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps} >
                    <div className=""
                         style={{width: width, borderWidth: 4}}>
                        <p className="conf-step__seances-movie-title">{film.title}</p>
                        <p className="conf-step__seances-movie-start">00:00</p>
                    </div>
                </div>
            )}
        </Draggable>
    );
}