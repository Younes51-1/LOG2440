import { modulo, random } from "./utils.js";

export default class Player {
  constructor () {
    this.audio = new Audio();
    this.currentIndex = 0;
    this.songsInPlayList = [];
    this.shuffle = false;
  }

  /**
   * TODO
   * Charge les chansons à jour et configure la première chanson comme source pour l'audio
   * @param {Object[]} songsInPlayList chansons à jouer
   */
  loadSongs (songsInPlayList) {
    this.songsInPlayList = songsInPlayList;
    this.audio.src = this.songsInPlayList[0].src;
    this.audio.load();
  }

  /**
   * TODO
   * Récupère une chanson à partir de son index et la retourne
   * @param {number} index index de la chanson
   * @returns une chanson en fonction de son index dans le tableau
   */
  getSongFromIndex (index) {
    return this.songsInPlayList[index];
  }

  /**
   * TODO
   * Joue une chanson en fonction de son index.
   * Si 'index' == -1, met l'audio et pause ou le joue si l'audio est déjà en pause
   * @param {number} index index de la chanson
   */
  playAudio (index) {
    if (index === -1) {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    } else {
      this.currentIndex = index;
      this.audio.src = this.getSongFromIndex(index).src;
      this.audio.load();
      this.audio.play();
    }
  }

  /**
   * TODO
   * Incrémente l'index courant et joue la prochaine chanson avec le mouvel index.
   * Si la dernière chanson est présentement jouée, la première chanson de la liste devient la suivante
   * Si l'attribut 'shuffle' est true, l'index courant se fait assigner une valeur aléatoire valide
   */
  playPreviousSong () {
    if (this.shuffle) {
      this.currentIndex = random(0, this.songsInPlayList.length);
    } else {
      this.currentIndex--;
    }
    this.playAudio(modulo(this.currentIndex, this.songsInPlayList.length));
  }

  /**
   * TODO
   * Décrémente l'index courant et joue la prochaine chanson avec le mouvel index.
   * Si la première chanson est présentement jouée, la dernière chanson de la liste devient la suivante
   * Si l'attribut 'shuffle' est true, l'index courant se fait assigner une valeur aléatoire valide
   */
  playNextSong () {
    if (this.shuffle) {
      this.currentIndex = random(0, this.songsInPlayList.length);
    } else {
      this.currentIndex++;
    }
    this.playAudio(modulo(this.currentIndex, this.songsInPlayList.length));
  }

  /**
   * Modifie l'attribut 'currentTime' de l'attribut 'audio' pour modifier la place dans la chanson jouée
   * @param {number} timelineValue le pourcentage de la durée totale
   */
  audioSeek (timelineValue) {
    const time = (timelineValue * this.audio.duration) / 100;
    this.audio.currentTime = time;
  }

  /**
   * TODO
   * Change l'attribut 'volume' de l'attribut audio à 0 si le son est ouvert, à 1 sinon
   * @returns {boolean} true si le son est fermé, false sinon
   */
  muteToggle () {
    if (this.audio.volume === 1) {
      this.audio.volume = 0;
    } else {
      this.audio.volume = 1;
    }
    return !this.audio.volume;
  }

  /**
   * Inverse la valeur de l'attribut 'shuffle'
   * @returns {boolean} la valeur de l'attribut 'shuffle'
   */
  shuffleToggle () {
    this.shuffle = !this.shuffle;
    return this.shuffle;
  }

  /**
   * TODO
   * Ajoute delta secondes à l'attribut 'currentTime' de l'attribut 'audio'
   * @param {number} delta le temps en secondes
   */
  scrubTime (delta) {
    this.audio.currentTime += delta;
  }

  /**
   * Retourne la chanson présentement jouée
   * @returns {Object} la chansons présentement jouée
   */
  get currentSong () {
    return this.songsInPlayList[this.currentIndex];
  }
}
