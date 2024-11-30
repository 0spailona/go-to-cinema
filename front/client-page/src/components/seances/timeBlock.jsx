export default function TimeBlock({time}) {
    return (
        <li className="movie-seances__time-block">
        <a className="movie-seances__time" href="#">{time.hour}:{time.min}</a>
    </li>
    );
}