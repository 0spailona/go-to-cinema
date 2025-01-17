import ConfStepHeader from "../common/ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupAddMovie from "./popupAddMovie.jsx";
import PopupRemoveMovie from "./popupRemoveMovie.jsx";
import {fetchMovies, fetchNewMovie, removeMovieFromList,} from "../../redux/slices/movies.js";
import {checkDropInHall, getItemOnDragX, getSeancesObj, pxToMinutes, toISOStringNoMs} from "../../js/utils.js";
import {getSeanceHallWidth} from "../../js/info.js";
import {draggableIdsBase, droppableIdsBase, getSeancesHallId} from "./utilsFunctions.js";
import PopupUpdateDate from "./popupUpdateDate.jsx";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ru} from "date-fns/locale/ru";
import Loader from "react-js-loader";
import PopupRemoveMovieFromSeances from "./popupRemoveMovieFromSeances.jsx";
import MyPopup from "../common/myPopup.jsx";
import {
    addMovieToSeancesHall,
    removeMovieFromSeanceHall, setIsUpdateSeancesFalse,
    setLoadingSeances,
    setSeances,
} from "../../redux/slices/seances.js";

import {getSeancesByDate, updateSeances} from "../../js/api.js";

registerLocale("ru", ru);


let curDraggableId = null;
let curDroppableId = null;
let isDropAnimating = false;
let timerId = null;

let itemOnDragX = null;

