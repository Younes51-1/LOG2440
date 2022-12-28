/* eslint-disable no-magic-numbers */

/**
 * Formate un temps en secondes dans le format MM:SS
 * @param {number} seconds temps en secondes
 * @returns {string} le temps formaté en MM:SS
 */
export function formatTime (seconds) {
  let minutes = Math.floor(seconds / 60);
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}

/**
 * Calcule x mod m et retourne toujours une valeur positive
 * @param {number} x Dividende
 * @param {number} m Diviseur
 * @returns {number} x mod m toujours positif
 */
export function modulo (x, m) {
  return ((x % m) + m) % m;
}

/**
 * Génère un identifiant de 'len' chiffres aléatoires
 * @param {number} len taille de l'id généré
 * @returns {string} id de taille 'len'
 */
export function generateRandomID (len = 10) {
  const hex = "0123456789";
  let output = "";
  for (let i = 0; i < len; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

/**
 * Calcule un nombre entier aléatoire entre min et max
 * @param {number} min valeur minimale possible
 * @param {number} max valeur maximale possible
 * @returns {number} valeur aléatoire entre min et max
 */
export function random (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
