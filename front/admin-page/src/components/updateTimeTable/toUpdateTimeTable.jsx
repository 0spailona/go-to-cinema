import ConfStepHeader from "../common/ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupAddFilm from "./popupAddFilm.jsx";
import PopupRemoveFilm from "./popupRemoveFilm.jsx";
import {
    addFilmToSeancesHall,
    fetchUpdatesSeances,
    getFilmsByDate,
    removeFilmFromSeanceHall,
    resetUpdatesSeances
} from "../../redux/slices/films.js";
import {getItemOnDragX, pxToMinutes} from "../../js/utils.js";
import {getSeanceHallWidth} from "../../js/info.js";
import {droppableIdsBase, getSeancesHallId} from "./utilsFunctions.js";
import PopupUpdateDate from "./popupUpdateDate.jsx";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ru} from "date-fns/locale/ru";
import Loader from "react-js-loader";

registerLocale("ru", ru);


let curDraggableId = null;
let curDroppableId = null;
let isDropAnimating = false;
let timerId = null;

let itemOnDragX = null;

/*function Loader(props) {
    return null;
}

Loader.propTypes = {
    type: PropTypes.string,
    bgColor: PropTypes.any,
    color: PropTypes.any,
    title: PropTypes.string,
    size: PropTypes.number
};*/
export default function ToUpdateTimeTable() {


    const dispatch = useDispatch();

    const {films, seances, chosenDate, isUpdatedSeances, loadingFilms} = useSelector(state => state.films);
    const {halls} = useSelector(state => state.halls);

    //console.log("ToUpdateTimeTable seances", seances);
    console.log("loadingFilms", loadingFilms);
    const [showAllMoviesLoader, setShowAllMoviesLoader] = useState(loadingFilms);

    useEffect(() => {
        setShowAllMoviesLoader(loadingFilms);
    }, [loadingFilms]);

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [showPopupUpdateDate, setShowPopupUpdateDate] = useState({isShown: false, with: null});
    const [showRemoveFromAllMovies, setShowRemoveFromAllMovies] = useState(false);

    const [sourceDroppableId, setSourceDroppableId] = useState(null);
    //const [dataInputValue, setDataInputValue] = useState(chosenDate);
    //const [newChosenDate, setNewChosenDate] = useState(null);

    const [startDate, setStartDate] = useState(chosenDate ? new Date(chosenDate) : null);

    const getRemoveBtnStyle = () => {
        return {top: "110px", right: "100px"};
    };


    function isCanDrop() {
        if (curDroppableId?.includes(droppableIdsBase.seanceHall)) {
            const width = document.getElementById(curDraggableId).getBoundingClientRect().width;
            const hallWidth = getSeanceHallWidth();

            if (itemOnDragX < -10 || itemOnDragX + width > hallWidth + 10) {
                return false;
            }

            if (itemOnDragX < 0) {
                itemOnDragX = 0;
            }

            if (itemOnDragX + width >= hallWidth) {
                itemOnDragX = hallWidth - width;
            }
        }

        return true;
    }

    function onTimer() {
        if (isDropAnimating) {
            return;
        }

        itemOnDragX = getItemOnDragX(curDraggableId, curDroppableId);
    }


    const onDragUpdate = (result) => {
        curDroppableId = result.destination?.droppableId;

        if (result.source.droppableId === droppableIdsBase.allMovies) {
            setShowRemoveFromAllMovies(true);
        }

    };

    const onDragStart = (result) => {
        curDraggableId = result.draggableId;
        curDroppableId = result.source.droppableId;
        setSourceDroppableId(curDroppableId);
        timerId = setInterval(onTimer, 50);
    };

    const onDragEnd = (result) => {
        clearInterval(timerId);
        setShowRemoveFromAllMovies(false);

        if (!isCanDrop()) {
            return;
        }

        const {source, destination, draggableId} = result;
        if (!destination || destination.droppableId === droppableIdsBase.allMovies) {
            return;
        }
        const fromId = source.droppableId;
        const itemIndex = source.index;
        const toId = destination.droppableId;

        const start = pxToMinutes(itemOnDragX);

        if (toId === droppableIdsBase.removeFromAllMovies) {
            setShowPopupForRemove(true);
        }
        else if (toId.includes(droppableIdsBase.removeFromSeances)) {
            const hallId = toId.match(/^remove-movie-from-hall-h-(\d+)$/)[1];
            dispatch(removeFilmFromSeanceHall({filmIndex: itemIndex, hallId: `h-${hallId}`}));
        }
        else {
            const hallId = toId.match(/^seances-hall-h-(\d+)$/)[1];
            const filmId = draggableId.match(/^movie-in-[\w-]+-(\d+)$/)[1];

            if (fromId === droppableIdsBase.allMovies) {
                dispatch(addFilmToSeancesHall({
                    from: null,
                    to: `h-${hallId}`,
                    filmId: `film-${filmId}`,
                    start,
                    filmIndex: itemIndex
                }));
            }
            else {
                const fromHallId = fromId.match(/^seances-hall-h-(\d+)$/)[1];
                dispatch(addFilmToSeancesHall({
                    from: `h-${fromHallId}`,
                    to: `h-${hallId}`,
                    filmId: `film-${filmId}`,
                    start,
                    filmIndex: itemIndex
                }));
            }
        }
        setSourceDroppableId(null);
    };

    const onDataInputChange = (newDate) => {
        //const newDate = e.target.valueAsDate;
        if (chosenDate && chosenDate !== newDate && isUpdatedSeances) {
            setShowPopupUpdateDate({isShown: true, with: newDate});
            //console.log("show popup")
        }
        else {
            dispatch(getFilmsByDate(newDate.toISOString()));
        }
        setStartDate(newDate);
        //setDataInputValue(e.target.value);
        //console.log("newDate", typeof newDate);

    };

    console.log("showLoaderAllMovies", showAllMoviesLoader);
    return (<>
            <PopupUpdateDate showPopup={showPopupUpdateDate.isShown}
                             closePopup={() => setShowPopupUpdateDate({isShown: false, with: null})}
                             lastChosenDate={chosenDate} newChosenDate={showPopupUpdateDate.with}/>
            <PopupAddFilm showPopup={showPopupForAdd} closePopup={() => setShowPopupForAdd(false)}/>
            <PopupRemoveFilm showPopup={showPopupForRemove} movieId={curDraggableId?.replace("movie-in-list-", "")}
                             closePopup={() => setShowPopupForRemove(false)}/>

            <section className="conf-step">
                <ConfStepHeader title="Сетка сеансов"/>
                <div className="conf-step__wrapper">
                    <DragDropContext
                        onDragUpdate={onDragUpdate}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}>
                        <div className="conf-step__paragraph"
                             style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <MyButton type="button" text="Добавить фильм" onclick={() => setShowPopupForAdd(true)}/>
                            <div className={`${showRemoveFromAllMovies ? "visible" : "invisible"}`}>
                                <Droppable droppableId={droppableIdsBase.removeFromAllMovies}>
                                    {provided => (
                                        <div className="drop-for-remove"
                                             id={droppableIdsBase.removeFromAllMovies}
                                             ref={provided.innerRef}
                                             style={getRemoveBtnStyle()}
                                             {...provided.droppableProps} >
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                        <div className={`loader ${showAllMoviesLoader ? "" : "d-none"}`}>
                            <Loader type="bubble-scale" bgColor="#63536C" color="#FFFFFF"
                                    size={50}/>
                        </div>
                        <Droppable droppableId={droppableIdsBase.allMovies} direction="horizontal">
                            {provided => (
                                <div className="conf-step__movies" id={droppableIdsBase.allMovies}
                                     ref={provided.innerRef}
                                     {...provided.droppableProps}>
                                    {Object.keys(films).map((id, index) => <Movie key={id} movieId={id} index={index}
                                                                                  itemOnDragX={itemOnDragX}
                                                                                  updateIsDropAnimating={bool => isDropAnimating = bool}/>)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className="conf-step__date">

                            <label className={`conf-step__label conf-step__label-mediumsize`} htmlFor="date">Выберите
                                дату:
                                <DatePicker className="conf-step__input" selected={startDate} locale="ru"
                                            onChange={onDataInputChange} dateFormat="dd MMMM yyyy"/>
                            </label>

                        </div>
                        <div className="conf-step__seances">
                            {seances[chosenDate] ? Object.keys(seances[chosenDate]).map((id) => (
                                <SeancesHall key={id} hallId={id}
                                             hallName={halls[id].name}
                                             dropId={getSeancesHallId(id)}
                                             filmsInHall={seances[chosenDate][id]} itemOnDragX={itemOnDragX}
                                             updateIsDropAnimating={bool => isDropAnimating = bool}
                                             showRemoveBtn={sourceDroppableId === getSeancesHallId(id)}
                                             sourceDroppableId={sourceDroppableId}
                                />
                            )) : ""}
                        </div>
                    </DragDropContext>
                    <div className="conf-step__buttons text-center">
                        <MyButton type="reset" text="Отмена" onclick={() => dispatch(resetUpdatesSeances())}/>
                        <MyButton type="submit" text="Сохранить" onclick={() => dispatch(fetchUpdatesSeances())}/>
                    </div>
                </div>
            </section>
        </>
    );

}