export default function ToUpdateTimeTable() {


    const dispatch = useDispatch();

    const {movies, loadingMovies} = useSelector(state => state.movies);

    const {
        seances,
        isUpdatedSeances,
        loadingSeances
    } = useSelector(state => state.seances);
    const {halls} = useSelector(state => state.halls);

    const [showAllMoviesLoader, setShowAllMoviesLoader] = useState(loadingMovies);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [chosenDate, setChosenDate] = useState(today);


    const getSeances = async (date) => {
        dispatch(setLoadingSeances(true));
        //console.log("getSeances date",date);
        const response = await getSeancesByDate(date);
        if (response.status === "success") {
            const seances = getSeancesObj(halls, response.data);
            dispatch(setSeances(seances));
        }
        else {
            //TODO ERROR
        }
        // console.log("getSeances", response);
        dispatch(setIsUpdateSeancesFalse())
        dispatch(setLoadingSeances(false));
    };

    const updateSeancesByDate = async (data) => {
        dispatch(setLoadingSeances(true));
        const response = await updateSeances(data);
        if (response.status !== "success") {
            //TODO ERROR
        }
        dispatch(setLoadingSeances(false));
    };

    useEffect(() => {
        console.log("useEffect [] ]")
        if (halls && Object.keys(halls).length > 0 && !seances) {
            async function getSeancesByDate() {
                await getSeances(toISOStringNoMs(chosenDate));
            }

            getSeancesByDate();
        }
    }, [halls])
   /* useEffect(() => {
        console.log("useEffect by halls")
        if (halls && Object.keys(halls).length > 0) {
            async function getSeancesByDate() {
                await getSeances(toISOStringNoMs(chosenDate));
            }

            getSeancesByDate();
        }
    }, [halls]);*/

    useEffect(() => {
        setShowAllMoviesLoader(loadingMovies);
    }, [loadingMovies, movies]);


    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupUpdateDate, setShowPopupUpdateDate] = useState({isShown: false, date: null});

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [validateError, setValidateError] = useState(null);

    const initialShowRemoveFromSeance = {
        isShown: false,
        hallId: null,
        movieIndex: null,
        movieTitle: null
    };
    const [showRemoveFromSeance, setShowRemoveFromFromSeance] = useState(initialShowRemoveFromSeance);
    const [showRemoveFromAllMovies, setShowRemoveFromAllMovies] = useState({isShown: false, movieTitle: null});

    const [sourceDroppableId, setSourceDroppableId] = useState(null);


    function isCanDrop(hallId, movieId) {
        if (curDroppableId?.includes(droppableIdsBase.seanceHall)) {
            const width = document.getElementById(curDraggableId).getBoundingClientRect().width;
            const hallWidth = getSeanceHallWidth();
            const seancesInHall = seances[hallId].seances;

            //console.log("isCanDrop movies[movieId]", movies[movieId]);

            if (!checkDropInHall(itemOnDragX, width, hallWidth, movies[movieId], seancesInHall, movies)) {
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
    };

    const onDragStart = (result) => {
        curDraggableId = result.draggableId;
        //console.log("onDragStart curDraggableId",curDraggableId);
        curDroppableId = result.source.droppableId;
        setSourceDroppableId(curDroppableId);

        if (curDraggableId.includes(draggableIdsBase.movieInList)) {
            const movieTitle = movies[curDraggableId?.replace(draggableIdsBase.movieInList, "")].title;
            setShowRemoveFromAllMovies({isShown: false, movieTitle});
        }

        timerId = setInterval(onTimer, 50);
    };

    const onDragEnd = (result) => {
        clearInterval(timerId);
        setShowRemoveFromAllMovies({isShown: false, movieTitle: null});
        setSourceDroppableId(null);
        console.log("onDragEnd", result);

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
            if (source.droppableId !== droppableIdsBase.allMovies) {
                return;
            }
            const movieTitle = movies[draggableId?.replace(draggableIdsBase.movieInList, "")].title;
            setShowRemoveFromAllMovies({isShown: true, movieTitle});
        }
        else if (toId.includes(droppableIdsBase.removeFromSeances)) {
            //console.log("removeFromSeances", droppableIdsBase.removeFromSeances);
            if (!source.droppableId.includes(droppableIdsBase.seanceHall)) {
                return;
            }
            const hallId = toId.match(/^remove-movie-from-hall-([0-9a-f]+)$/)[1];
            const movieId = draggableId.match(/^movie-in-[\w-]+-([0-9a-f]+)$/)[1];
            const movieTitle = movies[movieId].title;
            setShowRemoveFromFromSeance({
                isShown: true,
                hallId,
                movieIndex: itemIndex,
                movieTitle
            });
        }
        else {
            const hallId = toId.match(/^seances-hall-([0-9a-f]+)$/)[1];
            const movieId = draggableId.match(/^movie-in-[\w-]+-([0-9a-f]+)$/)[1];

            if (!isCanDrop(hallId, movieId)) {
                return;
            }

            if (fromId === droppableIdsBase.allMovies) {
                dispatch(addMovieToSeancesHall({
                    from: null,
                    to: hallId,
                    movieId,
                    start,
                    movieIndex: itemIndex
                }));
            }
            else {
                const fromHallId = fromId.match(/^seances-hall-([0-9a-f]+)$/)[1];

                dispatch(addMovieToSeancesHall({
                    from: fromHallId,
                    to: hallId,
                    movieId,
                    start,
                    movieIndex: itemIndex
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
        setShowRemoveFromAllMovies({isShown: false, movieTitle: null});
    };

    const onSubmitRemoveFromList = (e) => {
        e.preventDefault();
        dispatch(removeMovieFromList(curDraggableId?.replace(draggableIdsBase.movieInList, "")));
        dispatch(fetchMovies());
        setShowRemoveFromAllMovies({isShown: false, movieTitle: null});
    };

    const onResetRemoveFromSeance = (e) => {
        e.preventDefault();
        setShowRemoveFromFromSeance(initialShowRemoveFromSeance);
    };

    const onSubmitRemoveFromSeance = (e) => {
        e.preventDefault();
        dispatch(removeMovieFromSeanceHall({
            movieIndex: showRemoveFromSeance.movieIndex,
            hallId: showRemoveFromSeance.hallId
        }));
        setShowRemoveFromFromSeance(initialShowRemoveFromSeance);
    };

    const onDateSelected = async (newDate) => {
        newDate.setHours(0, 0, 0, 0);

        if (chosenDate && chosenDate !== newDate && isUpdatedSeances) {
            setShowPopupUpdateDate({isShown: true, date: newDate});
        }
        else {
            const date = toISOStringNoMs(newDate);
            await getSeances(date);
            setChosenDate(newDate);
        }
    };

    const onResetUpdateDate = async (e) => {
        e.preventDefault();
        // console.log("showPopupUpdateDate.date",showPopupUpdateDate.date)
        const date = toISOStringNoMs(showPopupUpdateDate.date);
        await getSeances(date);
        setChosenDate(showPopupUpdateDate.date);
        setShowPopupUpdateDate({isShown: false, date: null});
    };

    const onSubmitUpdateDate = async (e) => {
        e.preventDefault();
        await updateSeancesByDate({seances, date: chosenDate});
        const date = toISOStringNoMs(showPopupUpdateDate.date);
        await getSeances(date);
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
    console.log("toUpdateTime seances", seances);
    console.log("toUpdateTime halls", halls)
    return (<>
            <PopupRemoveMovieFromSeances showPopup={showRemoveFromSeance.isShown}
                                         title={showRemoveFromSeance.movieTitle}
                                         onSubmit={onSubmitRemoveFromSeance}
                                         onReset={onResetRemoveFromSeance}
                                         closePopup={() => setShowRemoveFromFromSeance(initialShowRemoveFromSeance)}/>
            <PopupUpdateDate showPopup={showPopupUpdateDate.isShown}
                             closePopup={() => setShowPopupUpdateDate({isShown: false, date: null})}
                             lastChosenDate={chosenDate}
                             onSubmit={onSubmitUpdateDate}
                             onReset={onResetUpdateDate}/>
            <PopupAddMovie showPopup={showPopupForAdd}
                           closePopup={() => setShowPopupForAdd(false)}
                           onReset={onResetAddToList}
                           onSubmit={onSubmitAddToList}
                           onError={onValidateError}/>
            <PopupRemoveMovie showPopup={showRemoveFromAllMovies.isShown}
                              onReset={onResetRemoveFromList}
                              onSubmit={onSubmitRemoveFromList}
                              title={showRemoveFromAllMovies.movieTitle}
                              closePopup={() => setShowRemoveFromAllMovies({isShown: false, movieTitle: null})}/>

            <section className="conf-step">
                <ConfStepHeader title="Сетка сеансов"/>
                <div className="conf-step__wrapper">
                    <MyPopup isVisible={showErrorPopup} title="Неверно введенные данные"
                             onClose={() => setShowErrorPopup(false)}>
                        <p className="conf-step__paragraph">{`${validateError}`}</p>
                    </MyPopup>
                    {!movies || Object.keys(movies).length === 0 ?
                        <p className="conf-step__paragraph">В базе пока нет ни одного фильма</p> : null
                    }
                    <DragDropContext
                        onDragUpdate={onDragUpdate}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}>
                        <div className="conf-step__paragraph"
                             style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <MyButton type="button" text="Добавить фильм" onclick={() => setShowPopupForAdd(true)}/>

                            <div className={showRemoveFromAllMovies.movieTitle ? "" : "invisible"}>
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
                        {loadingMovies ?
                            <div className={`loader ${showAllMoviesLoader ? "" : "d-none"}`}>
                                <Loader type="bubble-scale" bgColor="#63536C" color="#FFFFFF"
                                        size={50}/>
                            </div> : movies && Object.keys(movies).length > 0 ?
                                <>
                                    <Droppable droppableId={droppableIdsBase.allMovies} direction="horizontal">
                                        {provided => (
                                            <div className="conf-step__movies" id={droppableIdsBase.allMovies}
                                                 ref={provided.innerRef}
                                                 {...provided.droppableProps}>
                                                {Object.keys(movies).map((id, index) =>
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
                        {loadingSeances ? <div className="loader">
                                <Loader type="bubble-scale" bgColor="#63536C" color="#FFFFFF"
                                        size={50}/>
                            </div> :
                            <div className="conf-step__seances">
                                {movies && Object.keys(movies).length > 0 && halls && seances ? Object.keys(halls).map((hallId) => (
                                    <SeancesHall key={hallId}
                                                 hallName={halls[hallId].name}
                                                 hallId={hallId}
                                                 dropId={getSeancesHallId(hallId)}
                                                 seancesInHall={seances[hallId]?seances[hallId].seances : []}
                                                 itemOnDragX={itemOnDragX}
                                                 updateIsDropAnimating={bool => isDropAnimating = bool}
                                                 showRemoveBtn={sourceDroppableId === getSeancesHallId(hallId)}
                                                 sourceDroppableId={sourceDroppableId}
                                    />
                                )) : ""}
                            </div>
                        }

                    </DragDropContext>
                    <div className="conf-step__buttons text-center">
                        <MyButton type="reset" text="Отмена"
                                  onclick={() => dispatch(getSeancesByDate(toISOStringNoMs(chosenDate)))}/>
                        <MyButton type="submit" text="Сохранить" onclick={async () => {
                            await updateSeancesByDate({seances, date: chosenDate});
                            await getSeances(toISOStringNoMs(chosenDate));
                        }}/>
                    </div>
                </div>
            </section>
        </>
    );

}
