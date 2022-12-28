module.exports = {
  validateHeader: function (browser) {
    const EXPECTED_LINKS = [
      { name: 'Ma Bibliothèque', link: 'index.html' },
      { name: 'Créer Playlist', link: 'create_playlist.html' },
      { name: 'À Propos', link: 'about.html' },
    ];
    browser.log('\n===== Entête =====');
    browser.verify.elementPresent('header', "L'entête existe sur la page.");
    browser.verify.elementPresent(
      'header nav',
      "Le menu de navigation existe dans l'entête.",
    );
    browser.verify.attributeContains(
      'nav',
      'id',
      'nav-bar',
      "Le menu de navigation a l'id 'nav-bar'",
    );
    browser.verify.hasClass(
      'nav',
      'flex-column',
      "Le menu de navigation a la classe 'flex-column'",
    );
    browser.verify.elementPresent(
      'nav ul',
      'Le menu de navigation contient une liste.',
    );
    browser.verify.hasClass(
      'nav ul',
      'flex-column',
      "La liste a la classe 'flex-column'",
    );

    // Validation des liens
    browser.elements('css selector', 'header nav a', function (result) {
      browser.verify.equal(
        result.value.length,
        EXPECTED_LINKS.length,
        `Le menu de navigation doit comporter ${EXPECTED_LINKS.length} liens.`,
      );
      result.value.forEach(function (v, i) {
        const elementID = v[Object.keys(v)[0]];
        // Validation des icones
        browser.elementIdElement(elementID, 'css selector', 'i', (icon) => {
          browser.verify.ok(icon.status !== -1, 'Le lien possède une icone');
        });
        // Validation du texte
        browser.elementIdText(elementID, function (result) {
          browser.verify.ok(
            result.value.toLowerCase() === EXPECTED_LINKS[i].name.toLowerCase(),
            `Le nom du lien de navigation #${i + 1} doit être '${
              EXPECTED_LINKS[i].name
            }'.`,
          );
        });
        // Validation des liens href
        browser.elementIdAttribute(elementID, 'href', function (result) {
          browser.verify.ok(
            result.value.indexOf(EXPECTED_LINKS[i].link) !== -1,
            `Le lien de navigation #${i + 1} doit être '${
              EXPECTED_LINKS[i].link
            }'.`,
          );
        });
      });
    });
    browser.log('\n===== FIN Entête =====');
  },

  validateFooter: function (browser) {
    browser.log('\n===== Pied de page =====');
    browser.verify.elementPresent('footer', 'Le pied de page existe.');
    browser.verify.attributeContains(
      'footer',
      'id',
      'playing-bar',
      "L'élément 'footer' a l'id 'playing-bar'",
    );
    browser.elements('css selector', 'div#creators p', (result) => {
      browser.verify.equal(
        result.value.length,
        2,
        'Le pied de page doit contenir 2 noms',
      );
      result.value.forEach((v, i) => {
        const elementID = v[Object.keys(v)[0]];
        browser.elementIdText(elementID, function (result) {
          browser.verify.ok(
            result !== '',
            `Le nom de coéquipier ${i + 1} n'est pas vide`,
          );
        });
      });
    });
    browser.log('\n===== FIN Pied de page =====');
  },
};
