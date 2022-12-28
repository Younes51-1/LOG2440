# TP4

Le but de ce travail pratique est de vous familiariser avec le concept de serveurs web dynamiques et la communication HTTP entre un site web (client) et un serveur. Plus particulièrement, vous allez compléter un serveur dynamique utilisant NodeJS et la librairie Express qui permet de gérer les playlists et les chansons de PolyPlay. Vous allez également mettre en place une communication entre le site web et le serveur pour la gestion de ces données.

## Déploiement local

Dans ce TP, vous avez **deux serveurs** à démarrer (`npm start`). Le premier est celui que vous avez eu l'habitude d'utiliser à date. C'est ce serveur qui va vous _servir_ la page HTML ainsi que les scripts du côté client. Le deuxième serveur que vous aurez à démarrer est celui qui servira de _back-end_ avec lequel vous communiquerez par HTTP pour ajouter, modifier ou bien créer de nouvelles playlists pour ne donner que ces exemples. Le code du deuxième serveur se trouve dans le répertoire `server` et peut également être démarré par la commande `npm start`.

En temps normal, le serveur dynamique se trouve sur l'adresse `http://localhost:5020` et votre serveur statique se trouve sur l'adresse `http://localhost:5000`.

## Séparation du projet

Le code source du serveur est disponible dans les répertoires `managers` et `routes` ainsi que le fichier `server.js` qui est le point d'entrée du logiciel. Le répertoire `routes` contient les 2 Router d'Express pour les fonctionnalités du serveur. Le répertoire `managers` contient les scripts qui gèrent la logique de la gestion des données sur le serveur.

L'information (songs et playlists) est sauvegardée sur la machine du serveur dans les 2 fichiers JSON du répertoire `data`. Ces fichiers serviront de "persistance" de l'information dans le cadre de ce TP.

## Installation des librairies nécessaires

Pour pouvoir avoir les librairies nécessaires pour le TP, vous aurez besoin de l'environnement d'exécution NodeJS et le gestionnaire de paquet npm. Vous pouvez les installer sur votre machine à partir du [lien suivant](https://nodejs.org/en/download/). On vous recommande d'installer la version _LTS_.

Pour installer les dépendances nécessaires, lancez la commande `npm ci` dans les répertoires `site-web`. Ceci installera toutes les librairies définies dans le fichier `package-lock.json`. Vous pouvez par la suite utiliser les libraires de test et les scripts définis dans le même fichier. **Il est important de refaire ce processus pour les dépendances de `server`**.

Notez que dans le cas du projet `server`, la dépendance à la librairie `Express` ne vous est pas fournie. Vous devez l'ajouter à travers la bonne commande d'installation d'npm. Consultez la présentation sur l'écosystème de NPM disponible sur [Moodle](https://moodle.polymtl.ca/pluginfile.php/1030574/mod_resource/content/7/npm.pdf). Vous devez ajouter et synchroniser les fichiers `package.json` et `package-lock.json` sur votre espace Git suite à cet ajout de dépendance.

## Exécution des tests

Vous pouvez exécuter les tests unitaires automatisés avec la commande `npm test`. Ceci exécutera les tests et produira un rapport dans votre terminal. Le côté _back-end_ ainsi que le côté client ont les deux leurs propres suites de tests que vous pouvez exécuter avec la commande de test.

Vous pouvez calculer la couverture du code avec la commande `npm run coverage`. Ceci produira un rapport dans votre terminal ainsi que dans le répertoire coverage. Notez que pour des raisons de limitations de la librairie `Jest`, certaines fonctions dans `playlist_editor.js` ne seront pas couvertes par des tests. Comme ce code vous est fourni, vous pouvez assumer qu'il fonctionne.

## Liste de chansons

Les fichiers des chansons initiales sont disponibles dans le répertoire `assets/media`. Les chansons sont libres de droits et obtenues du site [pixabay](https://pixabay.com/music/). Vous pouvez ajouter des chansons supplémentaires à votre remise si vous voulez en vous assurant de mettre à jour l'information des chansons dans le fichier `songs.js` dans le répertoire `data` de votre serveur.

# Correction

| **Exigences**                                      | **Note** | **Points** |
| -------------------------------------------------- | :------: | :--------: |
| Implémentation du Routeur `search_bar.js`          |    1     |     1      |
| Implémentation du Routeur `palylists.js`           |    3     |     3      |
| Implémentation du Routeur `songs.js`               |    2     |     2      |
| Implémentation `PlaylistsManager`                  |    3     |     3      |
| Implémentation de `SongsManager`                   |    2     |     2      |
| Implémentation de `HTTPManager` et son utilisation |    5     |     5      |
| Structure du code                                  |    2     |     2      |
| Qualité et clarté du code                          |    2     |     2      |
| **Total**                                          |  **20**  |   **20**   |

- Implémentation du Routeur `search_bar.js`
  - tres bien
- Implémentation du Routeur `palylists.js`
  - tres bien
- Implémentation du Routeur `songs.js`
  - tres bien
- Implémentation `PlaylistsManager`
  - tres bien
- Implémentation de `SongsManager`
  - tres bien
- Implémentation de `HTTPManager` et son utilisation
  - tres bien
- Structure du code
  - tres bien
- Qualité et clarté du code
  - tres bien
