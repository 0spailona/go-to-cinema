export const isValid = (value) => {
    if (isNaN(value)) {
        console.log("Error. Value is invalid");
        // TODO sh ow error?
        return false;
    }
    return true;
};

export const getWidth = (duration) => {
    const seancesHall = document.getElementsByClassName("conf-step__seances-hall")[0];
    const widthOfHall = seancesHall.offsetWidth;
    //console.log("getWidth",widthOfHall);
    const pxForMin = widthOfHall / (24 * 60);
    //console.log("pxForFilm",pxForMin * duration);
    return pxForMin * duration;
};

