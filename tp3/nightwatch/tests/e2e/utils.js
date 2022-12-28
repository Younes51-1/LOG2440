'use strict';

const self = {};
let currentWorkingDirectory = undefined;

/**
 * Gets the working directory.
 *
 * @return {string}   The working directory.
 */
self.getWorkingDirectory = function () {
  if (!currentWorkingDirectory) {
    currentWorkingDirectory = process.cwd();
  }
  return currentWorkingDirectory;
};

/**
 * Gets the file path of a HTML file.
 *
 * @param fileName    The file name ot use.
 * @return {string}   The file path of the file.
 */
self.getFilePath = function (fileName) {
  return self.getWorkingDirectory() + '/src/' + fileName;
};

/**
 * Gets the URL of the file name.
 *
 * @param fileName    The file name to use.
 * @return {string}   The URL of the file.
 */
self.getUrl = function (fileName) {
  return 'file://' + self.getFilePath(fileName);
};

module.exports = self;
