export const placesType = {standard: "standard", vip: "vip", disabled: "disabled"};

export const backgroundColorForMovie = ["#caff85", "#85ff89",
    "#85ffd3", "#85e2ff", "#8599ff", "#ba85ff", "#ff85fb", "#ff85b1", "#ffa285",];

export function getSeanceHallWidth() {
    const el = document.getElementsByClassName("conf-step__seances-timeline")[0]
    return el ? el.getBoundingClientRect().width : 720;
}