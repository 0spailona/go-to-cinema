import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import {closeSails, openSails} from "../js/api.js";
import {setCanUpdate} from "../redux/slices/halls.js";
import {setError} from "../redux/slices/common.js";


export default function SailsControl() {

    const {canUpdate} = useSelector(state => state.halls);
    const dispatch = useDispatch();

    const closeTicketSails = async () => {

        const response = await closeSails();

        if (response.status !== "success") {
            dispatch(setError("Что-то пошло не так. Попробуйте позже"));
        }
        else {
            dispatch(setCanUpdate(true));
        }
    };

    const openTicketSails = async () => {
        const response = await openSails();

        if (response.status !== "success") {
            dispatch(setError("Что-то пошло не так. Попробуйте позже"));
        }
        else {
            dispatch(setCanUpdate(false));
        }
    };

    return (
        <section className="conf-step">
            <ConfStepHeader title={`${canUpdate ? "Открыть" : "Закрыть"} продажи`}/>
            <div className="conf-step__wrapper text-center">
                {canUpdate ? <><p className="conf-step__paragraph">Всё готово, теперь можно:</p>
                        <MyButton type="submit" text="Открыть продажу билетов" onclick={openTicketSails}/></>
                    :
                    <MyButton type="submit" text="Закрыть продажу билетов" onclick={closeTicketSails}/>
                }

            </div>
        </section>
    );
}