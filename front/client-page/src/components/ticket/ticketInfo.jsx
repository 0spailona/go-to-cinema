export default function TicketInfo({info,data,add}){
    return (
        <p className="ticket__info">{info}:{"\u00A0"}
            <span className="ticket__details ticket__title">{data}</span>{add}
        </p>
    )
}