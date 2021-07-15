/**
 * Get file name
 * @param {string} path - file path or file name
 * @returns {null | string}
 */
const getFileName = (path = '') => {
  if (!path) {
    return null;
  }

  const [fileName] = path.split('/').slice(-1);
  if (!(fileName && fileName.includes('.'))) {
    return null;
  }

  const partials = fileName.split('.');
  if (partials[0] === '' && partials.length === 2) {
    return null;
  }

  return fileName;
};

/**
 * Get file extension
 * @param {string} path - file path or file name
 * @returns {null | string}
 */
const getFileExtension = (path = '') => {
  const fileName = getFileName(path);
  if (!fileName) {
    return null;
  }

  return fileName.split('.').slice(-1)[0];
};

/**
 * Normalize provided path
 * @param {string} path - path string
 * @returns {string}
 */
const normalizePath = (path = '') => {
  if (!path) {
    throw new Error('Path not provided!');
  }

  return path.slice(-1)[0] === '/'
    ? path.slice(0, path.length - 1)
    : path;
};
/**
 * Check if string starts with the dot
 * @param {string} string - a string to check
 * @returns {boolean}
 */
const startsWithDot = (string = '') => {
  if (!string) {
    throw new Error('Invalid string argument!');
  }

  return string[0] === '.';
};

module.exports = {
  getFileExtension,
  getFileName,
  normalizePath,
  startsWithDot,
};
