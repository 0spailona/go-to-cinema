export function createSeance(movieId, startTime, index) {
    const id = `seance-${index}`;
    return {
        id, movieId, startTime
    };
}






