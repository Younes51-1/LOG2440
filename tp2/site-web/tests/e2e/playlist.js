const shared = require("./shared");

let EXPECTED_SONGS;
let EXPECTED_PLAYLIST;

function getSongsFromPlaylist(playlist, allSongs) {
  return allSongs.filter((song) => {
    return playlist.songs.find((x) => x.id === song.id);
  });
}

describe("Contenu de la page Créer une Playlist", () => {
  before((browser) => {
    browser.url("http://localhost:5000/playlist.html?id=1").execute(
      () => Object.assign({}, localStorage),
      [],
      (result) => {
        EXPECTED_PLAYLIST = JSON.parse(result.value.playlist).find(
          (x) => x.id === "1"
        );
        EXPECTED_SONGS = getSongsFromPlaylist(
          EXPECTED_PLAYLIST,
          JSON.parse(result.value.songs)
        );
      }
    );
  });

  after((browser) => {
    browser.end();
  });

  test("Structure de la page", (browser) => {
    shared.validateHeader(browser);
    browser.log("\n===== Contenu principal =====");
    browser.verify.elementPresent(
      "header + main",
      "L'élément 'main' est présent sur la page."
    );
    browser.verify.hasClass(
      "main#main-area",
      "flex-column",
      "L'élément 'main' doit avoir la classe 'flex-column'"
    );
    browser.verify.elementPresent(
      "main#main-area > div#songs-list",
      "Un élément 'div' avec comme id 'songs-list' doit être présent à l'intérieur de l'élément main"
    );
    shared.validateFooter(browser);
  });

  test("Tests de l'entête du contenu principal", (browser) => {
    browser.verify.elementPresent(
      "main#main-area > div#songs-list > header#playlist-header",
      "Un élément 'header' avec comme id 'playlist-header' doit être présent à l'intérieur de l'élément div#songs-list"
    );
    browser.verify.hasClass(
      "header#playlist-header",
      "flex-row",
      "L'élément 'header' avec comme id 'playlist-header' doit avoir la classe 'flex-row'"
    );
    browser.verify.elementPresent(
      "header#playlist-header > img",
      "Il doit y avoir un élément 'img' présent à l'intérieur de l'élément 'header' précédent"
    );
    browser.verify.attributeContains(
      "header#playlist-header > img",
      "width",
      "80px",
      "La largeur de l'image doit être de 80px"
    );
    browser.verify.attributeContains(
      "header#playlist-header > img",
      "height",
      "80px",
      "La hauteur de l'image doit être de 80px"
    );
    browser.verify.elementPresent(
      "header#playlist-header > img + h1#playlist-title",
      "Un élément 'h1' doit être présent l'élément 'img' et doit avoir l'id 'playlist-title' "
    );
    browser.verify.elementPresent(
      "h1#playlist-title + a#playlist-edit",
      "Un élément 'a' doit être présent après l'élément 'h1' et doit avoir l'id 'playlist-edit'"
    );
    browser.verify.attributeContains(
      "a#playlist-edit",
      "href",
      "./create_playlist.html",
      "L'élément 'a' doit contenir un attribut 'href' ayant comme valeur './create_playlist.html'"
    );
    browser.verify.elementPresent(
      "a#playlist-edit > i",
      "Il doit y avoir un élément 'i' à l'intérieur de l'élément a précédent"
    );
    browser.verify.hasClass(
      "a#playlist-edit > i",
      "fa fa-2x fa-pencil",
      "La classe de l'élément 'i' doit être 'fa fa-2x fa-pencil'"
    );
  });

  test("Tests du contenu principal de la page", (browser) => {
    browser.verify.elementPresent(
      "header + section#song-container",
      "Il doit y avoir un élément 'section' avec l'id 'song-container' à la suite de l'élément 'header'"
    );
    browser.verify.hasClass(
      "section#song-container",
      "flex-column",
      "L'élément 'section' avec id 'song-container' doit avoir comme classe 'flex-column'"
    );
    browser.verify.elementPresent(
      "section#song-container > div",
      "Il doit y avoir une section 'div' à l'intérieur de l'élément 'section'"
    );
    browser.verify.hasClass(
      "section#song-container > div",
      "song-item flex-row",
      "L'élément 'div' doit avoir les classes 'song-item flex-row'"
    );
    browser.verify.elementPresent(
      "section#song-container > div > span + p + p + p + i",
      "L'élément 'div' doit contenir un élément 'span' suivi de trois élément 'p' puis un élément 'i'"
    );
    browser.elements(
      "css selector",
      "section#song-container > div > span + p + p + p + i",
      (result) => {
        browser.verify.equal(
          result.value.length,
          3,
          "Il doit y avoir trois ensembles d'éléments 'span', 'p', 'p', 'p' puis 'i' dans l'élément section"
        );
      }
    );
  });

  test("Tests de la barre de lecture de musique", (browser) => {
    browser.log("\n===== Barre de lecture de musique =====");
    browser.verify.elementPresent(
      "footer#playing-bar > div#now-playing",
      "Un élément 'div' avec l'id 'now-playing' doit être à l'intérieur de l'élément 'footer'"
    );
    browser.verify.elementPresent(
      "div#now-playing + div#controls",
      "Un élément 'div' avec l'id 'controls' suit l'élément 'div' précédent."
    );
    browser.verify.hasClass(
      "div#controls",
      "flex-column",
      "L'élément 'div' avec l'id 'controls' a la classe 'flex-column'"
    );
    browser.verify.elementPresent(
      "section#buttons-container",
      "Un élément section est présent dans l'élément 'div' précédent"
    );
    browser.verify.hasClass(
      "section#buttons-container",
      "flex-row",
      "L'élément 'section' a la classe 'flex-row'"
    );
    browser.elements(
      "css selector",
      "section#buttons-container > button",
      (result) => {
        browser.verify.equal(
          result.value.length,
          5,
          "L'élément 'section' contient 5 boutons"
        );
      }
    );
    browser.verify.elementPresent(
      "section#buttons-container > button#previous",
      "Un bouton avec l'id 'previous' doit être présent dans l'élément 'section'"
    );
    browser.verify.hasClass(
      "button#previous",
      "control-btn fa fa-2x fa-arrow-left",
      "Le bouton avec l'id 'previous' doit avoir les classes 'control-btn fa fa-2x fa-arrow-left'"
    );
    browser.verify.elementPresent(
      "section#buttons-container > button#play",
      "Un bouton avec l'id 'play' doit être présent dans l'élément 'section'"
    );
    browser.verify.hasClass(
      "button#play",
      "control-btn fa fa-2x fa-play",
      "Le bouton avec l'id 'play' doit avoir les classes 'control-btn fa fa-2x fa-arrow-play'"
    );
    browser.verify.elementPresent(
      "section#buttons-container > button#next",
      "Un bouton avec l'id 'next' doit être présent dans l'élément 'section'"
    );
    browser.verify.hasClass(
      "button#next",
      "control-btn fa fa-2x fa-arrow-right",
      "Le bouton avec l'id 'next' doit avoir les classes 'control-btn fa fa-2x fa-arrow-right'"
    );
    browser.verify.elementPresent(
      "section#buttons-container > button#shuffle",
      "Un bouton avec l'id 'shuffle' doit être présent dans l'élément 'section'"
    );
    browser.verify.hasClass(
      "button#shuffle",
      "control-btn fa fa-2x fa-shuffle",
      "Le bouton avec l'id 'shuffle' doit avoir les classes 'control-btn fa fa-2x fa-shuffle'"
    );
    browser.verify.elementPresent(
      "section#buttons-container > button#mute",
      "Un bouton avec l'id 'mute' doit être présent dans l'élément 'section'"
    );
    browser.verify.hasClass(
      "button#mute",
      "control-btn fa fa-2x fa-volume-high",
      "Le bouton avec l'id 'mute' doit avoir les classes 'control-btn fa fa-2x fa-volume-high'"
    );
    browser.verify.elementPresent(
      "section#buttons-container + section#timeline-container",
      "Un élément 'section' avec l'id 'timeline-container' suit le premier élément 'section'"
    );
    browser.verify.hasClass(
      "section#timeline-container",
      "flex-row",
      "L'élément 'section' doit avoir comme classe 'flex-row'"
    );
    browser.verify.elementPresent(
      "section#timeline-container > span#timeline-current",
      "Un élément 'span' avec l'id 'timeline-current' doit être présent à l'intérieur de la section"
    );
    browser.verify.elementPresent(
      "span#timeline-current + input#timeline",
      "Un élément 'input' avec l'id 'timeline' doit suivre l'élément précédant"
    );

    browser.verify.elementPresent(
      "input#timeline + span#timeline-end",
      "Un élément 'span' avec l'id 'timeline-end' doit suivre l'élément précédant"
    );

    browser.verify.textEquals(
      "#timeline-current",
      "0:00",
      "Le temps initial est 0:00"
    );
    browser.verify.textEquals(
      "#timeline-end",
      "5:00",
      "Le temps final est 5:00"
    );

    browser.verify.not.hasClass(
      "#shuffle",
      "control-btn-toggled",
      "Le bouton Shuffle n'a pas la classe 'control-btn-toggled initialement"
    );
    browser
      .click("#shuffle")
      .verify.hasClass(
        "#shuffle",
        "control-btn-toggled",
        "Le bouton Shuffle a la classe 'control-btn-toggled après avoir été activé"
      );
    browser
      .click("#shuffle")
      .verify.not.hasClass(
        "#shuffle",
        "control-btn-toggled",
        "Le bouton Shuffle n'a pas la classe 'control-btn-toggled après avoir été désactivé"
      );
  });
});

