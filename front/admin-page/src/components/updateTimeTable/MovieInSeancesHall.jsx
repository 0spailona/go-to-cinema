import {useSelector} from "react-redux";
import {Draggable} from "react-beautiful-dnd";

export default function MovieInSeancesHall({movieId, index, itemOnDragX, updateIsDropAnimating}) {

    const {films} = useSelector(state => state.films);
    const film = films[movieId];
    const id = `${movieId}-movie-in-seance-hall-${index}`;
    console.log("MovieInSeancesHall: movieId", movieId);
    //const width = getWidth(film.time)
    //console.log("width", width)

    const getItemInListStyle = (snapshot, draggableStyle, block, id) => {
        draggableStyle = {...draggableStyle};
        updateIsDropAnimating(snapshot.isDropAnimating);

        if (snapshot.isDropAnimating) {
            draggableStyle.left = itemOnDragX;
            draggableStyle.transitionDuration = "0.00001s";
        }
        //console.log("getItemInListStyle isDragging draggableStyle",draggableStyle,snapshot.isDragging)

        //draggableStyle.background = block.color;

        const elem = document.getElementById(id);

        if (elem) {
            elem.innerText = itemOnDragX;
        }

        if (!snapshot.isDragging) {
            draggableStyle.transform = null;
            //draggableStyle.left = `${block.offset}px`;
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
                         provided.draggableProps.style, film, id)}
                     ref={provided.innerRef}>
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
/*<Draggable draggableId={`MovieInSeancesHall-${movieId}`} index={index}>
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
</Draggable>*/
;