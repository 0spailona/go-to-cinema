const initialData = {
    movies: {
        "m-1": {
            title: "Звёздные войны XXIII: Атака клонированных клонов",
            time: "130 минут",
            poster: "i/poster.png"
        },
        "m-2": {title: "Миссия выполнима", time: "120 минут", poster: "i/poster.png"},
        "m-3": {title: "Серая пантера", time: "90 минут", poster: "i/poster.png"},
        "m-4": {title: "Движение вбок", time: "95 минут", poster: "i/poster.png"},
        "m-5": {title: "Кот Да Винчи", time: "100 минут", poster: "i/poster.png"}
    },

    halls: {
        "h-1":{name:"Зал 1", movies: []},
        "h-2":{name:"Зал 2", movies: []},
    },

    hallsOrder:["h-1","h-2"],
    moviesOrder:["m-1","m-2","m-3","m-4","m-5"]
};

export default initialData;