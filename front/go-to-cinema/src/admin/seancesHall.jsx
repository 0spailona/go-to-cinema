// eslint-disable-next-line react/prop-types
export default function SeancesHall({hallName}) {
    return (
        <div className="conf-step__seances-hall">
            <h3 className="conf-step__seances-title">{hallName}</h3>
            <div className="conf-step__seances-timeline">
            </div>
        </div>
    )
}