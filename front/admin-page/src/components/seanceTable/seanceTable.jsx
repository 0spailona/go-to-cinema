import ConfStepHeader from "../common/ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupAddMovie from "./popupAddMovie.jsx";
import PopupRemoveMovie from "./popupRemoveMovie.jsx";
import {setLoadingMovies, setMovies,} from "../../redux/slices/movies.js";
import {
    checkDropInHall,
    getItemOnDragX,
    getSeancesObj,
    getViewTime,
    pxToMinutes,
    toISOStringNoMs
} from "../../js/utils.js";
import {getSeanceHallWidth} from "../../js/info.js";
import {draggableIdsBase, droppableIdsBase, getSeancesHallId} from "./utilsFunctions.js";
import PopupUpdateDate from "./popupUpdateDate.jsx";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ru} from "date-fns/locale/ru";
import Loader from "react-js-loader";
import PopupRemoveSeances from "./popupRemoveSeances.jsx";
import MyPopup from "../common/myPopup.jsx";
import {
    addMovieToSeancesHall,
    removeMovieFromSeanceHall,
    setIsUpdateSeancesFalse,
    setLoadingSeances,
    setSeances,
} from "../../redux/slices/seances.js";

import {createMovie, getMovies, getSeancesByDate, removeMovieFromList, updateSeances} from "../../js/api.js";
import PopupError from "../common/popupError.jsx";
import {setError} from "../../redux/slices/common.js";

registerLocale("ru", ru);


let curDraggableId = null;
let curDroppableId = null;
let isDropAnimating = false;
let timerId = null;

let itemOnDragX = null;

