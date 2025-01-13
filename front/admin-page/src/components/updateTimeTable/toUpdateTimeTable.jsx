import ConfStepHeader from "../common/ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupAddFilm from "./popupAddFilm.jsx";
import PopupRemoveFilmFromList from "./popupRemoveFilm.jsx";
import {fetchMovies, fetchNewMovie, removeMovieFromList,} from "../../redux/slices/films.js";
import {checkDropInHall, getItemOnDragX, pxToMinutes, toISOStringNoMs} from "../../js/utils.js";
import {getSeanceHallWidth} from "../../js/info.js";
import {draggableIdsBase, droppableIdsBase, getSeancesHallId} from "./utilsFunctions.js";
import PopupUpdateDate from "./popupUpdateDate.jsx";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ru} from "date-fns/locale/ru";
import Loader from "react-js-loader";
import PopupRemoveFilmFromSeances from "./popupRemoveFilmFromSeances.jsx";
import MyPopup from "../common/myPopup.jsx";
import {
    addFilmToSeancesHall,
    fetchUpdatesSeances,
    getSeancesByDate,
    removeFilmFromSeanceHall,
    resetUpdatesSeances, updateSeances
} from "../../redux/slices/seances.js";

registerLocale("ru", ru);


let curDraggableId = null;
let curDroppableId = null;
let isDropAnimating = false;
let timerId = null;

let itemOnDragX = null;

