import songs from "./songs.js";
import playlists from "./playlists.js";

export default class StorageManager {
  STORAGE_KEY_SONGS = "songs";
  STORAGE_KEY_PLAYLISTS = "playlist";

  /**
   * Charge toutes les données dans le LocalStorage
   */
  loadAllData () {
    this.loadDataFromFile(this.STORAGE_KEY_SONGS, songs);
    this.loadDataFromFile(this.STORAGE_KEY_PLAYLISTS, playlists);
  }

  /**
   * TODO
   * Charge un objet dans LocalStorage selon une clé spécifique
   * Si la clé est déjà présente dans LocalStorage, rien n'est chargé
   * @param {string} storageKey clé de sauvegarde
   * @param {Object} defaultData données à sauvegarder
   */
  loadDataFromFile (storageKey, defaultData = {}) {
    if (this.getData(storageKey) === null) {
      localStorage.setItem(storageKey, JSON.stringify(defaultData));
    }
  }

  /**
   * Obtient un objet de LocalStorage en fonction de la clé de sauvegarde
   * @param {string} storageKey clé de sauvegarde
   * @returns {Object} données de LocalStorage
   */
  getData (storageKey) {
    return JSON.parse(localStorage.getItem(storageKey));
  }

  /**
   * TODO
   * Obtient un objet de LocalStorage en fonction de la clé de sauvegarde et un paramètre 'id'
   * @param {string} storageKey clé de sauvegarde
   * @param {string | number} id paramètre 'id' à trouver dans les données
   * @returns {Object} donné de LocalStorage ayant le bon attribut 'id'
   */
  getItemById (storageKey, id) {
    const localData = this.getData(storageKey);
    return localData === null ? -1 : localData.find((obj) => obj.id === id);
  }

  /**
   * TODO
   * Ajoute un item aux données sauvegardés avec une clé de sauvegarde
   * @param {string} storageKey clé de sauvegarde
   * @param {Object} newItem  objet à rajouter
   */
  addItem (storageKey, newItem) {
    const localData = this.getData(storageKey);
    if (localData === null) {
      return;
    }
    localData.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(localData));
  }

  /**
   * Remplace un item dans les données sauvegardés avec une clé de sauvegarde
   * Utilise l'attribut 'id' de l'objet pour trouver l'item à remplacer
   * @param {string} storageKey clé de sauvegarde
   * @param {Object} newItem objet à rajouter. Nécessite l'attribut 'id'
   */
  replaceItem (storageKey, newItem) {
    const localData = JSON.parse(localStorage.getItem(storageKey));
    const newData = localData.map((item) => {
      return item.id === newItem.id ? newItem : item;
    });
    localStorage.setItem(storageKey, JSON.stringify(newData));
  }

  /**
   * TODO
   * Récupère l'attribut 'id' d'un item dans les données sauvegardés avec une clé de sauvegarde
   * Utilise l'attribut 'name' de l'objet pour trouver l'item à retourner
   * @param {string} storageKey clé de sauvegarde
   * @param {Object} elementName nom de l'objet à retrouver. Comparé avec l'attribut 'name'
   * @returns {string|number} id de l'item ayant l'attribut 'name' égale à 'elementName'
   */
  getIdFromName (storageKey, elementName) {
    const localData = this.getData(storageKey);
    return localData === null
      ? -1
      : localData.find((elem) => elem.name === elementName).id;
  }

  /**
   * Vide le LocalStorage
   */
  resetAllData () {
    localStorage.clear();
  }
}
