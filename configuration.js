const IGNORED_DIRECTORIES = [
  'android',
  'ios',
  'node_modules',
];

const IGNORED_EXTENSIONS = [
  'eot',
  'gz',
  'ico',
  'jpeg',
  'jpg',
  'md',
  'png',
  'svg',
  'ttf',
  'woff',
  'woff2',
  'zip',
];

const IGNORED_FILES = [
  'package-lock.json',
  'yarn.lock',
];

module.exports = {
  IGNORED_DIRECTORIES,
  IGNORED_EXTENSIONS,
  IGNORED_FILES,
};
