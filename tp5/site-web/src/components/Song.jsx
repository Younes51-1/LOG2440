import React, { useState, useContext } from "react";
import { ACTIONS } from "../reducers/reducer";

import PlaylistContext from "../contexts/PlaylistContext";

export default function Song({ song, index }) {
  const { dispatch } = useContext(PlaylistContext);
  const [liked, setLiked] = useState(song.liked);
  // TODO : envoyer une demande de modification au serveur et mettre l'interface à jour.
  const api = useContext(PlaylistContext).api;
  const toggleLike = () => {
    api.updateSong(song.id).then(() => {
      setLiked(!liked);
    });
  };

  // TODO : envoyer une action PLAY avec le bon index au reducer.
  const playSong = () => {
    dispatch({ type: ACTIONS.PLAY, payload: { index: index - 1 } });
  };
  return (
    <section
      className="song-item flex-row"
      onClick={() => {
        {
          /*TODO : joueur une chanson seulement si index existe */
        }
        if(index) {playSong();}
      }}
    >
      {index ? <span>{index}</span> : <></>}
      {/*TODO : ajouter les bonnes informations de la chanson */}
      <p>{song.name}</p>
      <p>{song.genre}</p>
      <p>{song.artist}</p>

      {/*TODO : modifier le statut aimé seulement si index n'existe pas */}
      <button
        className={`${liked ? "fa" : "fa-regular"} fa-2x fa-heart`}
        onClick={index ? undefined : toggleLike}
      ></button>
    </section>
  );
}
