# TP5

Le but de ce travail pratique est de vous familiariser avec le développement d'une application web full stack utilisant une base de données pour assurer la persistance des données. Pour ce faire, vous utiliserez la librairie React pour le côté client et vous vous connecterez à une base de données MongoDB à partir d'un environnement NodeJS/Express pour le côté serveur.

## Structure du projet

Pour ce travail pratique, le code source contient deux applications distinctes, soit une application ReactJS côté client (répertoire `client`) ainsi qu'une application NodeJS/Express côté serveur (répertoire `site-web`). L'application React est constituée de composantes qui se retrouvent dans les répertoires `components` et `pages`. Les fichiers statiques tels que la page HTML de base se trouve dans `/public`. Au lancement de l'application, c'est le fichier `index.jsx` qui sera exécuté.

Le serveur, pour sa part, comprend des contrôleurs, des services et des données par défaut que vous pourrez retrouver dans `server/controllers`, `server/services` et `server/data`. C'est le fichier `server.js` qui sera exécuté au lancement du serveur.

## Configuration de la base de données

Vous devez configurer une instance MongoDB pour la persistance de vos données. Vous devez utiliser le service [Cloud Atlas](https://www.mongodb.com/cloud/atlas) qui permet d'héberger des instances d'une taille de 512 MB gratuitement.

Vous devez configurer votre instance avant de pouvoir effectuer le travail demandé. Un guide pour la configuration d'instances MongoDB avec Cloud Atlas est disponible sur le projet [GitHub du cours](https://github.com/LOG2440/Cours-11-MongoDB/blob/master/README.MD) de l'exemple sur MongoDB présenté en classe.

## Installation des librairies nécessaires

Pour pouvoir installer les librairies nécessaires pour le TP, vous aurez besoin de l'environnement d'exécution NodeJS et le gestionnaire de paquet npm. Vous pouvez les installer sur votre machine à partir du [lien suivant](https://nodejs.org/en/download/). On vous recommande d'installer la version _LTS_.

Pour installer les dépendances nécessaires, lancez la commande `npm ci` dans la racine de chaque application (et donc deux fois au total). Ceci installera toutes les librairies définies dans le fichier `package-lock.json`. Vous pouvez par la suite utiliser les libraires de test (pour le serveur) et les scripts définis dans le même fichier.

## Déploiement local

Lors du développement, vous pouvez faire un déploiement local de votre application ReactJS et de votre serveur Express avec la commande `npm start`. Notez bien qu'il faut exécuter la commande à la racine de chaque application (dans `/site-web` et `/server`) dans deux consoles distinctes afin que les deux fonctionnent en parallèle.

L'application React sera lancée à l'adresse `localhost:5010` (ou `<votre-adresse IP>:5010`) et vous pourrez donc visualiser votre site web à cette même adresse. Le serveur sera déployé à l'adresse `localhost:5020` et commencera à écouter le port 5020.

## Exécution des tests

Le code source du serveur est accompagné d'une série de tests qui permettent de vérifier les interactions entre votre serveur et une instance MongoDB. Le code source des tests est disponible dans le répertoire `server/tests`.

Les tests unitaires utilisent la librairie _Jest_ que vous avez utilisée tout au long de la session. La librairie _MongoMemoryServer_ est utilisée pour remplacer une vraie instance de MongoDB par une instance _mocked_ pour les tests. Il est très important de se connecter à une base de données locale et contrôlée et non à votre instance MongoDB déployée en mode **production** pendant vos tests.

Vous êtes fortement encouragés de consulter les tests fournis. Ils vous aideront à mieux comprendre le travail à faire et le bon comportement du serveur.

Vous pouvez exécuter les tests unitaires automatisés avec la commande `npm test`. Ceci exécutera les tests et produira un rapport dans votre terminal.

Auncun test n'est fourni pour le côté client de votre site web dans le cadre de ce travail pratique. Nous vous recommandons de tester manuellement les différentes fonctionnalités pour vous assurer de leur bon fonctionnement et vérifier que chaque élément UI de votre page web se situe au bon endroit et est inchangé depuis le dernier travail pratique.

## Liste de chansons

Les fichiers des chansons initiales sont disponibles dans le répertoire `assets/media`. Les chansons sont libres de droits et obtenues du site [pixabay](https://pixabay.com/music/). Vous pouvez ajouter des chansons supplémentaires à votre remise si vous voulez en vous assurant de mettre à jour l'information des chansons dans le fichier `songs.json` dans le répertoire `data` de votre serveur.

# Correction

| **Exigences**                                 | **Note** | **Points** |
| --------------------------------------------- | :------: | :--------: |
| Implémentation des services du serveur        |    6     |     6      |
| Implémentation des composantes de pages React |    5     |     5      |
| Implémentation des autres composantes React   |    5     |     5      |
| Structure du code                             |    2     |     2      |
| Qualité et clarté du code                     |    2     |     2      |
| **Total**                                     |  **20**  |   **20**   |

- Implémentation des services du serveur
  - tres bien
- Implémentation des composantes de pages React
  - tres bien
- Implémentation des autres composantes React
  - tres bien
- Structure du code
  - tres bien
- Qualité et clarté du code
  - tres bien
