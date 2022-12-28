import HTTPManager from "./http_manager.js";
import { SERVER_URL } from "./consts.js";

export default class PlayListEditor {
  constructor (HTTPManager) {
    this.HTTPManager = HTTPManager;
    this.songs = [];
  }

  buildDataList (dataList, songs) {
    dataList.innerHTML = "";
    songs.forEach((song) => {
      const option = document.createElement("option");
      option.value = song.name;
      dataList.appendChild(option);
    });
  }

  updateImageDisplay () {
    const imagePreview = document.getElementById("image-preview");
    imagePreview.src = URL.createObjectURL(this.files[0]);
  }

  addItemSelect (e) {
    e.preventDefault();
    const songContainer = document.getElementById("song-list");
    const index = songContainer.children.length + 1;

    const inputContainer = document.createElement("div");
    const indexLabel = document.createElement("label");
    indexLabel.textContent = `#${index} `;
    indexLabel.setAttribute("for", `song-${index}`);
    inputContainer.appendChild(indexLabel);

    const newInput = document.createElement("input");
    newInput.type = "select";
    newInput.setAttribute("list", "song-dataList");
    newInput.setAttribute("id", `song-${index}`);
    newInput.classList.add("song-input");
    inputContainer.appendChild(newInput);

    const removeInputButton = document.createElement("button");
    removeInputButton.classList = "fa fa-minus";
    removeInputButton.addEventListener("click", (e) => {
      e.target.parentNode.remove();
    });
    inputContainer.appendChild(removeInputButton);

    songContainer.appendChild(inputContainer);
  }

  async load () {
    const imageInput = document.getElementById("image");
    const addSongButton = document.getElementById("add-song-btn");
    const form = document.getElementById("playlist-form");
    const songDataList = document.getElementById("song-dataList");
    const songs = await this.HTTPManager.getAllSongs();
    const deleteButton = document.getElementById("playlist-delete");
    this.songs = songs;

    this.buildDataList(songDataList, songs);

    imageInput.addEventListener("change", this.updateImageDisplay);
    addSongButton.addEventListener("click", this.addItemSelect);

    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get("id");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.createPlaylist(form, playlistId).catch((e) => {});
      location.href = "index.html";
    });

    // afficher le bouton seulement si la page est accédée avec un id de playlist
    if (playlistId) {
      await this.loadForEdit(playlistId);
      document.getElementById("playlist-submit").value = "Modifier la playlist";
      deleteButton.addEventListener("click", () => {
        this.deletePlaylist(playlistId);
      });
    } else {
      deleteButton.remove();
    }
  }

  /**
   * Charge une playlist à modifier et rempli le formulaire de la page
   * @param {string} id identifiant de la playlist
   */
  async loadForEdit (id) {
    const playlist = await this.HTTPManager.getPlaylistById(id);
    document.getElementById("name").value = playlist.name;
    document.getElementById("description").value = playlist.description;

    const blob = await (await fetch(`${SERVER_URL}/${playlist.thumbnail}`)).blob();
    const dataTransfer = new DataTransfer();
    const file = new File([blob], `${playlist.thumbnail}`, {
      type: blob.type,
    });
    dataTransfer.items.add(file);
    const fileInput = document.getElementById("image");
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event("change"));

    playlist.songs.forEach(async (song, index) => {
      const newSong = await this.HTTPManager.fetchSong(song.id);
      if (index > 0) {
        this.addItemSelect(new Event(""));
      }
      document.getElementById(`song-${index + 1}`).value = newSong.name;
    });
  }

  /**
   * TODO : implémenter l'envoi des requêtes en fonction de si on veut créer ou modifier une playlist existante
   * Créé une playlist sur le serveur à travers une requête
   * ou envoie une requête de modification si playlistId n'est pas 'undefined'
   * @param {HTMLFormELement} form formulaire de la playlist
   * @param {string} playlistId identifiant de la playlist
   */
  async createPlaylist (form, playlistId) {
    const elements = form.elements;
    const name = elements.name.value;
    const description = elements.description.value;
    const image = await this.getImageInput(elements.image);
    const songInputs = document.querySelectorAll(".song-input");
    const songNames = [...songInputs]
      .filter((song) => song.value)
      .map((song) => {
        return song.value;
      });
    const newPlaylist = {
      name,
      description,
      thumbnail: image,
      songs: songNames.map((song) => {
        const id = this.getIdFromName(song);
        if (id !== -1) {
          return {
            id: this.getIdFromName(song),
          };
        }
      }),
    };
    // TODO : Envoyer la bonne requête
    if (playlistId) {
      newPlaylist.id = playlistId;
      await this.HTTPManager.updatePlaylist(newPlaylist);
      // TODO : Modifer la playlist
    } else {
      // TODO : Créer la playlist
      await this.HTTPManager.addNewPlaylist(newPlaylist);
    }
  }

  /**
   * TODO : Supprimer une playlist à travers une requête HTTP
   * Suite à la supression, l'utilisateur est redirigé vers la page 'index.html'
   * @param {string} id identifiant de la playlist à supprimer
   */
  async deletePlaylist (id) {
    await this.HTTPManager.deletePlaylist(id);
    location.href = "index.html";
  }

  async getImageInput (input, reader = new FileReader()) {
    if (input && input.files && input.files[0]) {
      const image = await new Promise((resolve) => {
        reader.onload = (e) => resolve(reader.result);
        reader.readAsDataURL(input.files[0]);
      });
      return image;
    }
  }

  getIdFromName (elementName) {
    const element = this.songs.find((element) => element.name === elementName);
    const id = element ? element.id : -1;
    return id;
  }
}

window.onload = () => {
  new PlayListEditor(new HTTPManager()).load();
};
