import {Draggable} from "react-beautiful-dnd";

// eslint-disable-next-line react/prop-types
export default function MovieContent({movie,index}){
    return (
        // eslint-disable-next-line react/prop-types
      //<div className="conf-step__movie" >
          <>    <img className="conf-step__movie-poster" alt="poster" src={movie.poster}/>

              <h3 className="conf-step__movie-title">{movie.title}</h3>

              <p className="conf-step__movie-duration">{movie.time}</p></>

      //</div>

    )
}