import ToSelectHall from "./toSelectHall.jsx";
import Hall from "./hall.jsx";
import ConfStepHeader from "./ConfStepHeader.jsx";
import MyInput from "./myInput.jsx";
import Place from "./place.jsx";
import MyButton from "./myButton.jsx";

export default function ToUpdateHall() {
    const halls = [{name: "Зал 1", checked: true}, {name: "Зал 2", checked: false}];
    const disabled = [{row: 1, place: 1}, {row: 1, place: 2}, {row: 1, place: 3},
        {row: 1, place: 6}, {row: 1, place: 7}, {row: 1, place: 8},
        {row: 2, place: 1}, {row: 2, place: 2}, {row: 2, place: 7}, {row: 2, place: 8},
        {row: 3, place: 1}, {row: 3, place: 8},
        {row: 4, place: 8}, {row: 5, place: 8}, {row: 6, place: 8}, {row: 7, place: 8}, {
            row: 8,
            place: 8
        },]

    const vip = [{row: 4, place: 4}, {row: 4, place: 5},
        {row: 5, place: 3}, {row: 5, place: 4}, {row: 5, place: 5}, {row: 5, place: 6},
        {row: 6, place: 3}, {row: 6, place: 4}, {row: 6, place: 5}, {row: 6, place: 6},
        {row: 7, place: 3}, {row: 7, place: 4}, {row: 7, place: 5}, {row: 7, place: 6},]

    return (
        <section className="conf-step">
            <ConfStepHeader title="Конфигурация залов"/>
            <div className="conf-step__wrapper">
                <ToSelectHall halls={halls}/>
                <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в
                    ряду:</p>
                <div className="conf-step__legend">
                    <MyInput label="Рядов, шт" placeholder="10"/>
                    <span className="multiplier">x</span>
                    <MyInput label="Мест, шт" placeholder="8"/>
                </div>
                <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div className="conf-step__legend">
                    <Place status="standart"/> — обычные кресла
                    <Place status="vip"/> — VIP кресла
                    <Place status="disabled"/> — заблокированные (нет
                    кресла)
                    <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                </div>
                <Hall rowCount={10} placesInRow={8}
                      disabled={disabled}
                      vip={vip}/>
                <div className="conf-step__buttons text-center">
                    <MyButton type="reset" text="Отмена"/>
                    <MyButton type="submit" text="Сохранить"/>
                </div>
            </div>
        </section>
    );
}