function validatePage(browser, index) {
  browser.url(`http://localhost:5000/playlist.html?id=${index}`).execute(
    () => Object.assign({}, localStorage),
    [],
    (result) => {
      EXPECTED_PLAYLIST = JSON.parse(result.value.playlist).find(
        (x) => x.id === index
      );
      EXPECTED_SONGS = getSongsFromPlaylist(
        EXPECTED_PLAYLIST,
        JSON.parse(result.value.songs)
      );
      validateHeader(browser, EXPECTED_PLAYLIST);
      validateSongs(browser, EXPECTED_SONGS);
    }
  );
}

function validateHeader(browser, playlist) {
  browser.verify.attributeContains(
    "header#playlist-header > img",
    "src",
    playlist.thumbnail,
    `La source du l'image présent dans le header doit être ${playlist.thumbnail}`
  );

  browser.verify.textEquals(
    "#playlist-title",
    `${playlist.name}`,
    `Le nom de la playlist est ${playlist.name}`
  );
}

function validateSongs(browser, songs) {
  browser.elements(
    "css selector",
    ".song-item p:first-of-type",
    function (result) {
      result.value.forEach(function (v, i) {
        const elementID = v[Object.keys(v)[0]];
        browser.elementIdText(elementID, function (result) {
          browser.verify.ok(
            result.value === songs[i].name,
            `Le nom de la chanson #${i + 1} doit être ${songs[i].name}.`
          );
        });
      });
    }
  );
  browser.elements(
    "css selector",
    ".song-item p:nth-of-type(2)",
    function (result) {
      result.value.forEach(function (v, i) {
        const elementID = v[Object.keys(v)[0]];
        browser.elementIdText(elementID, function (result) {
          browser.verify.ok(
            result.value === songs[i].genre,
            `Le genre de la chanson #${i + 1} doit être ${songs[i].genre}.`
          );
        });
      });
    }
  );
  browser.elements(
    "css selector",
    ".song-item p:nth-of-type(3)",
    function (result) {
      result.value.forEach(function (v, i) {
        const elementID = v[Object.keys(v)[0]];
        browser.elementIdText(elementID, function (result) {
          browser.verify.ok(
            result.value === songs[i].artist,
            `Le nom de l'artiste de la chanson #${i + 1} doit être ${
              songs[i].artist
            }.`
          );
        });
      });
    }
  );
}

describe("Validation des playlist de base", () => {
  it("validation de la playlist #0", (browser) => {
    validatePage(browser, "0");
  });
  it("validation de la playlist #1", (browser) => {
    validatePage(browser, "1");
  });
  it("validation de la playlist #2", (browser) => {
    validatePage(browser, "2");
  });
});
