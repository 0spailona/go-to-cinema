import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import Movie from "./movie.jsx";


export default function SeancesHall({hallId,hallName,filmsInHall,dropId, updateIsDropAnimating, itemOnDragX, showRemoveBtn}) {


   // const {seances,chosenDate} = useSelector(state => state.films);

    //const filmsInHall = seances[chosenDate][hallId]
   // console.log("seancesHall filmsInHall", filmsInHall);

    const removeId = `remove-movie-from-hall-${hallId}`

    const getListStyle = (isDraggingOver) => {
        return {
            background: isDraggingOver ? "lightblue" : "lightgrey",
            display: "flex",
        };
    };

    const getRemoveBtnStyle = () => {
        return {
            top: "35px",
            right: "-30px",
        };
    };


    return (
        <div className="conf-step__seances-hall-wrp">
            <div className="conf-step__seances-hall">
                <h3 className="conf-step__seances-title">{hallName}</h3>
                <Droppable droppableId={dropId}>
                    {(provided, snapshot) => (
                        <div className="conf-step__seances-timeline" id={dropId}
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
            <div className={`${showRemoveBtn ? "visible" : "invisible"}`}>
                <Droppable droppableId={removeId}>
                    {(provided) => (
                        <div className="drop-for-remove"
                             id={removeId}
                             ref={provided.innerRef}
                             style={getRemoveBtnStyle()}
                             {...provided.droppableProps} >
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
}