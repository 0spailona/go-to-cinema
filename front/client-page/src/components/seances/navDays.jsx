import {useState} from "react";
import {weekday} from "../../js/info.js";
import {useDispatch, useSelector} from "react-redux";
import {changeChosenDate} from "../../redux/slices/cinema.js";
import { isEqual, toISOStringNoMs} from "../../js/utils.js";

export default function NavDays({onChange}) {
    const maxDays = 6;

    const dispatch = useDispatch();

    const getNextDate = (lastDate) => {
        const nextDay = new Date();
        nextDay.setDate(lastDate.getDate() + 1);
        return nextDay;
    };

    const dates = [];
    const now = new Date();
    dates.push(now);
    let count = 0;
    while (count < maxDays - 1) {
        dates.push(getNextDate(dates[count]));
        count++;
    }

    const {chosenDate} = useSelector(state => state.cinema);

    const [navDays, setNavDays] = useState(dates);

    const updateNavDaysToNext = () => {
        const lastDay = navDays[navDays.length - 1];
        const nextDay = getNextDate(lastDay);
        const newNavDays = [...navDays, nextDay];
        newNavDays.shift();
        setNavDays(newNavDays);
    };


    const updateNavDaysToPrev = () => {
        const day = new Date(navDays[0].getTime());
        day.setDate(day.getDate() - 1);
        const newNavDays = [day, ...navDays];
        newNavDays.pop();
        setNavDays(newNavDays);
    };

    const changeChooseDay = (dayIndex, date) => {
        const string = toISOStringNoMs(date);
        dispatch(changeChosenDate(string));
        onChange(string);
    };

    return (
        <nav className="page-nav">
            {!isEqual(navDays[0],now) ?
                <a className="page-nav__day page-nav__day_prev" href="#" onClick={updateNavDaysToPrev}></a> : null}
            {navDays.map((day, index) => <a key={index}
                                            className={`page-nav__day ${isEqual(day,now) ? "page-nav__day_today" : ""} 
                                            ${isEqual(day, new Date(chosenDate)) ? "page-nav__day_chosen" : ""}`}
                                            href="#" onClick={() => changeChooseDay(index, day)}>
                <span className="page-nav__day-week">{weekday[day.getDay()]}</span><span
                className="page-nav__day-number">{day.getDate()}</span>
            </a>)}
            <a className="page-nav__day page-nav__day_next" href="#" onClick={updateNavDaysToNext}>
            </a>
        </nav>
    );
}
