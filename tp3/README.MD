# TP3

Le but de ce travail pratique est de vous familiariser avec les tests unitaires et la validation et vérification de code JS à l'aide de la librairie `Jest`. Plus particulièrement, vous allez écrire les tests unitaires pour une version modifiée du TP2 ainsi que quelques nouvelles fonctionnalités ajoutées pour ce travail.ous pourrez aussi continuer à vous familiariser avec l’exécution de test de bout en bout avec la librairie `Nightwatch`.

Pour ce TP, le site web et ses tests unitaires ont été placés dans un projet différent (répertoire `site-web`) que les tests de bout en bout avec `Nightwatch` (répertoire `nightwatch`).

## Installation des librairies nécessaires

Pour pouvoir avoir les librairies nécessaires pour le TP, vous aurez besoin de l'environnement d'exécution NodeJS et le gestionnaire de paquet npm. Vous pouvez les installer sur votre machine à partir du [lien suivant](https://nodejs.org/en/download/). On vous recommande d'installer la version _LTS_.

Pour installer les dépendances nécessaires, lancez la commande `npm ci` dans les répertoires `site-web` et `nightwatch`. Ceci installera toutes les librairies définies dans le fichier `package-lock.json`. Vous pouvez par la suite utiliser les libraires de test et les scripts définis dans le même fichier.

## Nightwatch sur Windows, Linux et macOS.

Pour faire fonctionner les tests Nightwatch sur Linux, vous devez simplement changer le "server_path" du "webdriver" à la ligne 11 du fichier nightwatch.json. Normalement, le path du chromedriver sur Linux devrait être: `node_modules/.bin/chromedriver`. Pour MacOs, il faut changer le même path pour: `node_modules/chromedriver/lib/chromedriver/chromedriver`. Pour le Windows, le path est `node_modules/chromedriver/lib/chromedriver/chromedriver.exe`.

La version du module `chromedriver` doit correspondre à la version de Chrome de votre machine. Par défaut, la version est **105**. Vous devez mettre à jour votre version de Chrome si elle n'est pas à jour avec **105** ou modifier la version dans `package.json` et relancer `npm install` si votre version de Chrome est supérieure à **105**.

## Exécution des tests

### Tests de bout en bout avec Nightwatch
Vous pouvez exécuter les tests automatisés avec la commande `npm run e2e` dans le répertoire `nightwatch`. Ceci exécutera les tests et produire un rapport dans votre terminal.

**Note** : comme le travail utilise les modules ES (**ESM**), les tests automatisés doivent être exécutés sur des pages Web servies par un vrai serveur HTTP. Vous devez avoir un serveur actif avant de pouvoir exécuter vos tests. Lancez votre déploiement local dans un autre terminal avant d'exécuter vos tests.

### Tests de bout en bout avec Jest
Vous pouvez exécuter les tests unitaires automatisés avec la commande `npm test`. Ceci exécutera les tests et produira un rapport dans votre terminal.

Vous pouvez calculer la couverture du code avec la commande `npm run coverage`. Ceci produira un rapport dans votre terminal ainsi que dans le répertoire coverage.

## Déploiement local

Vous pouvez faire un déploiement local de votre site avec l'outil `lite-server`. Si vous lancez la commande `npm start` dans la racine du projet, un serveur HTTP statique sera déployé sur votre machine et votre site sera accessible sur l'adresse `localhost:5000` ou `<votre-adresse-IP>:5000`. La sortie dans le terminal vous donnera l'adresse exacte d'accès.

## Liste de chansons

Les fichiers des chansons initiales sont disponibles dans le répertoire `assets/media`. Les chansons sont libres de droits et obtenues du site [pixabay](https://pixabay.com/music/). Vous pouvez ajouter des chansons supplémentaires à votre remise si vous voulez en vous assurant de mettre à jour l'information des chansons dans le fichier `songs.js` dans le répertoire `assets/js`.

# Correction

| **Exigences**                                     | **Note** | **Points** |
| ------------------------------------------------- | :------: | :--------: |
| Recherche dans la bibliothèque                    |    3     |     3      |
| Tests dans _library.test.js_                      |    2     |     2      |
| Tests dans _player.test.js_                       |    3     |     3      |
| Tests dans _playlist\_editor.test.js_             |    3     |     3      |
| Tests dans _playlist.test.js_                     |    4     |     4      |
| Tests dans _storageManager.test.js_               |    2     |     2      |
| Structure du code                                 |    1     |     1      |
| Qualité et clarté du code                         |    2     |     2      |
| **Total**                                         | **20**    |   **20**   |

- Recherche dans la bibliothèque  
  - tres bien
- Code dans _library.test.js_
  - tres bien
- code dans _playlist.test.js_
  - tres bien
- Code dans _player.test.js_
  - tres bien
- Code dans _playlist_editor.test.js_
  - tres bien
- Code dans _storageManager.test.js_
  - tres bien
- Structure du code
  - tres bien
- Qualité et clarté du code
  - tres bien 

