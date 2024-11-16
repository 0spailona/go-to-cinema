import ConfStepHeader from "./ConfStepHeader.jsx";
import MyButton from "./myButton.jsx";

export default function ToOpenSales(){
    return (
        <section className="conf-step">
            <ConfStepHeader title="Открыть продажи"/>
            <div className="conf-step__wrapper text-center">
                <p className="conf-step__paragraph">Всё готово, теперь можно:</p>
                <MyButton type="submit" text="Открыть продажу билетов"/>
            </div>
        </section>
    )
}