export default function SeanceTable() {


    const dispatch = useDispatch();

    const {movies, loadingMovies} = useSelector(state => state.movies);

    const {
        seances,
        isUpdatedSeances,
        loadingSeances
    } = useSelector(state => state.seances);
    const {halls} = useSelector(state => state.halls);

    //console.log("seances", seances);


    const [showAllMoviesLoader, setShowAllMoviesLoader] = useState(loadingMovies);
    const [errorView, setErrorView] = useState({isError: false, message: ""});

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [chosenDate, setChosenDate] = useState(today);


    const getSeances = async (date) => {
        dispatch(setLoadingSeances(true));

        const response = await getSeancesByDate(date);
        if (response.status === "success") {
            const seances = getSeancesObj(halls, response.data);
            dispatch(setSeances(seances));
            dispatch(setIsUpdateSeancesFalse());
            dispatch(setLoadingSeances(false));
            return true;
        }
        else {
            dispatch(setIsUpdateSeancesFalse());
            dispatch(setLoadingSeances(false));
            return false;
        }
    };

    const updateSeancesByDate = async (data) => {
        dispatch(setLoadingSeances(true));
        const response = await updateSeances(data);
        if (response.status !== "success") {
            dispatch(setError("Что-то пошло не так. Сеансы не были обновлены"));
        }
        dispatch(setLoadingSeances(false));
    };

    useEffect(() => {

        if (halls && Object.keys(halls).length > 0) {

            async function getSeancesByDate() {
                if (!await getSeances(toISOStringNoMs(chosenDate))) {
                    setErrorView({isError: true, message: "Что-то пошло не так. Попробуйте позже."});
                }
            }

            getSeancesByDate();
        }

    }, [halls, movies]);

    useEffect(() => {
        setShowAllMoviesLoader(loadingMovies);
    }, [loadingMovies, movies]);


    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupUpdateDate, setShowPopupUpdateDate] = useState({isShown: false, date: null});

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [validateError, setValidateError] = useState(null);

    const initialShowRemoveSeance = {
        isShown: false,
        hallId: null,
        movieIndex: null,
        movieTitle: null
    };
    const [showRemoveSeance, setShowRemoveSeance] = useState(initialShowRemoveSeance);
    const [showRemoveMovie, setShowRemoveMovie] = useState({isShown: false, movieTitle: null});

    const [sourceDroppableId, setSourceDroppableId] = useState(null);

    function isCanDrop(hallId, movieId, seanceId) {

        if (curDroppableId?.includes(droppableIdsBase.seanceHall)) {
            const width = document.getElementById(curDraggableId).getBoundingClientRect().width;
            const hallWidth = getSeanceHallWidth();
            const seancesInHall = seances[hallId].seances;

            if (!checkDropInHall(itemOnDragX, width, hallWidth, movies[movieId], seancesInHall, movies, seanceId)) {

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

    const setInitialDnDState = () => {
        curDraggableId = null;
        curDroppableId = null;
        isDropAnimating = false;
        timerId = null;
        itemOnDragX = null;
    };

    const onDragUpdate = (result) => {
        curDroppableId = result.destination?.droppableId;
    };

    const onDragStart = (result) => {
        curDraggableId = result.draggableId;
        curDroppableId = result.source.droppableId;
        setSourceDroppableId(curDroppableId);

        if (curDraggableId.includes(draggableIdsBase.movieInList)) {
            const movieTitle = movies[curDraggableId?.replace(draggableIdsBase.movieInList, "")].title;
            setShowRemoveMovie({isShown: false, movieTitle});
        }

        timerId = setInterval(onTimer, 50);
    };

    const onDragEnd = (result) => {
        clearInterval(timerId);
        setShowRemoveMovie({isShown: false, movieTitle: null});
        setSourceDroppableId(null);

        const {source, destination, draggableId} = result;
        if (!destination || destination.droppableId === droppableIdsBase.allMovies) {
            return;
        }

       // console.log("onDragEnd result", result);
        //console.log("itemOnDragX",itemOnDragX);

        const fromId = source.droppableId;
        const itemIndex = source.index;
        const toId = destination.droppableId;

        const start = pxToMinutes(itemOnDragX);
        //console.log("onDragEnd start",getViewTime(start))
        //console.log("onDragEnd draggableId",draggableId);

        if (toId === droppableIdsBase.removeFromAllMovies) {
            if (source.droppableId !== droppableIdsBase.allMovies) {
                return;
            }
            const movieTitle = movies[draggableId?.replace(draggableIdsBase.movieInList, "")].title;
            setShowRemoveMovie({isShown: true, movieTitle});
        }
        else if (toId.includes(droppableIdsBase.removeFromSeances)) {

            if (!source.droppableId.includes(droppableIdsBase.seanceHall)) {
                return;
            }
            const hallId = toId.match(/^remove-movie-from-hall-([0-9a-f]+)$/)[1];
            const movieId = draggableId.match(/^movie-in-[\w-]+-([0-9a-f]+)$/)[1];
            const movieTitle = movies[movieId].title;
            setShowRemoveSeance({
                isShown: true,
                hallId,
                movieIndex: itemIndex,
                movieTitle
            });
        }
        else {
            const hallId = toId.match(/^seances-hall-([0-9a-f]+)$/)[1];
            //console.log("draggableId",draggableId)
            const movieId = draggableId.match(/^movie-in-[\w-]+-([0-9a-f]+)$/)[1];

            if (fromId === droppableIdsBase.allMovies) {
                if (!isCanDrop(hallId, movieId, null)) {
                    return;
                }

                dispatch(addMovieToSeancesHall({
                    from: null,
                    to: hallId,
                    movieId,
                    start,
                    //movieIndex: itemIndex
                }));
            }
            else {
                const fromHallId = fromId.match(/^seances-hall-([0-9a-f]+)$/)[1];
               // console.log("draggableId",draggableId)
               // console.log("match",draggableId.match(/^movie-in-seance-hall-([0-9a-z]+)-([0-9a-f]+)-([0-9a-f]+)$/))
                const seanceId = draggableId.match(/^movie-in-seance-hall-([0-9a-z]+)-([0-9a-f]+)-([0-9a-f]+)$/)[1];

                if (!isCanDrop(hallId, movieId, seanceId)) {
                    return;
                }

                //console.log("seances by hall from",seances[fromHallId])

                dispatch(addMovieToSeancesHall({
                    from: fromHallId,
                    to: hallId,
                    movieId,
                    start,
                    seanceId
                    //movieIndex: itemIndex
                }));
            }
            setInitialDnDState();
        }
    };

    const getMoviesFromServer = async () => {
        dispatch(setLoadingMovies(true));
        const response = await getMovies();
        if (response.status === "success") {
            dispatch(setMovies(response.data));
        }
        else {
            dispatch(setError("Что-то пошло не так. Попробуйте позже"));
        }
        dispatch(setLoadingMovies(false));
    };

    const onResetRemoveFromList = (e) => {
        e.preventDefault();
        setShowRemoveMovie({isShown: false, movieTitle: null});
        setInitialDnDState();
    };

    const onSubmitRemoveFromList = async (e) => {
        e.preventDefault();
        dispatch(setLoadingMovies(true));

        const response = await removeMovieFromList(curDraggableId?.replace(draggableIdsBase.movieInList, ""));

        if (response.status !== "success") {
            dispatch(setError("Что-то пошло не так. Попробуйте позже"));
        }

        dispatch(setLoadingMovies(false));

        await getMoviesFromServer();

        setShowRemoveMovie({isShown: false, movieTitle: null});
        setInitialDnDState();
    };

    const onResetRemoveFromSeance = (e) => {
        e.preventDefault();
        setShowRemoveSeance(initialShowRemoveSeance);
        setInitialDnDState();
    };

    const onSubmitRemoveFromSeance = (e) => {
        e.preventDefault();
        dispatch(removeMovieFromSeanceHall({
            movieIndex: showRemoveSeance.movieIndex,
            hallId: showRemoveSeance.hallId
        }));
        setShowRemoveSeance(initialShowRemoveSeance);
        setInitialDnDState();
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

    const onResetAddToList = () => {
        setShowErrorPopup(false);
        setValidateError(null);
        setShowPopupForAdd(false);
    };

    const onSubmitAddToList = async (data) => {
        dispatch(setLoadingMovies(true));

        const response = await createMovie(data);

        if (response.status !== "success") {
            dispatch(setError(response.message));
        }

        dispatch(setLoadingMovies(false));

        setShowErrorPopup(false);
        setValidateError(null);
        setShowPopupForAdd(false);
        await getMoviesFromServer();
    };

    const onValidateError = (msg) => {
        setValidateError(msg);
        setShowErrorPopup(true);
    };

    return (<>
            <PopupError showPopup={errorView.isError} text={errorView.message}
                        onClose={() => setErrorView({isError: false, message: ""})}/>
            <PopupRemoveSeances showPopup={showRemoveSeance.isShown}
                                title={showRemoveSeance.movieTitle}
                                onSubmit={onSubmitRemoveFromSeance}
                                onReset={onResetRemoveFromSeance}
                                closePopup={() => setShowRemoveSeance(initialShowRemoveSeance)}/>
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
            <PopupRemoveMovie showPopup={showRemoveMovie.isShown}
                              onReset={onResetRemoveFromList}
                              onSubmit={onSubmitRemoveFromList}
                              title={showRemoveMovie.movieTitle}
                              closePopup={() => setShowRemoveMovie({isShown: false, movieTitle: null})}/>

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

                            <div className={showRemoveMovie.movieTitle ? "" : "invisible"}>
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
                                                 seancesInHall={seances[hallId] ? seances[hallId].seances : []}
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
