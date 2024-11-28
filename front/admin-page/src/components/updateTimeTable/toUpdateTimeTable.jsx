import ConfStepHeader from "../common/ConfStepHeader.jsx";
import MovieContent from "./movieContent.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
//import initialData from "./initialData.js";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MyPopup from "../common/myPopup.jsx";
import MyInput from "../common/myInput.jsx";

///https://codesandbox.io/p/sandbox/funny-buck-kkpnnkkzov?file=%2Fsrc%2Fcontainers%2FKanbanLists.js


export default function ToUpdateTimeTable() {

    const dispatch = useDispatch();


    const {
        films,
    } = useSelector(state => state.films);

    const {halls} = useSelector(state => state.halls);

    const [inputTitle, setInputTitle] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [inputCountry, setInputCountry] = useState("");

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [filmForRemove, setFilmForRemove] = useState(null);


    const onResetAdd = (e) => {
        e.preventDefault();
        console.log("onResetAdd");
        setShowPopupForAdd(false);
    };

    const onSubmitAdd = (e) => {
        e.preventDefault();
        console.log("onSubmitAdd");
        setShowPopupForAdd(false);
        const formdata = new FormData(e.currentTarget);
        const title = Object.fromEntries(formdata).title;
        const description = Object.fromEntries(formdata).description;
        const country = Object.fromEntries(formdata).country;
        const poster = Object.fromEntries(formdata).poster;
        const time = Object.fromEntries(formdata).duration;
        console.log("formdata", title, description, country, time);

    };

    const onResetRemove = (e) => {
        e.preventDefault();
        console.log("onResetRemove");
        setShowPopupForRemove(false);
    };

    const onSubmitRemove = (e) => {
        e.preventDefault();
        console.log("onSubmitRemove");
        setShowPopupForRemove(false);
    };


    return (<>
            <MyPopup isVisible={showPopupForAdd} title="Добавление фильма"
                     onClose={() => setShowPopupForAdd(false)}
                     textForSubmitBtn="Добавить фильм"
                     textForResetBtn="Отменить"
                     textForAddContent="Загрузить постер"
                     onReset={e => onResetAdd(e)}
                     onSubmit={e => onSubmitAdd(e)}>
                <div className="popup__container">
                    <div className="popup__poster"></div>
                    <div className="popup__form">
                        <MyInput label="Название фильма" name="title" size="full" isRequired={true}
                                 placeholder="Например, &laquo;Гражданин Кейн&raquo;" value={inputTitle}
                                 onChange={e => setInputTitle(e.target.value)}/>
                        <MyInput label="Продолжительность фильма (мин.)" name="duration" size="full"
                                 isRequired={true}
                                 value={inputTime}
                                 onChange={e => setInputTime(e.target.value)}/>
                        <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                            Описание фильма
                            <textarea className="conf-step__input" type="text" name="description" required
                                      value={inputDescription} onChange={() => setInputDescription()}></textarea>
                        </label>
                        <MyInput label="Страна" name="country" size="full" isRequired={true}
                                 value={inputCountry} onChange={e => setInputCountry(e.target.value)}/>
                    </div>
                </div>
            </MyPopup>
            <MyPopup isVisible={showPopupForRemove} title="Удаление фильма"
                     onClose={() => setShowPopupForRemove(false)}
                     textForSubmitBtn="Удалить"
                     textForResetBtn="Отменить"
                     onReset={e => onResetRemove(e)}
                     onSubmit={e => onSubmitRemove(e)}>
                <p className="conf-step__paragraph">Вы действительно хотите удалить фильм <span>"Название фильма"</span>?
                </p>
            </MyPopup>

            <section className="conf-step">
                <ConfStepHeader title="Сетка сеансов"/>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">
                        <MyButton type="button" text="Добавить фильм" onclick={() => setShowPopupForAdd(true)}/>
                    </p>
                    <DragDropContext //onDragStart={this.onDragStart}
                        //onDragUpdate={this.onDragUpdate}
                        //onDragEnd={onDragEnd}
                        //onBeforeDragEnd={this.onBeforeDragStart}
                    >
                        <Droppable droppableId="movies"
                                   //renderClone={renderClone()}
                                   //getContainerForClone={getContainerForClone()}
                            >
                            {(provided) => (
                                <div className="conf-step__movies" {...provided.droppableProps}

                                     ref={provided.innerRef}>

                                    {Object.keys(films).map((id, index) => {
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
        </>
    );

}

//https://codesandbox.io/p/sandbox/github/cmcrawford2/palette-assistant/tree/main/?file=%2Fsrc%2FApp.js