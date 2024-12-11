import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import Movie from "./movie.jsx";
import {useState} from "react";


export default function SeancesHall({hallId, updateIsDropAnimating, itemOnDragX,dragItemId}) {

    const {halls} = useSelector(state => state.halls);
    const {seances} = useSelector(state => state.films);
    const hall = halls[hallId];
    const filmsInHall = seances[hallId];
    const id = `seances-hall-${hallId}`;

    //let showRemoveBtn = false;

    /*if (droppableSourceId) {
        //console.log("match",droppableSourceId.match(/^seances-hall-h-(\d+)$/)[1])
         showRemoveBtn = droppableSourceId.match(/^seances-hall-h-(\d+)$/)
        // console.log("showRemoveBtn",showRemoveBtn)
    }*/

     const [showRemoveBtn, setShowRemoveBtn] = useState(false);

    const getListStyle = (snapshot, id) => {

        //const dragItemId = snapshot.draggingOverWith;
        const isDraggingOver = snapshot.isDraggingOver;

        if (dragItemId?.includes("movie-in-seance-hall")) {
            console.log("from seance dragItemId",dragItemId);
            setTimeout(()=>setShowRemoveBtn(true))
        }
        else {
            console.log("not from seance dragItemId",dragItemId);
            setTimeout(()=>setShowRemoveBtn(false))
        }


        if (id.includes("seances-hall-")) {
            return {
                background: isDraggingOver ? "lightblue" : "lightgrey",
                display: "flex",
            };
        }

        const style = {};

        if (id?.includes("remove-movie-from-hall")) {
            style.width = "100px";
            style.height = "100px";
            style.top = "35px";
            style.right = "-30px";
            style.position = "absolute";
        }

        return style;
    };


    return (
        <div className="conf-step__seances-hall-wrp">
            <div className="conf-step__seances-hall">
                <h3 className="conf-step__seances-title">{hall.name}</h3>
                <Droppable droppableId={id} index={hallId}>
                    {(provided, snapshot) => (
                        <div className="conf-step__seances-timeline" id={id}
                             ref={provided.innerRef}
                             style={getListStyle(snapshot, id)}
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
            <div className={`${showRemoveBtn ? "visible" : "invisible"}`}>
                <Droppable droppableId={`remove-movie-from-hall-${hallId}`}>
                    {(provided, snapshot) => (
                        <div className="drop-for-remove"
                             id={`remove-movie-from-hall-${hallId}`}
                             ref={provided.innerRef}
                             style={getListStyle(snapshot, `remove-movie-from-hall-${hallId}`)}
                             {...provided.droppableProps} >
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>

        </div>
    );
}