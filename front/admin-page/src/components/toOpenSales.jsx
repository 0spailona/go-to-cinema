import ConfStepHeader from "./common/ConfStepHeader.jsx";
import MyButton from "./common/myButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import {closeSails, openSails} from "../js/api.js";
import {setCanUpdate} from "../redux/slices/halls.js";
import {useEffect, useState} from "react";

export default function ToOpenSales() {

    const {canUpdate} = useSelector(state => state.halls);
    const dispatch = useDispatch();
    //const [isOpenSails, setIsOpenSails] = useState(canUpdate);

    console.log("ToOpenSales, canUpdate", canUpdate);

    /*useEffect(() => {
        console.log("useEffect ToOpenSales")
        setIsOpenSails(canUpdate);
    }, [canUpdate]);
*/
    const closeTicketSails = async () => {
        console.log("closeTicketSails");
        const response = await closeSails();

        if (response.status !== "success") {
            //TODO ERROR
        }
        else {
            dispatch(setCanUpdate(true));
        }
    };

    const openTicketSails = async () => {
        const response = await openSails();

        if (response.status !== "success") {
            //TODO ERROR
        }
        else {
            console.log("openTicketSails success");
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