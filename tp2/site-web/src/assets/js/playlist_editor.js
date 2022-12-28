import StorageManager from "./storageManager.js";
import { generateRandomID } from "./utils.js";

/**
 * TODO
 * Popule l'élément 'dataList' avec des éléments <option> en fonction des noms des chansons en paramètre
 * @param {HTMLDataListElement} dataList élément HTML à qui ajouter des options
 * @param {Object} songs liste de chansons dont l'attribut 'name' est utilisé pour générer les éléments <option>
 */
function buildDataList (dataList, songs) {
  // TODO : extraire le nom des chansons et populer l'élément dataList avec des éléments <option>
  for (const index in songs) {
    const option = document.createElement("option");
    option.value = songs[index].name;
    dataList.appendChild(option);
  }
}

/**
 * Permet de mettre à jour la prévisualisation de l'image pour la playlist
 */
function updateImageDisplay () {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = URL.createObjectURL(this.files[0]);
}

/**
 * TODO
 * Ajoute le code HTML pour pouvoir ajouter une chanson à la playlist
 * Le code contient les éléments <label>, <input> et <button> dans un parent <div>
 * Le bouton gère l'événement "click" et retire le <div> généré de son parent
 * @param {Event} e événement de clic
 */
function addItemSelect (e) {
  // TODO : prévenir le comportement par défaut du bouton pour empêcher la soumission du formulaire
  e.preventDefault();

  // TODO : construire les éléments HTML nécessaires pour l'ajout d'une nouvelle chanson
  const songContainer = document.getElementById("song-list");
  const songDiv = document.createElement("div");
  const songLabel = document.createElement("label");
  const songInput = document.createElement("input");
  const likeButton = document.createElement("button");

  const index = songContainer.childElementCount + 1;
  songLabel.setAttribute("for", "song-".concat(index));
  songLabel.innerText = "#".concat(index);
  songInput.classList.add("song-input");
  songInput.setAttribute("id", "song-".concat(index));
  songInput.setAttribute("type", "select");
  songInput.setAttribute("list", "song-dataList");
  songInput.required = true;
  likeButton.classList.add("fa", "fa-minus");

  songDiv.appendChild(songLabel);
  songDiv.appendChild(songInput);
  songDiv.appendChild(likeButton);
  songContainer.appendChild(songDiv);

  // TODO : gérér l'événement "click" qui retire l'élément <div> généré de son parent
  likeButton.onclick = function () {
    songContainer.removeChild(songDiv);
    updateSongsIndex();
  };
}
/**
 * Mets a jour les index des inputs si on supprime un input.
 */
function updateSongsIndex () {
  const songContainer = document.getElementById("song-list");
  const descendents = songContainer.getElementsByTagName("div");
  for (let i = 0; i < descendents.length; i++) {
    const songLabel = descendents[i].querySelector("label");
    songLabel.setAttribute("for", "song-".concat(i + 1));
    songLabel.innerText = "#".concat(i + 1);
    const songInput = descendents[i].querySelector("input");
    songInput.setAttribute("id", "song-".concat(i + 1));
  }
}

/**
 * Supprime les doublons d'une playlist
 * @param {Array} playlist qui peut contenir des doublons.
 * @returns {Array} playlist sans doublons.
 */
function removeDuplicate (arr) {
  const res = [];
  if (!arr || arr.length === 0) {
    return res;
  }
  for (let i = 0; i < arr.length; i++) {
    if (res.filter((e) => e.id === arr[i].id).length <= 0) {
      res.push(arr[i]);
    }
  }
  return res;
}
/**
 * TODO
 * Génère un objet Playlist avec les informations du formulaire et le sauvegarde dans le LocalStorage
 * @param {HTMLFormElement} form élément <form> à traiter pour obtenir les données
 * @param {StorageManager} storageManager permet la sauvegarde dans LocalStorage
 */
async function createPlaylist (form, storageManager) {
  // TODO : récupérer les informations du formulaire
  // Voir la propriété "elements" https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
  const elements = form.elements;
  const playlistImage = await getImageInput(elements["image"]);

  let songList = [];
  const nbSongs = document.getElementById("song-list").childElementCount;
  for (let i = 1; i <= nbSongs; i++) {
    songList.push({
      id: storageManager.getIdFromName(
        storageManager.STORAGE_KEY_SONGS,
        elements["song-".concat(i)].value
      ),
    });
  }
  songList = removeDuplicate(songList);

  // TODO : créer un nouveau objet playlist et le sauvegarder dans LocalStorage
  const newPlaylist = {
    id: generateRandomID(),
    name: elements["name"].value,
    description: elements["description"].value,
    thumbnail: playlistImage,
    songs: songList,
  };
  storageManager.addItem(storageManager.STORAGE_KEY_PLAYLISTS, newPlaylist);
}

/**
 * Fonction qui permet d'extraire une image à partir d'un file input
 * @param {HTMLInputElement} input champ de saisie pour l'image
 * @returns image récupérée de la saisie
 */
async function getImageInput (input) {
  if (input && input.files && input.files[0]) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(input.files[0]);
    });
    return image;
  }
}

window.onload = () => {
  // TODO : récupérer les éléments du DOM
  const imageInput = document.getElementById("image");
  const form = document.getElementById("playlist-form");
  const addSongButton = document.getElementById("add-song-btn");
  addSongButton.addEventListener("click", (e) => {
    addItemSelect(e);
  });

  const storageManager = new StorageManager();
  storageManager.loadAllData();
  const songs = storageManager.getData(storageManager.STORAGE_KEY_SONGS);

  // TODO : construire l'objet dataList
  buildDataList(document.getElementById("song-dataList"), songs);
  imageInput.addEventListener("change", updateImageDisplay);

  // TODO : gérer l'événement "submit" du formulaire
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    createPlaylist(form, storageManager);
    window.location.replace("./index.html");
  });
};
