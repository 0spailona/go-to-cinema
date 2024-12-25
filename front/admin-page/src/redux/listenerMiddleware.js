import {createListenerMiddleware} from "@reduxjs/toolkit";


export const listenerMiddleware = createListenerMiddleware();

/*listenerMiddleware.startListening({
    actionCreator: changeChairsUpdateHall,
    effect: async (action, listenerApi) => {
        // Run whatever additional side-effect-y logic you want here
        console.log("listenerMiddleware changeChairsUpdateHall", action);

        // Can cancel other running instances
        //listenerApi.cancelActiveListeners()

        // Run async logic
        const data = await fetchHallByName(action.payload);
        //const data = await fetchHallByName("action.payload")
        console.log("listenerMiddleware data", data);
        if (data.status === "ok") {
            console.log("listenerMiddleware data ok", data);
            listenerApi.dispatch(changeChairsUpdateHall(data.data));
        }
        else {
            console.log("listenerMiddleware data error", data);
        }

    },
});*/