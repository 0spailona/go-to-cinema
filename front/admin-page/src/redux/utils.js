import {v4} from "uuid";

export function createSeance(movieId,hallId ,startTime) {

    const id = `tmp${v4().replaceAll("-", "")}`;
    return {
        id, movieId, hallId, startTime
    };
}






