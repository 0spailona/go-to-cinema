export function getDateStringFromDate(date) {
    return `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`;
}

export function getWeekdayNumber(dateISO) {
    const date = new Date(dateISO);
    return date.getDay()
}

export function toISOStringNoMs(date) {
    // console.log("date",date)
    return date.toISOString().replace(/\.\d+/, "");
}

export function getStartTimeStringFromMinutes(startTime) {
//console.log("getStartTimeStringFromMinutes minutes",minutes);
    const date = new Date(startTime)
    const minutes = date.getHours() * 60 + date.getMinutes();
    let hours = Math.floor(minutes / 60);
    hours = hours > 9 ? hours : "0" + hours;
    //console.log("getStartTimeStringFromMinutes hours",hours);
    let min = minutes % 60;
    min = min > 9 ?  min : "0" + min;


    return {hours,min}
}

export function getSeancesObj( seances ) {

    if(seances.length === 0){
        return {}
    }
    const movieIds = [ ...new Set(seances.map(x => x.movieId))];
    const result = {};

    for (let movieId of movieIds) {
        const seancesForMovie = seances.filter(x => x.movieId === movieId);
        const hallIdsForMovie = [ ...new Set(seancesForMovie.map(x => x.hallId))];
        result[movieId] = Object.fromEntries(hallIdsForMovie.map(x => [x, seancesForMovie.filter(y => y.hallId === x)]));
    }
    return result;
}

export function getObjMovies(arr) {
    const obj = {};
    for (let movie of arr) {
        //console.log("getHallsObj hall",hall)
        obj[movie.id] = {...movie, releaseYear: movie.release_year, release_year: undefined};
        //console.log("getObjMovies obj", obj[movie.id]);
    }
    //console.log("getHallsObj obj",obj);
    return obj;
}
