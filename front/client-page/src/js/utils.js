export function getDateStringFromDate(date) {
    return `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`;
}

export function getWeekdayNumber(dateISO) {
    const date = new Date(dateISO);
    return date.getDay()
}