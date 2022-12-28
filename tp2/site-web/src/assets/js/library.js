import StorageManager from "./storageManager.js";

class Library {
  constructor (storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * TODO
   * Génère le code HTML pour l'affichage des playlists et chansons disponibles
   * @param {Object[]} playlists liste de playlists à afficher
   * @param {Object[]} songs liste de chansons à afficher
   */
  generateLists (playlists, songs) {
    const playlistContainer = document.getElementById("playlist-container");
    // TODO : générer le HTML pour les playlists
    playlists.forEach((elem) =>
      playlistContainer.appendChild(this.buildPlaylistItem(elem))
    );
    // TODO : générer le HTML pour les chansons
    const songContainer = document.getElementById("song-container");
    songs.forEach((elem) =>
      songContainer.appendChild(this.buildSongItem(elem))
    );
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une playlist
   * @param {Object} playlist playlist à utiliser pour la génération du HTML
   * @returns {HTMLAnchorElement} élément <a> qui contient le HTML de l'affichage pour une playlist
   */
  buildPlaylistItem (playlist) {
    const playlistItem = document.createElement("a");
    const playlistPreview = document.createElement("div");
    const playlistImg = document.createElement("img");
    const playIcon = document.createElement("i");
    const playlistTitre = document.createElement("p");
    const playlistDescription = document.createElement("p");

    playlistItem.href = "./playlist.html?id=".concat(playlist.id);
    playlistItem.classList.add("playlist-item", "flex-column");
    playlistPreview.classList.add("playlist-preview");
    playlistImg.src = playlist.thumbnail;
    playIcon.classList.add(
      "fa",
      "fa-2x",
      "fa-play-circle",
      "hidden",
      "playlist-play-icon"
    );
    playlistTitre.textContent = playlist.name;
    playlistDescription.textContent = playlist.description;

    playlistPreview.appendChild(playlistImg);
    playlistPreview.appendChild(playIcon);
    playlistItem.appendChild(playlistPreview);
    playlistItem.appendChild(playlistTitre);
    playlistItem.appendChild(playlistDescription);
    return playlistItem;
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une chansons
   * @param {Object} song chanson à utiliser pour la génération du HTML
   * @returns {HTMLDivElement} élément <div> qui contient le HTML de l'affichage pour une chanson
   */
  buildSongItem = function (song) {
    const songItem = document.createElement("div");
    const songName = document.createElement("p");
    const songGenre = document.createElement("p");
    const songArtist = document.createElement("p");
    const likeBouton = document.createElement("button");

    songItem.classList.add("song-item", "flex-row");
    songName.textContent = song.name;
    songGenre.textContent = song.genre;
    songArtist.textContent = song.artist;
    likeBouton.classList.add("fa-heart", "fa-2x");

    if (song.liked) {
      likeBouton.classList.add("fa");
    } else {
      likeBouton.classList.add("fa-regular");
    }

    songItem.appendChild(songName);
    songItem.appendChild(songGenre);
    songItem.appendChild(songArtist);
    songItem.appendChild(likeBouton);

    // TODO : gérer l'événement "click". Modifier l'image du bouton et mettre à jour l'information dans LocalStorage
    const storageManager = this.storageManager;
    likeBouton.onclick = function () {
      song.liked = !song.liked;
      if (song.liked) {
        likeBouton.classList.remove("fa-regular");
        likeBouton.classList.add("fa");
      } else {
        likeBouton.classList.remove("fa");
        likeBouton.classList.add("fa-regular");
      }
      storageManager.replaceItem(storageManager.STORAGE_KEY_SONGS, song);
    };

    return songItem;
  };
}

window.onload = () => {
  const storageManager = new StorageManager();
  const library = new Library(storageManager);

  storageManager.loadAllData();
  // TODO : Récupérer les playlists et les chansons de LocalStorage et bâtir le HTML de la page
  library.generateLists(
    storageManager.getData(storageManager.STORAGE_KEY_PLAYLISTS),
    storageManager.getData(storageManager.STORAGE_KEY_SONGS)
  );
};
