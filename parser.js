const fs = require('fs/promises');

const configuration = require('./configuration');
const {
  getFileExtension,
  normalizePath,
  startsWithDot,
} = require('./utilities');

/**
 * Parse directories recursively to get files
 * @param {string[]} directories - array of paths to the directories
 * @param {string[]} results - array of results
 * @returns {Promise<string[] | Error>}
 */
const parseDirectoriesRecursively = async (
  directories = [],
  results = [],
) => {
  try {
    if (!(Array.isArray(directories) && directories.length > 0)) {
      return results;
    }

    const [target, ...rest] = directories;
    const contents = await fs.readdir(target);
    if (contents.length === 0) {
      if (rest.length > 0) {
        return parseDirectoriesRecursively(rest, results);
      }
      return results;
    }

    const filteredContents = contents.filter((item) => !startsWithDot(item));
    const stats = await Promise.all(
      filteredContents.map((item) => fs.stat(`${target}/${item}`)),
    );

    const files = [];
    const updatedDirectories = stats.reduce(
      (array, item, i) => {
        const path = `${target}/${filteredContents[i]}`;
        if (item.isFile()) {
          const extension = getFileExtension(path);
          if (extension && configuration.IGNORED_EXTENSIONS.includes(extension.toLowerCase())) {
            return array;
          }

          files.push(path);

          return array;
        }
        if (item.isDirectory()) {
          array.push(path);
        }
        return array;
      },
      [],
    );

    return parseDirectoriesRecursively(
      [...rest, ...updatedDirectories],
      [...results, ...files],
    );
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Run parsing
 * @param {string} initialPath - initial path for the root directory
 * @returns {Promise<string[] | Error>}
 */
const runParsing = async (initialPath = '') => {
  if (!initialPath) {
    throw new Error('Please provide the path to the project file or directory!');
  }

  try {
    try {
      await fs.access(initialPath);
    } catch {
      throw new Error('Cannot access the provided path!');
    }

    const stats = await fs.stat(initialPath);
    if (stats.isFile()) {
      return [initialPath];
    }

    if (!stats.isDirectory()) {
      throw new Error('Provided path is not a directory or file!');
    }

    const contents = await fs.readdir(initialPath);
    const filteredContents = contents.filter((item) => !startsWithDot(item));
    if (filteredContents.length === 0) {
      return [];
    }

    const normalizedInitialPath = normalizePath(initialPath);
    const filteredContentsStats = await Promise.all(
      filteredContents.map((item) => fs.stat(`${normalizedInitialPath}/${item}`)),
    );

    const files = [];
    const directories = filteredContentsStats.reduce(
      (array, item, i) => {
        if (item.isFile()) {
          const extension = getFileExtension(filteredContents[i]);
          if (extension && configuration.IGNORED_EXTENSIONS.includes(extension.toLowerCase())) {
            return array;
          }

          if (configuration.IGNORED_FILES.includes(filteredContents[i])) {
            return array;
          }

          files.push(`${normalizedInitialPath}/${filteredContents[i]}`);
          return array;
        }

        if (item.isDirectory()) {
          if (configuration.IGNORED_DIRECTORIES.includes(filteredContents[i])) {
            return array;
          }

          array.push(`${normalizedInitialPath}/${filteredContents[i]}`);
        }

        return array;
      },
      [],
    );

    if (directories.length > 0) {
      const parsedResults = await parseDirectoriesRecursively(directories);
      if (parsedResults.length > 0) {
        files.push(...parsedResults);
      }
    }

    return files;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = runParsing;
