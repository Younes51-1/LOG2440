const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { SearchBarManager } = require("../managers/search_bar_manager");
const { SongsManager } = require("../managers/songs_manager");
const { PlaylistManager } = require("../managers/playlist_manager");

const songsManager = new SongsManager();
const playlistManager = new PlaylistManager();

const searchBarManager = new SearchBarManager(songsManager, playlistManager);

/**
 * TODO : implémenter la gestion de la requête
 * Retourne une liste de chansons et de playlists qui correspondent à la recherche
 * Prends les attributs à partir de la query de la requête
 * @memberof module:routes/search_bar
 * @name GET /search/
 */
router.get("/", async (request, response) => {
  try {
    const exact = request.query.exact === "true"; // par défaut : tout est un string
    const filtred = await searchBarManager.search(request.query.search_query, exact);
    response.status(HTTP_STATUS.SUCCESS).json(filtred);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).send(error);
  }
});

module.exports = { router, searchBarManager };
