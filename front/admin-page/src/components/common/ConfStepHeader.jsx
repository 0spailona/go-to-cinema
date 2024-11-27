// eslint-disable-next-line react/prop-types
export default function ConfStepHeader({title}) {

    const toggleClassName = (e) => {
        const target = e.target.classList.contains("conf-step__header") ? e.target : e.target.closest(".conf-step__header")

        target.classList.toggle("conf-step__header_closed");
        target.classList.toggle("conf-step__header_opened");
    };

    return (
        <header className="conf-step__header conf-step__header_opened" onClick={(event) => toggleClassName(event)}>
            <h2 className="conf-step__title">{title}</h2>
        </header>
    );
}