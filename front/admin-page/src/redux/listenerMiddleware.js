import {createListenerMiddleware} from "@reduxjs/toolkit";
import {addFilmToHall} from "./slices/halls.js";


export const listenerMiddleware = createListenerMiddleware()

/*listenerMiddleware.startListening({
    actionCreator: todoAdded,
    effect: async (action, listenerApi) => {
        // Run whatever additional side-effect-y logic you want here
        console.log('Todo added: ', action.payload.text)

        // Can cancel other running instances
        listenerApi.cancelActiveListeners()

        // Run async logic
        const data = await fetchData()

        // Pause until action dispatched or state changed
        if (await listenerApi.condition(matchSomeAction)) {
            // Use the listener API methods to dispatch, get state,
            // unsubscribe the listener, start child tasks, and more
            listenerApi.dispatch(todoAdded('Buy pet food'))

            // Spawn "child tasks" that can do more work and return results
            const task = listenerApi.fork(async (forkApi) => {
                // Can pause execution
                await forkApi.delay(5)
                // Complete the child by returning a value
                return 42
            })

            const result = await task.result
            // Unwrap the child result in the listener
            if (result.status === 'ok') {
                // Logs the `42` result value that was returned
                console.log('Child succeeded: ', result.value)
            }
        }
    },
})*/