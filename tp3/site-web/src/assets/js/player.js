import { modulo, random } from "./utils.js";
export default class Player {
  constructor () {
    this.audio = new Audio();
    this.currentIndex = 0;
    this.songsInPlayList = [];
    this.shuffle = false;
  }

  loadSongs (songsInPlayList) {
    this.songsInPlayList = songsInPlayList;
    this.audio.src = this.songsInPlayList[0].src;
  }

  getSongFromIndex (index) {
    if (index >= 0 && index < this.songsInPlayList.length) {
      this.currentIndex = index;
    }
    return this.songsInPlayList[this.currentIndex];
  }

  playAudio (index = -1) {
    if (index === -1) {
      this.audio.paused ? this.audio.play() : this.audio.pause();
      return;
    }
    const song = this.getSongFromIndex(index);
    this.audio.load();
    this.audio.src = song.src;
    this.audio.play();
  }

  playPreviousSong () {
    this.currentIndex = this.shuffle
      ? random(0, this.songsInPlayList.length)
      : modulo(this.currentIndex - 1, this.songsInPlayList.length);
    this.playAudio(this.currentIndex);
  }

  playNextSong () {
    this.currentIndex = this.shuffle
      ? random(0, this.songsInPlayList.length)
      : modulo(this.currentIndex + 1, this.songsInPlayList.length);
    this.playAudio(this.currentIndex);
  }

  audioSeek (timelineValue) {
    const time = (timelineValue * this.audio.duration) / 100;
    this.audio.currentTime = time;
  }

  muteToggle () {
    const isMuted = this.audio.volume === 0;
    this.audio.volume = isMuted ? 1 : 0;
    return isMuted;
  }

  shuffleToggle () {
    this.shuffle = !this.shuffle;
    return this.shuffle;
  }

  scrubTime (delta) {
    const newTime = this.audio.currentTime + delta;
    this.audio.currentTime = newTime;
  }

  get currentSong () {
    return this.songsInPlayList[this.currentIndex];
  }
}
