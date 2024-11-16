import ConfStepHeader from "./ConfStepHeader.jsx";
import Movie from "./movie.jsx";
import SeancesHall from "./seancesHall.jsx";
import MyButton from "./myButton.jsx";

export default function ToUpdateTimeTable() {
    const movies = [{title:"Звёздные войны XXIII: Атака клонированных клонов",time:"130 минут",poster:"i/poster.png"},
        {title:"Миссия выполнима",time:"120 минут",poster:"i/poster.png"},
        {title:"Серая пантера",time:"90 минут",poster:"i/poster.png"},
        {title:"Движение вбок",time:"95 минут",poster:"i/poster.png"},
        {title:"Кот Да Винчи",time:"100 минут",poster:"i/poster.png"},]
    return (
        <section className="conf-step">
            <ConfStepHeader title="Сетка сеансов"/>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">
                    <button className="conf-step__button conf-step__button-accent">Добавить фильм</button>
                </p>
                <div className="conf-step__movies">
                    {movies.map((movie, index) => <Movie key={index} movie={movie}/>)}
                </div>

                <div className="conf-step__seances">
                        <SeancesHall hallName="Зал 1"/>
                        <SeancesHall hallName="Зал 2"/>
                </div>

                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>

    )
}
/*<div className="conf-step__movie">
                        <img className="conf-step__movie-poster" alt="poster" src="i/poster.png"/>
                        <h3 className="conf-step__movie-title">Звёздные войны XXIII: Атака клонированных клонов</h3>
                        <p className="conf-step__movie-duration">130 минут</p>
                    </div>

                    <div className="conf-step__movie">
                        <img className="conf-step__movie-poster" alt="poster" src="i/poster.png"/>
                        <h3 className="conf-step__movie-title">Миссия выполнима</h3>
                        <p className="conf-step__movie-duration">120 минут</p>
                    </div>

                    <div className="conf-step__movie">
                        <img className="conf-step__movie-poster" alt="poster" src="i/poster.png"/>
                        <h3 className="conf-step__movie-title">Серая пантера</h3>
                        <p className="conf-step__movie-duration">90 минут</p>
                    </div>

                    <div className="conf-step__movie">
                        <img className="conf-step__movie-poster" alt="poster" src="i/poster.png"/>
                        <h3 className="conf-step__movie-title">Движение вбок</h3>
                        <p className="conf-step__movie-duration">95 минут</p>
                    </div>

                    <div className="conf-step__movie">
                        <img className="conf-step__movie-poster" alt="poster" src="i/poster.png"/>
                        <h3 className="conf-step__movie-title">Кот Да Винчи</h3>
                        <p className="conf-step__movie-duration">100 минут</p>
                    </div>*/