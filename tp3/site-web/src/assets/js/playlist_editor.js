import StorageManager from "./storageManager.js";
import { generateRandomID } from "./utils.js";

export default class PlayListEditor {
  constructor (storageManager) {
    this.storageManager = storageManager;
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

  load () {
    const imageInput = document.getElementById("image");
    const addSongButton = document.getElementById("add-song-btn");
    const form = document.getElementById("playlist-form");
    const songDataList = document.getElementById("song-dataList");

    this.storageManager.loadAllData();
    const songs = this.storageManager.getData(this.storageManager.STORAGE_KEY_SONGS);

    this.buildDataList(songDataList, songs);

    imageInput.addEventListener("change", this.updateImageDisplay);
    addSongButton.addEventListener("click", this.addItemSelect);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.createPlaylist(form).catch(() => {}); // Could add a console.log for debug purposes here
      location.href = "index.html";
    });
  }

  async createPlaylist (form) {
    const elements = form.elements;
    const name = elements.name.value;
    const description = elements.description.value;
    const image = await this.getImageInput(elements.image);

    const songInputs = document.querySelectorAll(".song-input");
    const songNames = [...songInputs].map((song) => {
      if (song.value) {
        return song.value;
      }
    });

    const newPlaylist = {
      id: generateRandomID(),
      name,
      description,
      thumbnail: image,
      songs: songNames.map((song) => {
        return {
          id: this.storageManager.getIdFromName(
            this.storageManager.STORAGE_KEY_SONGS,
            song
          ),
        };
      }),
    };
    this.storageManager.addItem(this.storageManager.STORAGE_KEY_PLAYLISTS, newPlaylist);
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
};

window.onload = () => {
  new PlayListEditor(new StorageManager()).load();
};
