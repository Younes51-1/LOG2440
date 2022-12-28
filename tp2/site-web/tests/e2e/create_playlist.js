const shared = require("./shared");

describe("Page de création de playlist", () => {
  before((browser) => {
    browser.url("http://localhost:5000/create_playlist.html");
  });

  after((browser) => {
    browser.end();
  });

  test("Structure de la page Créer une Playlist", (browser) => {
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
    browser.verify.elementPresent(
      "main form",
      "L'élément 'form' est présent à l'intérieur de l'élément 'main'"
    );
    browser.verify.attributeContains(
      "main form",
      "id",
      "playlist-form",
      "L'élément 'form' possède l'id 'playlist-form'"
    );
    browser.verify.hasClass(
      "main form",
      "form-group",
      "L'élément 'form' a la classe 'form-group'"
    );

    shared.validateFooter(browser);
  });

  test("Tests de l'information générale du playlist", (browser) => {
    browser.verify.elementPresent(
      "main form div#general-info",
      "L'élément 'div' avec l'id 'general-info' est présent dans le formulaire"
    );
    browser.verify.hasClass(
      "div#general-info",
      "flex-row",
      "L'élément div avec l'id 'general-info' a une classe 'flex-row'"
    );
    browser.verify.elementPresent(
      "main form div#general-info fieldset",
      "Un élément 'fieldset' se situe à l'intérieur du div qui contient l'id 'general-info'"
    );
    browser.verify.elementPresent(
      "fieldset legend",
      "Les 'fieldset' contiennent un élément 'legend'"
    );
    browser.elements(
      "css selector",
      "main form div#general-info fieldset div",
      (result) => {
        browser.verify.equal(
          result.value.length,
          3,
          "Le 'fieldset' doit contenir trois div"
        );
      }
    );
    browser.verify.hasClass(
      "fieldset div",
      "form-control flex-row",
      "Les éléments 'div' qui se situent à l'intérieur du 'fieldset' ont comme classes 'form-control flex-row'"
    );
    browser.verify.elementPresent(
      "fieldset div > label",
      "Chaque élément 'div' dans le premier fieldset doit contenir un label"
    );
    browser.elements(
      "css selector",
      "div#general-info fieldset div label",
      (result) => {
        browser.verify.equal(
          result.value.length,
          3,
          "Il doit y avoir un élément 'label' dans chaque élément 'div'"
        );
      }
    );
    browser.verify.attributeContains(
      "fieldset > legend + div > label",
      "for",
      "name",
      "description",
      "image",
      "Les éléments 'label' présent dans les divs 'label' doivent avoir comme attribut, en ordre, for='name', for='description' et for='image'"
    );

    browser.verify.elementPresent(
      "fieldset div > input#name",
      "Un élément 'input' doit avoir comme id 'name'"
    );

    browser.verify.attributeContains(
      "input#name",
      "type",
      "text",
      "L'élément 'input' utilisé pour déterminer le nom de la playlist est de type 'text'"
    );
    browser.verify.elementPresent(
      "fieldset div input#description",
      "Un élément 'input' doit avoir comme id 'description'"
    );
    browser.verify.attributeContains(
      "input#description",
      "type",
      "text",
      "L'élément 'input' utilisé pour déterminer la description de la playlist est de type 'text'"
    );
    browser.verify.elementPresent(
      "fieldset div input#image",
      "Un élément 'input' utilisé doit avoir comme id 'image'"
    );
    browser.verify.attributeContains(
      "input#image",
      "type",
      "file",
      "L'élément 'input' pour déterminer la description de la playlist est de type 'file'"
    );
    browser.verify.attributeContains(
      "input#image",
      "accept",
      "image/*",
      "L'élément 'input' ne doit accepter que les images"
    );
  });

  test("Tests de chansons à la playlist", (browser) => {
    browser.verify.elementPresent(
      "div#general-info + fieldset",
      "Un élément fieldset doit être présent après l'élément 'div' avec l'id 'general-info'"
    );

    browser.verify.elementPresent(
      "fieldset > datalist#song-dataList",
      "Un élément datalist doit être présent avec l'id 'song-dataList'"
    );
    browser.elements("css selector", "datalist option", (result) => {
      browser.verify.equal(
        result.value.length,
        5,
        "Il doit y avoir 5 éléments 'option' dans l'élément 'datalist'"
      );
    });

    browser.elements("css selector", "option", (result) => {
      const EXPECTED_SONGS = [
        "Whip",
        "Overflow",
        "Intrigue Fun",
        "Bounce",
        "Summer Pranks",
      ];
      browser.verify.equal(
        result.value.length,
        EXPECTED_SONGS.length,
        `Il doit avoir ${EXPECTED_SONGS.length} choix de chansons`
      );
      result.value.forEach(function (v, i) {
        const elementID = v[Object.keys(v)[0]];
        browser.elementIdAttribute(elementID, "value", function (result) {
          browser.verify.ok(
            result.value === EXPECTED_SONGS[i],
            `L'option #${i + 1} doit être ${EXPECTED_SONGS[i]}.`
          );
        });
      });
    });

    browser.verify.elementPresent(
      "datalist + button#add-song-btn",
      "Un élément 'bouton' avec l'id 'add-song-btn' doit être placé après la datalist"
    );
    browser.verify.hasClass(
      "datalist + button",
      "fa fa-plus",
      "Le bouton placé après l'élément 'datalist' doit avoir la classe 'fa fa-plus'"
    );
    browser.verify.elementPresent(
      "button#add-song-btn + div#song-list",
      "Un élément 'div' avec id 'song-list' doit être présent après le bouton avec l'id 'add-song-btn'"
    );
    browser.verify.elementPresent(
      "button#add-song-btn + div#song-list > div > label",
      "Un label doit être présent à l'intérieur du div mentionné précédemment"
    );
    browser.verify.attributeContains(
      "button#add-song-btn + div#song-list > div > label",
      "for",
      "song-1",
      "L'élément 'label' doit avoir un attribut 'for='song-1''"
    );
    browser.verify.elementPresent(
      "div#song-list > div > input#song-1",
      "Un élément 'input' doit être présent dans le div et son id doit être 'song-1'"
    );
    browser.verify.hasClass(
      "input#song-1",
      "song-input",
      "L'élément input doit avoir la classe 'song-input'"
    );
    browser.verify.attributeContains(
      "input#song-1",
      "type",
      "select",
      "L'élément 'input' doit avoir un attribut 'type' de catégorie 'select''"
    );
    browser.verify.attributeContains(
      "input#song-1",
      "list",
      "song-dataList",
      "L'élément 'input' doit avoir un attribut 'list' de catégorie 'song-dataList''"
    );
    browser.verify.elementPresent(
      "form#playlist-form > div#general-info + fieldset + input#playlist-submit",
      "Un élément 'input' doit être rajouté après le dernier élément fieldset"
    );
    browser.verify.attributeContains(
      "form#playlist-form > div#general-info + fieldset + input#playlist-submit",
      "type",
      "submit",
      "L'élément 'input' doit avoir un type 'submit'"
    );
    browser.verify.attributeContains(
      "form#playlist-form > div#general-info + fieldset + input#playlist-submit",
      "value",
      "Ajouter la playlist",
      "L'élément 'input' doit avoir comme value: 'Ajouter la playlist'"
    );
  });

  test("Tests d'attributs requis dans le formulaire", (browser) => {
    browser.verify.attributeEquals(
      "#name",
      "required",
      "true",
      "Le champ de nom est requis"
    );
    browser.verify.attributeEquals(
      "#description",
      "required",
      "true",
      "Le champ de description est requis"
    );
    browser.verify.attributeEquals(
      "#image",
      "required",
      "true",
      "Le champ d'image est requis"
    );
    browser.verify.attributeEquals(
      "#song-1",
      "required",
      "true",
      "Le champ de chanson est requis"
    );
  });

  test("Tests de remplissage de Formulaire", (browser) => {
    browser
      .click("#add-song-btn")
      .verify.elementsCount(
        "#song-list div",
        2,
        "Cliquer sur le bouton devrait rajouter un nouveau champ de saisie pour les chansons"
      );

    browser
      .setValue("#name", "Test Name")
      .setValue("#description", "Test Description")
      .setValue(
        "#image",
        require("path").resolve(__dirname + "../../../src/assets/img/rock.jpg")
      )
      .setValue("#song-1", "Whip")
      .click("#playlist-submit");
    browser.execute(
      () => Object.assign({}, localStorage),
      [],
      (result) => {
        EXPECTED_PLAYLISTS = JSON.parse(result.value.playlist);
        browser.verify.ok(
          EXPECTED_PLAYLISTS.length,
          4,
          "Une nouvelle playlist est ajoutée"
        );
      }
    );
  });
});
