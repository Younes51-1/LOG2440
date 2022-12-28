const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { SongsManager } = require("../managers/songs_manager");
const fs = require("fs");
const path = require("path");
const songsManager = new SongsManager();

/**
 * Retourne la liste de toutes les chansons
 * @memberof module:routes/songs
 * @name GET /songs
 */
router.get("/", async (request, response) => {
  try {
    const songs = await songsManager.getAllSongs();
    response.status(HTTP_STATUS.SUCCESS).json(songs);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * TODO : Implementer la requête
 * Retourne une chanson en fonction de son id
 * @memberof module:routes/songs
 * @name GET /songs/:id
 */
router.get("/:id", async (request, response) => {
  try {
    const song = await songsManager.getSongById(parseInt(request.params.id));
    if (song === undefined) {
      response.status(HTTP_STATUS.NOT_FOUND).send();
      return;
    }
    response.status(HTTP_STATUS.SUCCESS).json(song);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne le contenu d'un fichier de musique en fonction de son id
 * @memberof module:routes/songs
 * @name GET /songs/player/:id/
 */
router.get("/player/:id", async (request, response) => {
  try {
    const song = await songsManager.getSongById(parseInt(request.params.id));
    const filePath = path.join(__dirname + "../../" + song.src);
    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;
    const readStream = fs.createReadStream(path.join(__dirname + "../../" + song.src));
    const headers = {
      "Content-Type": ":audio/mpeg",
      "Content-Length": fileSize,
    };
    response.status(HTTP_STATUS.SUCCESS);
    response.set(headers);
    readStream.pipe(response);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * TODO : implémenter la gestion de la requête et retourner le nouveau statut
 * Modifie l'état aimé d'une chanson en fonction de son id
 * @memberof module:routes/songs
 * @name PATCH /songs/:id/like
 */
router.patch("/:id/like", async (request, response) => {
  try {
    const like = await songsManager.updateSongLike(parseInt(request.params.id));
    response.status(HTTP_STATUS.SUCCESS).json({ liked: like });
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

module.exports = { router, songsManager };
