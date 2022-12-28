import StorageManager from "./storageManager.js";
import { formatTime } from "./utils.js";
import { SKIP_TIME, SHORTCUTS } from "./consts.js";
import Player from "./player.js";

export class PlayListManager {
  constructor (player) {
    /**
     * @type {Player}
     */
    this.player = player;
    this.shortcuts = new Map();
  }

  /**
   * TODO
   * Charge les chansons de la playlist choisie et construit dynamiquement le HTML pour les éléments de chansons
   * @param {StorageManager} storageManager gestionnaire d'accès au LocalStorage
   * @param {string} playlistId identifiant de la playlist choisie
   */
  loadSongs (storageManager, playlistId) {
    const playlist = storageManager.getItemById(
      storageManager.STORAGE_KEY_PLAYLISTS,
      playlistId
    );
    if (!playlist) return;

    const songsInPlayList = [];
    playlist.songs.forEach((elem) =>
      songsInPlayList.push(
        storageManager.getItemById(storageManager.STORAGE_KEY_SONGS, elem.id)
      )
    );
    this.player.loadSongs(songsInPlayList);

    // TODO : Changer l'image et le titre de la page en fonction de la playlist choisie
    document.getElementById("playlist-img").src = playlist.thumbnail;
    document.getElementById("playlist-title").textContent = playlist.name;

    // TODO : Récupérer les chansons de la playlist et construire le HTML pour leur représentation
    let index = 0;
    playlist.songs.forEach((elem) =>
      this.buildSongItem(
        storageManager.getItemById(storageManager.STORAGE_KEY_SONGS, elem.id),
        index++
      )
    );

    this.setCurrentSongName();
  }

  setPauseButton () {
    const playButton = document.getElementById("play");
    if (playButton.classList.contains("fa-play")) {
      playButton.classList.add("fa-pause");
      playButton.classList.remove("fa-play");
    }
  }

  /**
   * TODO
   * Construit le code HTML pour représenter une chanson
   * @param {Object} song la chansons à représenter
   * @param {number} index index de la chanson
   * @returns {HTMLDivElement} le code HTML dans un élément <div>
   */
  buildSongItem (song, index) {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item", "flex-row");

    const songNumber = document.createElement("span");
    const songName = document.createElement("p");
    const songGenre = document.createElement("p");
    const songArtist = document.createElement("p");
    const likeButton = document.createElement("i");

    songNumber.textContent = index + 1;
    songName.textContent = song.name;
    songGenre.textContent = song.genre;
    songArtist.textContent = song.artist;
    likeButton.classList.add("fa-2x", "fa-heart");
    if (song.liked) {
      likeButton.classList.add("fa");
      likeButton.classList.remove("fa-regular");
    } else {
      likeButton.classList.add("fa-regular");
      likeButton.classList.remove("fa");
    }

    songItem.appendChild(songNumber);
    songItem.appendChild(songName);
    songItem.appendChild(songGenre);
    songItem.appendChild(songArtist);
    songItem.appendChild(likeButton);

    const section_songs = document.getElementById("song-container");
    section_songs.appendChild(songItem);

    const manager = this;
    // TODO : gérer l'événement "click" et jouer la chanson après un click
    songItem.onclick = function () {
      manager.player.playAudio(index);
      manager.setPauseButton();
      manager.setCurrentSongName();
    };

    return songItem;
  }

  /**
   * TODO
   * Joue une chanson en fonction de l'index et met à jour le titre de la chanson jouée
   * @param {number} index index de la chanson
   */
  playAudio (index = -1) {
    const playButton = document.getElementById("play");
    this.player.playAudio(index);
    this.setCurrentSongName();

    // TODO : modifier l'icône du bouton. Ajoute la classe 'fa-pause' si la chanson joue, 'fa-play' sinon
    if (playButton.classList.contains("fa-play")) {
      playButton.classList.add("fa-pause");
      playButton.classList.remove("fa-play");
    } else {
      playButton.classList.remove("fa-pause");
      playButton.classList.add("fa-play");
    }
  }

  /**
   * TODO
   * Joue la prochaine chanson et met à jour le titre de la chanson jouée
   */
  playPreviousSong () {
    this.player.playPreviousSong();
    this.setCurrentSongName();
    this.setPauseButton();
  }

  /**
   * TODO
   * Joue la chanson précédente et met à jour le titre de la chanson jouée
   */
  playNextSong () {
    this.player.playNextSong();
    this.setCurrentSongName();
    this.setPauseButton();
  }

  /**
   * TODO
   * Met à jour le titre de la chanson jouée dans l'interface
   */
  setCurrentSongName () {
    const song_played = document.getElementById("now-playing");
    song_played.textContent = "On joue : ".concat(this.player.currentSong.name);
  }

