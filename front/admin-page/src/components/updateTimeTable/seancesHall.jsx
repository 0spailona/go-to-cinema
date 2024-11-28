// eslint-disable-next-line react/prop-types
import {Droppable,Draggable} from "react-beautiful-dnd";

import initialData from "./initialData.js";
import MovieContent from "./movieContent.jsx";
import {useState} from "react";

// eslint-disable-next-line react/prop-types
export default function SeancesHall({hallId,movies}) {

    //console.log('render hall')
    /*const hall = initialData.halls[hallId];
    const [moviesList, setMoviesList] = useState(movies);
    //console.log('render', hall);

    return (
        <div className="conf-step__seances-hall">
            <h3 className="conf-step__seances-title">{hall.name}</h3>
            <Droppable droppableId={`seancesHall-${hallId}`}>
                {(provided) => (
                    <div className="conf-step__seances-timeline"
                         {...provided.droppableProps}
                         ref={provided.innerRef}>
                        {moviesList?moviesList.map((id,index)=> {
                            return <Draggable key={id} draggableId={id} index={index}>
                                {(provided) => (
                                    <div className="conf-step__movie"
                                         ref={provided.innerRef}
                                         {...provided.draggableProps}
                                         {...provided.dragHandleProps} ><MovieContent
                                        movie={initialData.movies[id]} index={id}
                                    /></div>
                                )}
                            </Draggable>
                        }) : ""}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );*/
}
//{movies.map((movie, index) => <Movie key={index} movie={movie} index={index}/>)}