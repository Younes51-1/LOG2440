const shared = require("./shared");

let EXPECTED_PLAYLISTS = [];
let EXPECTED_SONGS = [];

describe("Page principale", () => {
  before((browser) => {
    browser.url("http://localhost:5000/index.html").execute(
      () => Object.assign({}, localStorage),
      [],
      (result) => {
        EXPECTED_PLAYLISTS = JSON.parse(result.value.playlist);
        EXPECTED_SONGS = JSON.parse(result.value.songs);
      }
    );
  });

  after((browser) => {
    browser.end();
  });

  test("Structure de la page principale", (browser) => {
    shared.validateHeader(browser);
    browser.log("\n===== Contenu principal =====");
    browser.verify.elementPresent(
      "header + main",
      "L'élément 'main' est présent sur la page."
    );
    browser.verify.attributeContains(
      "main",
      "id",
      "main-area",
      "L'élément 'main' a l'id 'main-area'"
    );
    browser.verify.hasClass(
      "main",
      "flex-column",
      "L'élément 'main' a la classe 'flex-column'"
    );
    browser.elements("css selector", "main > div", (result) => {
      browser.verify.equal(
        result.value.length,
        3,
        "Le contenu principal doit contenir 3 éléments div"
      );
    });
    shared.validateFooter(browser);
  });

  test("Tests de la barre de recherche", (browser) => {
    browser.log("\n===== Barre de recherche =====");
    browser.verify.elementPresent(
      "main div#search-bar",
      "Un conteneur pour la barre de recherche est présent sur la page."
    );
    browser.verify.elementPresent(
      "#search-bar form#search-form",
      "La barre de recherche est un formulaire avec id 'search-form'."
    );
    browser.verify.hasClass(
      "#search-bar form#search-form",
      "flex-row",
      "Le formulaire a la classe 'flex-row'"
    );
    browser.verify.elementPresent(
      "input#search-input",
      "La barre de recherche est un input avec id 'search-input'."
    );
    browser.verify.attributeContains(
      "input#search-input",
      "type",
      "text",
      "La barre de recherche est de type 'text'"
    );
    browser.verify.elementPresent(
      "form#search-form button",
      "La barre de recherche contient un bouton"
    );
    browser.verify.hasClass(
      "form#search-form button",
      "fa fa-2x fa-search",
      "Le bouton a les classes 'fa fa-2x fa-search'"
    );
    browser.verify.attributeContains(
      "form#search-form button",
      "type",
      "submit",
      "Le bouton de recherche est de type 'submit'"
    );
  });

  test("Tests de la liste de playlists", (browser) => {
    browser.log("\n===== Liste de play lists =====");
    browser.verify.elementPresent(
      "main div#playlist-list",
      "Un liste de playlists est présent sur la page."
    );
    browser.verify.elementPresent(
      "div#playlist-list h1",
      "La listee de playlists contient un titre."
    );
    browser.verify.elementPresent(
      "section#playlist-container",
      "Un conteneur pour les playlists est présent sur la page."
    );

    browser.verify.hasClass(
      "a.playlist-item",
      "flex-column",
      "Chaque playlist a la classe 'flex-column'"
    );

    browser.elements("css selector", "a.playlist-item", function (result) {
      browser.verify.equal(
        result.value.length,
        EXPECTED_PLAYLISTS.length,
        `Il doit avoir ${EXPECTED_PLAYLISTS.length} playlists dans une balise <a>.`
      );
      result.value.forEach(function (v, i) {
        const elementID = v[Object.keys(v)[0]];
        browser.elementIdAttribute(elementID, "href", function (result) {
          browser.verify.ok(
            result.value === `./playlist.html?id=${EXPECTED_PLAYLISTS[i].id}`,
            `Le lien de navigation de la playlist #${
              i + 1
            } doit être playlist.html?id=.`
          );
        });
      });
    });

    browser.elements(
      "css selector",
      ".playlist-item p:first-of-type",
      function (result) {
        result.value.forEach(function (v, i) {
          const elementID = v[Object.keys(v)[0]];
          browser.elementIdText(elementID, function (result) {
            browser.verify.ok(
              result.value === EXPECTED_PLAYLISTS[i].name,
              `Le titre de playlist #${i + 1} doit être ${
                EXPECTED_PLAYLISTS[i].name
              }.`
            );
          });
        });
      }
    );

    browser.elements(
      "css selector",
      ".playlist-item p:last-of-type",
      function (result) {
        result.value.forEach(function (v, i) {
          const elementID = v[Object.keys(v)[0]];
          browser.elementIdText(elementID, function (result) {
            browser.verify.ok(
              result.value === EXPECTED_PLAYLISTS[i].description,
              `La description de playlist #${i + 1} doit être ${
                EXPECTED_PLAYLISTS[i].description
              }.`
            );
          });
        });
      }
    );

    browser.elements(
      "css selector",
      ".playlist-item div.playlist-preview img",
      function (result) {
        result.value.forEach(function (v, i) {
          const elementID = v[Object.keys(v)[0]];
          browser.elementIdAttribute(elementID, "src", function (result) {
            browser.verify.ok(
              result.value === EXPECTED_PLAYLISTS[i].thumbnail,
              `L'image de prévisualisation doit être ${EXPECTED_PLAYLISTS[i].thumbnail}`
            );
          });
        });
      }
    );

    browser.elements("css selector", ".playlist-preview i", (result) => {
      browser.verify.equal(
        result.value.length,
        3,
        "Chaque playlist doit contenir une icone"
      );
    });

    browser.verify.hasClass(
      ".playlist-preview i",
      "fa fa-2x fa-play-circle hidden playlist-play-icon",
      "Chaque icone a les classes 'fa fa-2x fa-play-circle hidden playlist-play-icon'"
    );
  });

  test("Modification de l'affichage en bas de 800px", (browser) => {
    browser.setWindowSize(602, 577);
    browser.getCssProperty(
      ".playlist-container",
      "grid-template-columns",
      function (result) {
        browser.verify.equal(
          result.value.split(" ").length,
          2,
          "Il y a 2 colonnes pour le tableau de playlists en bas de 800px"
        );
      }
    );
  });

  test("Tests de la liste de chansons", (browser) => {
    browser.log("\n===== Liste de chansons =====");

    browser.verify.elementPresent(
      "main div#songs-list",
      "Un conteneur pour les chansons est présent sur la page."
    );
    browser.verify.hasClass(
      "#song-container",
      "flex-column",
      "Le conteneur a la classe 'flex-column'"
    );

    browser.verify.elementsCount(
      ".song-item",
      EXPECTED_SONGS.length,
      `Il doit avoir ${EXPECTED_SONGS.length} chansons.`
    );

    browser.verify.hasClass(
      ".song-item",
      "flex-row",
      "Chaque chanson a la classe 'flex-row'"
    );

    browser.elements(
      "css selector",
      ".song-item p:first-of-type",
      function (result) {
        result.value.forEach(function (v, i) {
          const elementID = v[Object.keys(v)[0]];
          browser.elementIdText(elementID, function (result) {
            browser.verify.ok(
              result.value === EXPECTED_SONGS[i].name,
              `Le titre de chanson #${i + 1} doit être ${
                EXPECTED_SONGS[i].name
              }.`
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
              result.value === EXPECTED_SONGS[i].genre,
              `Le genre de chanson #${i + 1} doit être ${
                EXPECTED_SONGS[i].genre
              }.`
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
              result.value === EXPECTED_SONGS[i].artist,
              `L'artiste de chanson #${i + 1} doit être ${
                EXPECTED_SONGS[i].artist
              }.`
            );
          });
        });
      }
    );

    browser.verify.hasClass(
      ".song-item button",
      "fa-heart",
      "Les boutons d'aimer ont tous la classe 'fa-hert'"
    );
    browser.elements("css selector", ".song-item button", function (result) {
      result.value.forEach(function (v, i) {
        const elementID = v[Object.keys(v)[0]];
        browser.elementIdAttribute(elementID, "class", function (result) {
          browser.verify.ok(
            result.value.includes("fa-regular") !== EXPECTED_SONGS[i].liked,
            `La chanson #${i + 1} doit être ${
              EXPECTED_SONGS[i].liked ? "aimée" : "non-aimée"
            }.`
          );
        });
      });
    });
  });
});
