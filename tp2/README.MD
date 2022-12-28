# TP2

Le but de ce travail pratique est de vous familiariser avec le langage **JavaScript** et la manipulation du **DOM**. Plus particulièrement, vous allez rendre le site web développé au TP1 dynamique. La liste des playlists et chansons dans la bibliothèque ainsi que la page d'information d'une playlist spécifique seront maintenant construites à travers du code JS. Chaque page de playlist sera remplie avec les chansons spécifiques de la playlist choisie. Le formulaire de création d'une playlist permettra de générer une nouvelle playliste ou en modifier une déjà existante. Vous pourrez aussi continuer à vous familiariser avec l’exécution de test de bout en bout avec la librairie Nightwatch.

## Installation des librairies nécessaires

Pour pouvoir les librairies nécessaires pour le TP, vous aurez besoin de l'environnement d'exécution NodeJS et le gestionnaire de paquet npm. Vous pouvez les installer sur votre machine à partir du [lien suivant](https://nodejs.org/en/download/). On vous recommande d'installer la version _LTS_.

Pour installer les dépendances nécessaires, lancez la commande `npm ci` dans le répertoire `site-web`. Ceci installera toutes les librairies définies dans le fichier `package.json`. Vous pouvez par la suite utiliser les libraires de test et les scripts définis dans le même fichier.

## Nightwatch sur Windows, Linux et macOS.

Pour faire fonctionner les tests Nightwatch sur Linux, vous devez simplement changer le "server_path" du "webdriver" à la ligne 11 du fichier nightwatch.json. Normalement, le path du chromedriver sur Linux devrait être: `node_modules/.bin/chromedriver`. Pour MacOs, il faut changer le même path pour: `node_modules/chromedriver/lib/chromedriver/chromedriver`. Pour le Windows, le path est `node_modules/chromedriver/lib/chromedriver/chromedriver.exe`.

La version du module `chromedriver` doit correspondre à la version de Chrome de votre machine. Par défaut, la version est **105**. Vous devez mettre à jour votre version de Chrome si elle n'est pas à jour avec **105** ou modifier la version dans `package.json` et relancer `npm install` si votre version de Chrome est supérieure à **105**.

## Exécution des tests

Vous pouvez exécuter les tests automatisés avec la commande `npm run e2e`. Ceci exécutera les tests et produire un rapport dans votre terminal.

**Note** : comme le travail utilise les modules ES (**ESM**), les tests automatisés doivent être exécutés sur des pages Web servies par un vrai serveur HTTP. Vous devez avoir un serveur actif avant de pouvoir exécuter vos tests. Lancez votre déploiement local dans un autre terminal avant d'exécuter vos tests.

## Déploiement local

Vous pouvez faire un déploiement local de votre site avec l'outil `lite-server`. Si vous lancez la commande `npm start` dans la racine du projet, un serveur HTTP statique sera déployé sur votre machine et votre site sera accessible sur l'adresse `localhost:5000` ou `<votre-adresse-IP>:5000`. La sortie dans le terminal vous donnera l'adresse exacte d'accès.

## Liste de chansons

Les fichiers des chansons initiales sont disponibles dans le répertoire `assets/media`. Les chansons sont libres de droits et obtenues du site [pixabay](https://pixabay.com/music/). Vous pouvez ajouter des chansons supplémentaires à votre remise si vous voulez en vous assurant de mettre à jour l'information des chansons dans le fichier `songs.js` dans le répertoire `assets/js`.

# Correction

| **Exigences**                  | **Note** | **Points** |
| ------------------------------ | :------: | :--------: |
| Code dans _storageManager.js_  |    2     |     2      |
| Code dans _library.js_         |    3     |     3      |
| Code dans _playlist.js_        |    4     |     4      |
| Code dans _player.js_          |    3     |     3      |
| Code dans _playlist_editor.js_ |    4     |     4      |
| Structure du code              |    2     |     2      |
| Qualité et clarté du code      |    2     |     2      |
| **Total**                      |  **20**  |   **20**   |

- Code dans _storageManager.js_
  - tres bien
- Code dans _library.js_
  - tres bien
- code dans _playlist.js_
  - tres bien
- Code dans _player.js_
  - tres bien
- Code dans _playlist_editor.js_
  - tres bien
- Structure du code
  - tres bien
- Qualité et clarté du code
  - tres bien
