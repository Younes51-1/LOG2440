import songs from "./songs.js";
import playlists from "./playlists.js";

export default class StorageManager {
  STORAGE_KEY_SONGS = "songs";
  STORAGE_KEY_PLAYLISTS = "playlist";

  loadAllData () {
    this.loadDataFromFile(this.STORAGE_KEY_SONGS, songs);
    this.loadDataFromFile(this.STORAGE_KEY_PLAYLISTS, playlists);
  }

  loadDataFromFile (storageKey, defaultData = {}) {
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(defaultData));
    }
  }

  getData (storageKey) {
    return JSON.parse(localStorage.getItem(storageKey));
  }

  getItemById (storageKey, id) {
    return this.getData(storageKey).find((item) => item.id === id);
  }

  addItem (storageKey, newItem) {
    const localData = JSON.parse(localStorage.getItem(storageKey));
    localData.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(localData));
  }

  replaceItem (storageKey, newItem) {
    const localData = JSON.parse(localStorage.getItem(storageKey));
    const newData = localData.map((item) => {
      return item.id === newItem.id ? newItem : item;
    });
    localStorage.setItem(storageKey, JSON.stringify(newData));
  }

  getIdFromName (storageKey, elementName) {
    const element = this.getData(storageKey).find(
      (element) => element.name === elementName
    );
    const id = element ? element.id : -1;
    return id;
  }

  resetAllData () {
    localStorage.clear();
  }
}
