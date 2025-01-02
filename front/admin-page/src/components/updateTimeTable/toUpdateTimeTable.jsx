import ConfStepHeader from "../common/ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupAddFilm from "./popupAddFilm.jsx";
import PopupRemoveFilmFromList from "./popupRemoveFilm.jsx";
import {
    addFilmToSeancesHall,
    fetchMovies,
    fetchNewMovie,
    fetchUpdatesSeances,
    getFilmsByDate,
    removeFilm,
    removeFilmFromSeanceHall, removeMovieFromList,
    resetUpdateSeancesByDate,
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
import PopupRemoveFilmFromSeances from "./popupRemoveFilmFromSeances.jsx";
import MyPopup from "../common/myPopup.jsx";

registerLocale("ru", ru);


let curDraggableId = null;
let curDroppableId = null;
let isDropAnimating = false;
let timerId = null;

let itemOnDragX = null;

export default function ToUpdateTimeTable() {


    const dispatch = useDispatch();

    const {films, seances, chosenDate, isUpdatedSeances, loadingFilms} = useSelector(state => state.films);
    const {halls} = useSelector(state => state.halls);

    //console.log("ToUpdateTimeTable seances", seances);
    //console.log("loadingFilms", loadingFilms);
    const [showAllMoviesLoader, setShowAllMoviesLoader] = useState(loadingFilms);

    useEffect(() => {
        setShowAllMoviesLoader(loadingFilms);
    }, [loadingFilms, films]);


    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
   // const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [showPopupUpdateDate, setShowPopupUpdateDate] = useState({isShown: false, with: null});

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [validateError, setValidateError] = useState(null);

    const initialShowRemoveFromSeance = {
        isShown: false,
        hallId: null,
        filmIndex: null,
        filmTitle: null
    };
    const [showRemoveFromSeance, setShowRemoveFromFromSeance] = useState(initialShowRemoveFromSeance);
    const [showRemoveFromAllMovies, setShowRemoveFromAllMovies] = useState({isShown: false, filmTitle: null});

    const [sourceDroppableId, setSourceDroppableId] = useState(null);


    const [startDate, setStartDate] = useState(chosenDate ? new Date(chosenDate) : null);

    const getRemoveBtnStyle = () => {
        if(curDraggableId){
            return {opacity: "1",
                pointerEvents: "auto"};
        }
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
        //console.log("onTimer");
        itemOnDragX = getItemOnDragX(curDraggableId, curDroppableId);
    }


    const onDragUpdate = (result) => {
        curDroppableId = result.destination?.droppableId;

        /*if (result.source.droppableId === droppableIdsBase.allMovies) {
          const filmTitle = films[curDraggableId?.replace("movie-in-list-", "").title]
            setShowRemoveFromAllMovies({isShown: false,filmTitle});
        }*/

    };

    const onDragStart = (result) => {
        curDraggableId = result.draggableId;
        //console.log("onDragStart curDraggableId",curDraggableId);
        curDroppableId = result.source.droppableId;
        setSourceDroppableId(curDroppableId);
       // const filmTitle = films[curDraggableId?.replace("movie-in-list-", "")].title

        //console.log("onDragStart filmTitle",filmTitle);
        //setShowRemoveFromAllMovies({isShown: false,filmTitle});
        timerId = setInterval(onTimer, 50);
    };

    const onDragEnd = (result) => {
        clearInterval(timerId);
        //setShowRemoveFromAllMovies({isShown: false, filmTitle: null});

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
            const filmTitle = films[curDraggableId?.replace("movie-in-list-", "")].title
            setShowRemoveFromAllMovies({isShown: true,filmTitle});
        }
        else if (toId.includes(droppableIdsBase.removeFromSeances)) {
            const hallId = toId.match(/^remove-movie-from-hall-h-(\d+)$/)[1];
            const filmId = draggableId.match(/^movie-in-[\w-]+-(\d+)$/)[1];
            const filmTitle = films[`film-${filmId}`].title;
            setShowRemoveFromFromSeance({
                isShown: true,
                hallId: `h-${hallId}`,
                filmIndex: itemIndex,
                filmTitle
            });
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


        if (chosenDate && chosenDate !== newDate && isUpdatedSeances) {
            setShowPopupUpdateDate({isShown: true, with: newDate});
        }
        else {
            dispatch(getFilmsByDate(newDate.toISOString()));
        }
        setStartDate(newDate);
    };


    const onResetRemoveFromList = (e) => {
        e.preventDefault();
        console.log("onResetRemove");
        setShowRemoveFromAllMovies({isShown: false, filmTitle: null});
    };

    const onSubmitRemoveFromList = (e) => {
        e.preventDefault();
        //dispatch(removeFilm(curDraggableId?.replace("movie-in-list-")));
        dispatch(removeMovieFromList(curDraggableId?.replace("movie-in-list-","")))
        dispatch(fetchMovies());
        setShowRemoveFromAllMovies({isShown: false, filmTitle: null});
    };

    const onResetRemoveFromSeance = (e) => {
        e.preventDefault();
        console.log("onResetRemove");
        setShowRemoveFromFromSeance(initialShowRemoveFromSeance);
    };

    const onSubmitRemoveFromSeance = (e) => {
        e.preventDefault();
        dispatch(removeFilmFromSeanceHall({
            filmIndex: showRemoveFromSeance.filmIndex,
            hallId: showRemoveFromSeance.hallId
        }));
        setShowRemoveFromFromSeance(initialShowRemoveFromSeance);
    };

    const onResetUpdateDate = (e) => {
        e.preventDefault();
        dispatch(resetUpdateSeancesByDate(chosenDate));
        dispatch(getFilmsByDate(showPopupUpdateDate.with.toISOString()));
        // console.log("onReset");
        setShowPopupUpdateDate({isShown: false, with: null});
    };

    const onSubmitUpdateDate = (e) => {
        e.preventDefault();
        dispatch(getFilmsByDate(showPopupUpdateDate.with.toISOString()));
        setShowPopupUpdateDate({isShown: false, with: null});
    };

    const onResetAddToList = (e) => {
        setShowErrorPopup(false);
        setValidateError(null);
        setShowPopupForAdd(false);
    };

    const onSubmitAddToList = (data) => {
        dispatch(fetchNewMovie(data));
        setShowErrorPopup(false);
        setValidateError(null);
        setShowPopupForAdd(false);
        dispatch(fetchMovies());
    };

    const onValidateError = (msg) => {
        setValidateError(msg);
        setShowErrorPopup(true);
    };
    // console.log("showLoaderAllMovies", showAllMoviesLoader);
    return (<>
            <PopupRemoveFilmFromSeances showPopup={showRemoveFromSeance.isShown}
                                        title={showRemoveFromSeance.filmTitle}
                                        onSubmit={onSubmitRemoveFromSeance}
                                        onReset={onResetRemoveFromSeance}
                                        closePopup={() => setShowRemoveFromFromSeance(initialShowRemoveFromSeance)}/>
            <PopupUpdateDate showPopup={showPopupUpdateDate.isShown}
                             closePopup={() => setShowPopupUpdateDate({isShown: false, with: null})}
                             lastChosenDate={chosenDate}
                             onSubmit={onSubmitUpdateDate}
                             onReset={onResetUpdateDate}/>
            <PopupAddFilm showPopup={showPopupForAdd}
                          closePopup={() => setShowPopupForAdd(false)}
                          onReset={onResetAddToList}
                          onSubmit={onSubmitAddToList}
                          onError={onValidateError}/>
            <PopupRemoveFilmFromList showPopup={showRemoveFromAllMovies.isShown}
                                     onReset={onResetRemoveFromList}
                                     onSubmit={onSubmitRemoveFromList}
                                     title={showRemoveFromAllMovies.filmTitle}
                                     closePopup={() => setShowRemoveFromAllMovies({isShown: false,filmTitle: null})}/>

            <section className="conf-step">
                <ConfStepHeader title="Сетка сеансов"/>
                <div className="conf-step__wrapper">
                    <MyPopup isVisible={showErrorPopup} title="Неверно введенные данные"
                             onClose={() => setShowErrorPopup(false)}>
                        <p className="conf-step__paragraph">{`${validateError}`}</p>
                    </MyPopup>
                    <DragDropContext
                        onDragUpdate={onDragUpdate}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}>
                        <div className="conf-step__paragraph"
                             style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <MyButton type="button" text="Добавить фильм" onclick={() => setShowPopupForAdd(true)}/>
                            <div className={`${showRemoveFromAllMovies ? "visible" : "invisible"}`}>
                                <Droppable droppableId={droppableIdsBase.removeFromAllMovies}>
                                    {(provided) => (
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
                        {loadingFilms ?
                            <div className={`loader ${showAllMoviesLoader ? "" : "d-none"}`}>
                                <Loader type="bubble-scale" bgColor="#63536C" color="#FFFFFF"
                                        size={50}/>
                            </div> : films ?
                                <Droppable droppableId={droppableIdsBase.allMovies} direction="horizontal">
                                    {provided => (
                                        <div className="conf-step__movies" id={droppableIdsBase.allMovies}
                                             ref={provided.innerRef}
                                             {...provided.droppableProps}>
                                            {Object.keys(films).map((id, index) =>
                                                <Movie key={id} movieId={id}
                                                       index={index}
                                                       itemOnDragX={itemOnDragX}
                                                       updateIsDropAnimating={bool => isDropAnimating = bool}/>)}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable> :
                                <p className="conf-step__paragraph">В базе пока нет ни одного фильма</p>
                        }

                        <div className="conf-step__date">

                            <label className={`conf-step__label conf-step__label-mediumsize`} htmlFor="date">Выберите
                                дату:
                                <DatePicker className="conf-step__input" selected={startDate} locale="ru"
                                            onChange={onDataInputChange} dateFormat="dd MMMM yyyy"
                                            minDate={new Date()}/>
                            </label>

                        </div>
                        <div className="conf-step__seances">
                            {films && seances[chosenDate] ? Object.keys(seances[chosenDate]).map((id) => (
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
