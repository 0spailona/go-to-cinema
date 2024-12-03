import {createFilm, createHall} from "../../../admin-page/src/js/modelUtils.js";


export const startHalls = [createHall( "Зал 1", "standard"),
    createHall( "Зал 2", "standard")]


const hall1 = createHall( "Зал 1", "standard");
const hall2 = createHall( "Зал 2", "standard");


 export const startFilms = [createFilm("Звёздные войны XXIII: Атака клонированных клонов",
    130,
    "description", "country", null,
    createSeancesForDays([1,3,4])),
    createFilm("Миссия выполнима", 120, "description", "country", null,
        createSeancesForDays([1,2,5])),
    createFilm("Серая пантера", 90, "description", "country", null,
        createSeancesForDays([3,4,6])),
    createFilm("Движение вбок", 95, "description", "country", null,
        createSeancesForDays([2,3,4])),
    createFilm("Кот Да Винчи", 100, "description", "country", null,
        createSeancesForDays([1,3,6])),];


 function createSeancesForDays(days){
     const seances = {};

     for (let day of days){
         seances[day] = {"hall-1": [{hours: "00", min: "00"}, {hours: "00", min: "00"}],
             "hall-2": [{hours: "00", min: "00"}]}
     }
     return seances;
 }