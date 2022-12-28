const { FileSystemManager } = require("./file_system_manager");
const path = require("path");
const { randomUUID } = require("crypto");
const fs = require("fs");

class PlaylistManager {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/playlists.json");
    this.fileSystemManager = new FileSystemManager();
  }

  /**
   * Retourne toutes les playlists disponibles
   * @returns {Promise<Array>} la liste de toutes les playlists
   */
  async getAllPlaylists () {
    const fileBuffer = await this.fileSystemManager.readFile(this.JSON_PATH);
    return JSON.parse(fileBuffer).playlists;
  }

  /**
   * TODO : Implémenter la récupération d'une playlist en fonction de son id
   * Retourne une playlist en fonction de son id
   * @param {string} id
   * @returns Retourne la playlist en fonction de son id
   */
  async getPlaylistById (id) {
    return await (await this.getAllPlaylists()).find((item) => item.id === id);
  }

  /**
   * Ajoute une playlist dans le fichier de toutes les playlists
   * @param {Object} playlist nouvelle playlist à ajouter
   * @returns retourne la playlist ajoutée
   */
  async addPlaylist (playlist) {
    const playlists = await this.getAllPlaylists();
    playlist.id = randomUUID();
    await this.savePlaylistThumbnail(playlist);
    playlists.push(playlist);
    await this.fileSystemManager.writeToJsonFile(
      this.JSON_PATH,
      JSON.stringify({ playlists })
    );
    return playlist;
  }

  /**
   * TODO : Implémenter la mise à jour de la playlist et du fichiers de toutes les playlists
   * Modifie une playlist en fonction de son id et met à jour le fichier de toutes les playlists
   * @param {Object} playlist nouveau contenu de la playlist
   */
  async updatePlaylist (playlist) {
    const playlists = await this.getAllPlaylists();
    const oldPlaylist = playlists.find((item) => item.id === playlist.id);

    playlist.thumbnail = oldPlaylist.thumbnail;
    playlists[playlists.indexOf(oldPlaylist)] = playlist;
    await this.fileSystemManager.writeToJsonFile(
      this.JSON_PATH,
      JSON.stringify({ playlists })
    );
  }

  /**
   * Extrait le type d'image d'une notation base64 d'une image
   * @param {string} picture image représentée sous le format base64
   * @returns {string} le type de l'image
   */
  async chooseProperEncoding (picture) {
    if (picture.startsWith("data:image/jpeg;base64,")) {
      return "jpeg";
    } else if (picture.startsWith("data:image/png;base64,")) {
      return "png";
    } else if (picture.startsWith("data:image/bmp;base64,")) {
      return "bmp";
    } else if (picture.startsWith("data:image/jpg;base64,")) {
      return "jpg";
    } else {
      throw new Error("Invalid image format");
    }
  }

  /**
   * @param {string} id identifiant de la playlist
   * @returns {Promise<boolean>} true si la playlist a été supprimée, false sinon
   */
  async deletePlaylist (id) {
    const allPlaylists = await this.getAllPlaylists();
    const playlistToDelete = allPlaylists.find(
      (playlist) => playlist.id === id
    );
    if (playlistToDelete) {
      const playlists = allPlaylists.filter((playlist) => playlist.id !== id);
      const playlistToSave = JSON.stringify({ playlists }, null, 2);
      await this.fileSystemManager.writeToJsonFile(
        this.JSON_PATH,
        playlistToSave
      );
      await this.deletePlaylistThumbnail(playlistToDelete.thumbnail);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Supprime un fichier sur disque
   * @param {string} filePath chemin vers le fichier à supprimer
   * @returns {Promise<void>} une promesse avec 'undefined' en cas de réussite
   */
  async deletePlaylistThumbnail (filePath) {
    return fs.promises.unlink(filePath);
  }

  /**
   * Sauvegarde l'image de prévisualisation d'une playlist sur disque
   * @param {Object} playlist playlist pour laquelle sauvegarder l'image
   */
  async savePlaylistThumbnail (playlist) {
    const fileFormat = await this.chooseProperEncoding(playlist.thumbnail);
    const thumbnailData = playlist.thumbnail.replace(
      `data:image/${fileFormat};base64,`,
      ""
    );
    const thumbnailFileName = `assets/img/${playlist.id}.${fileFormat}`;
    const filePath = path.join(
      __dirname + `../../assets/img/${playlist.id}.${fileFormat}`
    );
    await fs.promises.writeFile(filePath, thumbnailData, {
      encoding: "base64",
    });
    playlist.thumbnail = thumbnailFileName;
  }
}
module.exports = { PlaylistManager };
