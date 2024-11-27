import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MovieContent from "./movieContent.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
//import initialData from "./initialData.js";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

///https://codesandbox.io/p/sandbox/funny-buck-kkpnnkkzov?file=%2Fsrc%2Fcontainers%2FKanbanLists.js


export default function ToUpdateTimeTable() {

    const dispatch = useDispatch()



    const {
        films,
        filmsId,
    } = useSelector(state => state.films)

    const {halls} = useSelector(state => state.halls)

    //const [moviesOrder, setMoviesOrder] = useState(initialData.moviesOrder);
    /*const [halls, setHalls] = useState([
        {"h-1": {name: "Зал 1", movies: []}},
        {"h-2": {name: "Зал 2", movies: []}}]);*/
    //const hallsOrder = initialData.hallsOrder;

    const onDragEnd = (result) => {

        //console.log(result.destination)
        const destination = result.destination.droppableId;
        if (!result.destination || destination.indexOf("seancesHall") === -1) {
            return;
        }
        const hallId = destination.substr(destination.indexOf("-") + 1);
        console.log("hallId", hallId);
        console.log(Object.keys(halls[0]))
        //const movies = []
        for(let i = 0; i < halls.length;i++){
            if(Object.keys(halls[i]).includes(hallId)){
                const items = Array.from(halls[i][hallId].movies);
                const [reorderedItem] = items.splice(result.source.index, 1);
                items.splice(result.destination.index, 0, reorderedItem);
                halls[i][hallId].movies = items;
                //setHalls(halls)
                console.log("halls",halls)
            }
        }
        //const updateHallMovies = halls[hallId].movies
        //console.log("updateHall", updateHallMovies);
        /*const items = Array.from(updateHallMovies);

        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        halls[hallId].movies = items;
        console.log(halls);
        setHalls(halls);*/
    };

    //const onDragStart = () => {};

    //const onDragUpdate = () => {};

    //const onBeforeDragStart = () => {};

    const renderClone = () => {
    };

    const getContainerForClone = () => {
    };


    return (
        <section className="conf-step">
            <ConfStepHeader title="Сетка сеансов"/>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">
                    <button className="conf-step__button conf-step__button-accent">Добавить фильм</button>
                </p>
                <DragDropContext //onDragStart={this.onDragStart}
                    //onDragUpdate={this.onDragUpdate}
                    onDragEnd={onDragEnd}
                    //onBeforeDragEnd={this.onBeforeDragStart}
                >
                    <Droppable droppableId="movies"
                               renderClone={renderClone()}
                               getContainerForClone={getContainerForClone()}>
                        {(provided) => (
                            <div className="conf-step__movies" {...provided.droppableProps}

                                 ref={provided.innerRef}>

                                    {Object.keys(films).map((id,index) => {
                                    return <Draggable key={id} draggableId={id} index={index}>
                                        {(provided) => (
                                            <div className="conf-step__movie"
                                                 ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps} >
                                                <MovieContent movie={films[id]} index={id}/>
                                            </div>
                                        )}
                                    </Draggable>;
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className="conf-step__seances">
                        {Object.keys(halls).map((id) => {
                            return <SeancesHall key={id} hallId={id} movies={[]}/>;
                        })}
                    </div>
                </DragDropContext>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>

    );

}

//https://codesandbox.io/p/sandbox/github/cmcrawford2/palette-assistant/tree/main/?file=%2Fsrc%2FApp.js