export default function ToUpdateTimeTable() {


    const dispatch = useDispatch();

    const {films, loadingFilms} = useSelector(state => state.films);
    const {
        seances,
        isUpdatedSeances, loadingSeances
    } = useSelector(state => state.seances);
    const {halls} = useSelector(state => state.halls);

    const [showAllMoviesLoader, setShowAllMoviesLoader] = useState(loadingFilms);

    const today = new Date()
    today.setHours(0, 0, 0, 0);

    useEffect(()=>{
        if(halls && Object.keys(halls).length > 0){
            dispatch(getSeancesByDate(toISOStringNoMs(today)))
        }
    },[])

    useEffect(() => {
        if(halls && Object.keys(halls).length > 0){
            dispatch(getSeancesByDate(toISOStringNoMs(chosenDate)));
        }
    }, [halls]);

    useEffect(() => {
        setShowAllMoviesLoader(loadingFilms);
    }, [loadingFilms, films]);


    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupUpdateDate, setShowPopupUpdateDate] = useState({isShown: false, date: null});

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
    const [chosenDate, setChosenDate] = useState(today);

    function isCanDrop(hallId, filmId) {
        if (curDroppableId?.includes(droppableIdsBase.seanceHall)) {
            const width = document.getElementById(curDraggableId).getBoundingClientRect().width;
            const hallWidth = getSeanceHallWidth();
            const seancesInHall = seances[hallId].seances;

            if (!checkDropInHall(itemOnDragX, width, hallWidth, films[filmId], seancesInHall, films)) {
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

        if (curDraggableId.includes(draggableIdsBase.movieInList)) {
            const filmTitle = films[curDraggableId?.replace(draggableIdsBase.movieInList, "")].title;
            setShowRemoveFromAllMovies({isShown: false, filmTitle});
        }

        timerId = setInterval(onTimer, 50);
    };

    const onDragEnd = (result) => {
        clearInterval(timerId);
        setShowRemoveFromAllMovies({isShown: false, filmTitle: null});
        setSourceDroppableId(null);
       // console.log("onDragEnd", result);

        const {source, destination, draggableId} = result;
        if (!destination || destination.droppableId === droppableIdsBase.allMovies) {
            return;
        }

        const fromId = source.droppableId;
        const itemIndex = source.index;
        const toId = destination.droppableId;
        //console.log("source",source);
        //console.log("toId", toId);

        const start = pxToMinutes(itemOnDragX);

        if (toId === droppableIdsBase.removeFromAllMovies) {
            if(source.droppableId !== droppableIdsBase.allMovies){
                return;
            }
            const filmTitle = films[draggableId?.replace(draggableIdsBase.movieInList, "")].title;
            setShowRemoveFromAllMovies({isShown: true, filmTitle});
        }
        else if (toId.includes(droppableIdsBase.removeFromSeances)) {
            //console.log("removeFromSeances", droppableIdsBase.removeFromSeances);
            if(!source.droppableId.includes(droppableIdsBase.seanceHall)) {
                return;
            }
            const hallId = toId.match(/^remove-movie-from-hall-([0-9a-f]+)$/)[1];
            const filmId = draggableId.match(/^movie-in-[\w-]+-([0-9a-f]+)$/)[1];
            const filmTitle = films[filmId].title;
            setShowRemoveFromFromSeance({
                isShown: true,
                hallId,
                filmIndex: itemIndex,
                filmTitle
            });
        }
        else {
            const hallId = toId.match(/^seances-hall-([0-9a-f]+)$/)[1];
            const filmId = draggableId.match(/^movie-in-[\w-]+-([0-9a-f]+)$/)[1];

            if (!isCanDrop(hallId, filmId)) {
                return;
            }

            if (fromId === droppableIdsBase.allMovies) {
                dispatch(addFilmToSeancesHall({
                    from: null,
                    to: hallId,
                    filmId,
                    start,
                    filmIndex: itemIndex
                }));
            }
            else {
                const fromHallId = fromId.match(/^seances-hall-([0-9a-f]+)$/)[1];

                dispatch(addFilmToSeancesHall({
                    from: fromHallId,
                    to: hallId,
                    filmId,
                    start,
                    filmIndex: itemIndex
                }));
            }
        }
        curDraggableId = null;
        curDroppableId = null;
        isDropAnimating = false;
        timerId = null;
        itemOnDragX = null;
    };


    const onResetRemoveFromList = (e) => {
        e.preventDefault();
        setShowRemoveFromAllMovies({isShown: false, filmTitle: null});
    };

    const onSubmitRemoveFromList = (e) => {
        e.preventDefault();
        dispatch(removeMovieFromList(curDraggableId?.replace(draggableIdsBase.movieInList, "")));
        dispatch(fetchMovies());
        setShowRemoveFromAllMovies({isShown: false, filmTitle: null});
    };

    const onResetRemoveFromSeance = (e) => {
        e.preventDefault();
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

    const onDateSelected = (newDate) => {
        newDate.setHours(0, 0, 0, 0);

        if (chosenDate && chosenDate !== newDate && isUpdatedSeances) {
            setShowPopupUpdateDate({isShown: true, date: newDate});
        }
        else {
            const date = toISOStringNoMs(newDate);
            dispatch(getSeancesByDate(date));
            setChosenDate(newDate);
        }
    };

    const onResetUpdateDate = (e) => {
        e.preventDefault();
       // console.log("showPopupUpdateDate.date",showPopupUpdateDate.date)
        const date = toISOStringNoMs(showPopupUpdateDate.date);
        dispatch(getSeancesByDate(date));
        setChosenDate(showPopupUpdateDate.date);
        setShowPopupUpdateDate({isShown: false, date: null});
    };

    const onSubmitUpdateDate = (e) => {
        e.preventDefault();

        dispatch(updateSeances({seances, date:chosenDate}))
        const date = toISOStringNoMs(showPopupUpdateDate.date);
        dispatch(getSeancesByDate(date));
        setChosenDate(showPopupUpdateDate.date);
        setShowPopupUpdateDate({isShown: false, date: null});
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
                             closePopup={() => setShowPopupUpdateDate({isShown: false, date: null})}
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
                                     closePopup={() => setShowRemoveFromAllMovies({isShown: false, filmTitle: null})}/>

            <section className="conf-step">
                <ConfStepHeader title="Сетка сеансов"/>
                <div className="conf-step__wrapper">
                    <MyPopup isVisible={showErrorPopup} title="Неверно введенные данные"
                             onClose={() => setShowErrorPopup(false)}>
                        <p className="conf-step__paragraph">{`${validateError}`}</p>
                    </MyPopup>
                    {!films || Object.keys(films).length === 0 ?
                        <p className="conf-step__paragraph">В базе пока нет ни одного фильма</p> : null
                    }
                    <DragDropContext
                        onDragUpdate={onDragUpdate}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}>
                        <div className="conf-step__paragraph"
                             style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <MyButton type="button" text="Добавить фильм" onclick={() => setShowPopupForAdd(true)}/>

                            <div className={showRemoveFromAllMovies.filmTitle ? "" : "invisible"}>
                                <Droppable droppableId={droppableIdsBase.removeFromAllMovies}>
                                    {(provided) => (
                                        <div className="drop-for-remove"
                                             id={droppableIdsBase.removeFromAllMovies}
                                             ref={provided.innerRef}
                                             style={{
                                                 top: 180,
                                                 right: 100,
                                                 width: 194,
                                                 height: 40
                                             }}
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
                            </div> : films && Object.keys(films).length > 0 ?
                                <>
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
                                    </Droppable>
                                    <div className="conf-step__date">
                                        <label className={`conf-step__label conf-step__label-mediumsize`}
                                               htmlFor="date">Выберите
                                            дату:
                                            <DatePicker className="conf-step__input" selected={chosenDate} locale="ru"
                                                        onChange={onDateSelected} dateFormat="dd MMMM yyyy"
                                                        minDate={new Date()}/>
                                        </label>
                                    </div>
                                </>
                                : null
                        }
                        <div className="conf-step__seances">
                            {films && Object.keys(films).length > 0 && seances ? Object.keys(seances).map((hallId) => (
                                <SeancesHall key={seances[hallId].hallName}
                                             hallName={seances[hallId].hallName}
                                             hallId={hallId}
                                             dropId={getSeancesHallId(hallId)}
                                             filmsInHall={seances[hallId].seances} itemOnDragX={itemOnDragX}
                                             updateIsDropAnimating={bool => isDropAnimating = bool}
                                             showRemoveBtn={sourceDroppableId === getSeancesHallId(hallId)}
                                             sourceDroppableId={sourceDroppableId}
                                />
                            )) : ""}
                        </div>
                    </DragDropContext>
                    <div className="conf-step__buttons text-center">
                        <MyButton type="reset" text="Отмена" onclick={() => dispatch(getSeancesByDate(toISOStringNoMs(chosenDate)))}/>
                        <MyButton type="submit" text="Сохранить" onclick={() => {
                            dispatch(updateSeances({seances, date: chosenDate}));
                            dispatch(getSeancesByDate(toISOStringNoMs(chosenDate)));
                        }}/>
                    </div>
                </div>
            </section>
        </>
    );

}


/*      {films && seances ? Object.keys(seances[chosenDate]).map((id) => (
                                <SeancesHall key={id} hallId={id}
                                             hallName={halls[id].name}
                                             dropId={getSeancesHallId(id)}
                                             filmsInHall={seances[chosenDate][id]} itemOnDragX={itemOnDragX}
                                             updateIsDropAnimating={bool => isDropAnimating = bool}
                                             showRemoveBtn={sourceDroppableId === getSeancesHallId(id)}
                                             sourceDroppableId={sourceDroppableId}
                                />
                            )) : ""}*/