import ConfStepHeader from "../common/ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "../common/myButton.jsx";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PopupAddFilm from "./popupAddFilm.jsx";
import PopupRemoveFilm from "./popupRemoveFilm.jsx";

///https://codesandbox.io/p/sandbox/funny-buck-kkpnnkkzov?file=%2Fsrc%2Fcontainers%2FKanbanLists.js


let curDraggableId = null;
let curDroppableId = null;
let isDropAnimating = false;
let timerId = null;

let itemOnDragX = null;

export default function ToUpdateTimeTable() {

    const dispatch = useDispatch();

    /*let allMoviesContainerHeight;

    useEffect(() => {
        allMoviesContainerHeight = document.getElementById("allMovies").getBoundingClientRect().height;
    },[])*/

    const {
        films,
    } = useSelector(state => state.films);

    const {halls} = useSelector(state => state.halls);

    const [showPopupForAdd, setShowPopupForAdd] = useState(false);
    const [showPopupForRemove, setShowPopupForRemove] = useState(false);
    const [filmForRemove, setFilmForRemove] = useState(null);

    const [showRemoveFromAllMovies, setShowRemoveFromAllMovies] = useState(false);
    const [showDeleteItemFormOtherList, setShowDeleteItemFormOtherList] = useState(false);

    const [isDragOverHall, setIsDragOverHall] = useState(false);
    const [isDragOverRemove, setIsDragOverRemove] = useState(false);

    const getListStyle = (isDraggingOver, id) => {
//console.log("allMoviesContainerHeight",allMoviesContainerHeight);
        const style = {}
        if (isDraggingOver) {
            setTimeout(() => setIsDragOverHall(id.includes("seances-hall")), 1);
            setTimeout(() => setIsDragOverRemove(id.includes("remove-movie-from")), 1);
            if(id.includes("remove-movie-from")) {
                style.width = "200px";
            }
        }

        return style;
    };


    function isCanDrop() {
        return true;
    }

    function onTimer() {
        if (isDropAnimating) {
            return;
        }
        const draggableElem = document.getElementById(curDraggableId);
        const droppableElem = document.getElementById(curDroppableId);
        if (!draggableElem || !droppableElem) {
            return;
        }
        itemOnDragX = draggableElem.getBoundingClientRect().x - droppableElem.getBoundingClientRect().x;
        //console.log(itemOnDragX);
    }


    const onDragUpdate = (result) => {
        //console.log("onDragUpdate", result);
        curDroppableId = result.destination?.droppableId;
        //console.log(curDroppableId);

        if (!result.destination) {
            setTimeout(() => setIsDragOverHall(false), 1);
            //isDragOverHall = false;
        }
        if (result.source.droppableId === "allMovies") {
            setTimeout(() => setShowRemoveFromAllMovies(true), 1)
            ;
        }
        else {
            setShowDeleteItemFormOtherList(true);
        }

    };

    const onDragStart = (result) => {
        //console.log("onDragStart", result);
        curDraggableId = result.draggableId;
        curDroppableId = result.source.droppableId;

        timerId = setInterval(onTimer, 50);
        //console.log(timerId);

    };

    const onDragEnd = (result) => {

        //console.log("onDragEnd", timerId, result);
        clearInterval(timerId);
        setShowRemoveFromAllMovies(false);
        setShowDeleteItemFormOtherList(false);

        if (!isCanDrop()) {
            return;
        }
        const {source, destination, draggableId} = result;
        if (!destination || destination.droppableId === "allMovies") {
            return;
        }
        const fromId = source.droppableId;
        const itemIndex = source.index;
        const toId = destination.droppableId;
        //const copyOtherLists = {...otherLists};

        const offset = itemOnDragX;


         switch (toId) {
             case "remove-movie-from-list":
                 setShowPopupForRemove(true)
                // const newList1 = [...list1];
                // newList1.splice(itemIndex, 1);
                 //setList1(newList1);
                 break;
             case "deleteFromOtherLists":

                 //copyOtherLists[fromId].splice(itemIndex, 1);
                 //setOtherLists(copyOtherLists);
                 break;
             default:
                 let item;
                 if (fromId === "drop-1") {
                     //item = {color: list1[itemIndex], offset};
                 }
                 else {
                     //item = otherLists[fromId][itemIndex];
                     //item.offset = offset;
                     //copyOtherLists[fromId].splice(itemIndex, 1);
                 }
                 //copyOtherLists[toId].push(item);
                 //setOtherLists(copyOtherLists);
         }

    };

    console.log("showPopupForRemove",showPopupForRemove)
    return (<>
            <PopupAddFilm showPopup={showPopupForAdd} closePopup={() => setShowPopupForAdd(false)}/>
            <PopupRemoveFilm showPopup={showPopupForRemove} closePopup={() => setShowPopupForRemove(false)}/>

            <section className="conf-step">
                <ConfStepHeader title="Сетка сеансов"/>
                <div className="conf-step__wrapper">
                    <DragDropContext
                        onDragUpdate={onDragUpdate}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}>
                        <div className="conf-step__paragraph" style={{display: "flex", justifyContent: "space-between",alignItems: "center"}}>
                            <MyButton type="button" text="Добавить фильм" onclick={() => setShowPopupForAdd(true)}/>
                            <div className={`${showRemoveFromAllMovies ? "visible" : "invisible"}`}>
                                <Droppable droppableId="remove-movie-from-list">
                                    {(provided, snapshot) => (
                                        <div className="drop-for-remove"
                                             id="remove-movie-from-list"
                                             ref={provided.innerRef}
                                             style={getListStyle(snapshot.isDraggingOver, "remove-movie-from-list")}
                                             {...provided.droppableProps} >
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>

                        <Droppable droppableId="allMovies" direction="horizontal">
                            {(provided, snapshot) => (
                                <div className="conf-step__movies" id="allMovies"
                                     ref={provided.innerRef}
                                     style={getListStyle(snapshot.isDraggingOver, "allMovies")}
                                     {...provided.droppableProps}>
                                    {Object.keys(films).map((id, index) => <Movie key={id} movieId={id} index={index}
                                                                                  itemOnDragX={itemOnDragX}
                                                                                  isDragOverHall={isDragOverHall}
                                                                                  isDragOverRemove={isDragOverRemove}
                                                                                  updateIsDropAnimating={bool => isDropAnimating = bool}/>)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        <div className="conf-step__seances">
                            {Object.keys(halls).map((id) => (
                                <SeancesHall key={id} hallId={id} itemOnDragX={itemOnDragX}
                                             updateIsDropAnimating={bool => isDropAnimating = bool}
                                             updateIsDragoverLists={bool => setIsDragOverHall(bool)}/>
                            ))}
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

/* <div className={`${showDeleteList1 ? "visible" : "invisible"}`}>
                            <Droppable droppableId="deleteFromList1">
                                {(provided, snapshot) => (
                                    <div className="deleteFromList1"
                                         ref={provided.innerRef}
                                         {...provided.droppableProps} >
                                        delete from list
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>*/

//https://codesandbox.io/p/sandbox/github/cmcrawford2/palette-assistant/tree/main/?file=%2Fsrc%2FApp.js