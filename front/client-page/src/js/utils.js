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
