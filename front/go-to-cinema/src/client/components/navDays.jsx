import {useState} from "react";
import {weekday} from "../info.js";

export default function NavDays() {
    const maxDays = 6;

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

    const [navDays, setNavDays] = useState(dates);
    const [dayChosen, setDayChosen] = useState(0);

    const updateNavDays = () => {
        console.log("update nav");

        const lastDay = navDays[navDays.length - 1];
        const nextDay = getNextDate(lastDay);
        const newNavDays = [...navDays, nextDay];
        newNavDays.shift();
        setNavDays(newNavDays);
    };

    console.log("navDays", navDays);
    return (
        <nav className="page-nav">
            {navDays.map((day, index) => <a key={index}
                                            className={`page-nav__day ${day === now ? "page-nav__day_today" : ""} 
                                            ${index === dayChosen ? "page-nav__day_chosen" : ""}`}
                                            href="#" onClick={() => setDayChosen(index)}>
                <span className="page-nav__day-week">{weekday[day.getDay()]}</span><span
                className="page-nav__day-number">{day.getDate()}</span>
            </a>)}
            <a className="page-nav__day page-nav__day_next" href="#" onClick={updateNavDays}>
            </a>
        </nav>
    );
}