  /**
   * Met à jour la barre de progrès de la musique
   * @param {HTMLSpanElement} currentTimeElement élément <span> du temps de la chanson
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   * @param {HTMLSpanElement} durationElement élément <span> de la durée de la chanson
   */
  timelineUpdate (currentTimeElement, timelineElement, durationElement) {
    const position =
      (100 * this.player.audio.currentTime) / this.player.audio.duration;
    timelineElement.value = position;
    currentTimeElement.textContent = formatTime(
      this.player.audio.currentTime
    ).substring(1);
    if (!isNaN(this.player.audio.duration)) {
      durationElement.textContent = formatTime(
        this.player.audio.duration
      ).substring(1);
    }
  }

  /**
   * TODO
   * Déplacement le progrès de la chansons en fonction de l'attribut 'value' de timeLineEvent
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   */
  audioSeek (timelineElement) {
    this.player.audioSeek(timelineElement.value);
  }

  /**
   * TODO
   * Active ou désactive le son
   * Met à jour l'icône du bouton et ajoute la classe 'fa-volume-mute' si le son ferme ou 'fa-volume-high' si le son est ouvert
   */
  muteToggle () {
    const muteButton = document.getElementById("mute");
    if (this.player.muteToggle()) {
      muteButton.classList.add("fa-volume-mute");
      muteButton.classList.remove("fa-volume-high");
    } else {
      muteButton.classList.remove("fa-volume-mute");
      muteButton.classList.add("fa-volume-high");
    }
  }

  /**
   * TODO
   * Active ou désactive l'attribut 'shuffle' de l'attribut 'player'
   * Met à jour l'icône du bouton et ajoute la classe 'control-btn-toggled' si shuffle est activé, retire la classe sinon
   * @param {HTMLButtonElement} shuffleButton élément <button> de la fonctionnalité shuffle
   */
  shuffleToggle (shuffleButton) {
    if (this.player.shuffleToggle()) {
      shuffleButton.classList.add("control-btn-toggled");
    } else {
      shuffleButton.classList.remove("control-btn-toggled");
    }
  }

  /**
   * Ajoute delta secondes au progrès de la chanson en cours
   * @param {number} delta temps en secondes
   */
  scrubTime (delta) {
    this.player.scrubTime(delta);
  }

  /**
   * TODO
   * Configure la gestion des événements
   */
  bindEvents () {
    const currentTime = document.getElementById("timeline-current");
    const duration = document.getElementById("timeline-end");
    const timeline = document.getElementById("timeline");
    this.player.audio.addEventListener("timeupdate", () => {
      this.timelineUpdate(currentTime, timeline, duration);
    });

    timeline.addEventListener("input", () => {
      this.audioSeek(timeline);
    });

    const playlistManager = this;
    // TODO : gérer l'événement 'ended' sur l'attribut 'audio' du 'player' et jouer la prochaine chanson automatiquement
    this.player.audio.onended = function () {
      playlistManager.playNextSong();
    };

    // TODO : gérer l'événement 'click' sur le bon bouton et mettre la chanson en pause/enlever la pause
    document.getElementById("play").onclick = function () {
      playlistManager.playAudio();
    };

    // TODO : gérer l'événement 'click' sur le bon bouton et fermer/ouvrir le son
    document.getElementById("mute").onclick = function () {
      playlistManager.muteToggle();
    };

    // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson précédente
    document.getElementById("previous").onclick = function () {
      playlistManager.playPreviousSong();
    };

    // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson suivante
    document.getElementById("next").onclick = function () {
      playlistManager.playNextSong();
    };

    // TODO : gérer l'événement 'click' sur le bon bouton et activer/désactiver le mode 'shuffle'
    document.getElementById("shuffle").onclick = function () {
      playlistManager.shuffleToggle(document.getElementById("shuffle"));
    };
  }

  /** sssssssss
   * Configure les raccourcis et la gestion de l'événement 'keydown'
   */
  bindShortcuts () {
    this.shortcuts.set(SHORTCUTS.GO_FORWARD, () => this.scrubTime(SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.GO_BACK, () => this.scrubTime(-SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.PLAY_PAUSE, () => this.playAudio());
    this.shortcuts.set(SHORTCUTS.NEXT_SONG, () => this.playNextSong());
    this.shortcuts.set(SHORTCUTS.PREVIOUS_SONG, () => this.playPreviousSong());
    this.shortcuts.set(SHORTCUTS.MUTE, () => this.muteToggle());

    document.addEventListener("keydown", (event) => {
      if (this.shortcuts.has(event.key)) {
        const command = this.shortcuts.get(event.key);
        command();
      }
    });
  }
}

window.onload = () => {
  const storageManager = new StorageManager();
  storageManager.loadAllData();

  // TODO : récupérer l'identifiant à partir de l'URL
  // Voir l'objet URLSearchParams
  const identifiant = new URLSearchParams(window.location.search).get("id");

  const player = new Player();
  const playlistManager = new PlayListManager(player);

  // TODO : configurer la gestion des événements et des raccourcis
  playlistManager.bindEvents();
  playlistManager.bindShortcuts();

  // TODO : charger la playlist
  playlistManager.loadSongs(storageManager, identifiant);
};
