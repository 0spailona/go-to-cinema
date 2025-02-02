import {useSelector} from "react-redux";

export default function ConfStepHeader({title}) {

    const {canUpdate} = useSelector(state => state.halls);

    const toggleClassName = (e) => {

        if (!canUpdate) {
            return;
        }
        const target = e.target.classList.contains("conf-step__header") ? e.target : e.target.closest(".conf-step__header");

        target.classList.toggle("conf-step__header_closed");
        target.classList.toggle("conf-step__header_opened");
    };

    return (
        <header
            className={`conf-step__header conf-step__header_${!canUpdate && title !== "Закрыть продажи" ? "closed" : "opened"}`}
            onClick={(event) => toggleClassName(event)}>
            <h2 className="conf-step__title">{title}</h2>
        </header>
    );
}