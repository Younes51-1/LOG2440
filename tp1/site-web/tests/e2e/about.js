const utils = require('./utils');
const shared = require('./shared');

describe('Page à propos', () => {
  before((browser) => {
    browser.url(utils.getUrl('about.html'));
  });

  after((browser) => {
    browser.end();
  });
  test('Structure de la page à propos', (browser) => {
    shared.validateHeader(browser);
    browser.log('\n===== Contenu principal =====');
    browser.verify.elementPresent(
      'header + main',
      "L'élément 'main' est présent sur la page.",
    );
    browser.verify.attributeContains(
      'main',
      'id',
      'main-area',
      "L'élément 'main' a l'id 'main-area'",
    );
    browser.verify.hasClass(
      'main',
      'flex-column',
      "L'élément 'main' a la classe 'flex-column'",
    );
    browser.verify.elementPresent(
      'main section',
      'Une section est présente sur la page. ',
    );
    browser.verify.hasClass(
      'main section',
      'flex-column align-center',
      "L'élément 'section' a les classes 'flex-column' et 'align-center'",
    );
    browser.verify.elementPresent(
      'main section h1',
      'Un titre est présent sur la page.',
    );
    browser.verify.elementPresent(
      'main p',
      'Un paragraphe est présent sur la page.',
    );
    browser.verify.elementPresent(
      'section ul',
      'Une liste est présente sur la page.',
    );
    browser.elements('css selector', 'main ul li', (result) => {
      browser.verify.equal(
        result.value.length,
        6,
        'La liste doit contenir 6 raccourcis',
      );
    });
    shared.validateFooter(browser);
  });
});
