
export const droppableIdsBase = {allMovies:"allMovies",removeFromAllMovies:"remove-movie-from-list",
removeFromSeances:"remove-movie-from-hall-",seanceHall:"seances-hall-"}

export const draggableIdsBase = {movieInList:"movie-in-list-", movieInSeance:"movie-in-seance-hall-"}

export function getSeancesHallId(id) {
    return `${droppableIdsBase.seanceHall}${id}`
}

export const months=['января', 'февраля', 'марта',
    'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября',
    'октября', 'ноября', 'декабря']