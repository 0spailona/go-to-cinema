export function getDateStringFromDate(date) {
    return `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`;
}


export function toISOStringNoMs(date) {
    return date.toISOString().replace(/\.\d+/, "");
}

export function getStartTimeStringFromMinutes(startTime) {

    const date = new Date(startTime);
    const minutes = date.getHours() * 60 + date.getMinutes();
    let hours = Math.floor(minutes / 60);
    hours = hours > 9 ? hours : "0" + hours;
    let min = minutes % 60;
    min = min > 9 ? min : "0" + min;

    return {hours, min};
}

export function  isEqual  (a, b)  {
    return getDateStringFromDate(a) === getDateStringFromDate(b);
}

export function checkSeances(seancesByMovie){
    const nowTime = new Date().getTime();

    let seances = {...seancesByMovie};

    for (let movieSeances of Object.entries(seances)) {
        const movieId = movieSeances[0]
        for(let hallSeances of Object.entries(movieSeances[1])){
            const hallId = hallSeances[0]
            if(hallSeances[1].length > 0){
             hallSeances[1] = hallSeances[1].filter(seance => new Date(seance.startTime).getTime() > nowTime)
            }
            if(hallSeances[1].length === 0){
                delete movieSeances[1][hallId];
            }
        }

        if(Object.keys(movieSeances[1]).length === 0){
            delete seances[movieId];
        }
    }
    return seances
}
