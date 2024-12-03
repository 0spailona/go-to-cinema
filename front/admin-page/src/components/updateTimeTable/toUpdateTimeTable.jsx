import ConfStepHeader from "../common/ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupAddFilm from "./popupAddFilm.jsx";
import PopupRemoveFilm from "./popupRemoveFilm.jsx";
import {addFilmToSeancesHall} from "../../redux/slices/films.js";
import {addFilmToHall} from "../../redux/slices/halls.js";

///https://codesandbox.io/p/sandbox/funny-buck-kkpnnkkzov?file=%2Fsrc%2Fcontainers%2FKanbanLists.js


export default function ToUpdateTimeTable() {

    const dispatch = useDispatch();


    const {
        films,
    } = useSelector(state => state.films);

    const {halls} = useSelector(state => state.halls);

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);

    /*const onDragEnd = ({ source, destination, draggableId }) =>{
        if (!destination) {
            return
        }
        if (source.droppableId !== destination.droppableId) {
            const from = source.droppableId
            const to = destination.droppableId
            const film = draggableId
            dispatch(addFilmToHall({from, to, film}))
        }
    }*/
    const onDragOn =()=>{}

    return (<>
            <PopupAddFilm showPopup={showPopupForAdd} closePopup={()=>setShowPopupForAdd(false)}/>
            <PopupRemoveFilm showPopup={showPopupForRemove} closePopup={()=>setShowPopupForRemove(false)}/>

            <section className="conf-step">
                <ConfStepHeader title="Сетка сеансов"/>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">
                        <MyButton type="button" text="Добавить фильм" onclick={() => setShowPopupForAdd(true)}/>
                    </p>
                    <DragDropContext //onDragEnd={onDragEnd}
                         >
                        <Droppable droppableId="movies" isCombineEnabled={true}>
                            {(provided) => (
                                <div className="conf-step__movies" {...provided.droppableProps}
                                     ref={provided.innerRef}>
                                    {Object.keys(films).map((id, index) => <Movie key={id} movieId={id} index={id}/>)}
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
        </>
    );

}

//https://codesandbox.io/p/sandbox/github/cmcrawford2/palette-assistant/tree/main/?file=%2Fsrc%2FApp.js