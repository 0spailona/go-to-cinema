// eslint-disable-next-line react/prop-types
export default function ConfStepHeader({title}) {
    return (
        <header className="conf-step__header conf-step__header_opened">
            <h2 className="conf-step__title">{title}</h2>
        </header>
    )
}