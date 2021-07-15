const {
  Document,
  Packer,
  Paragraph,
  TextRun,
} = require('docx');
const { readFile, writeFile } = require('fs/promises');

const { normalizePath } = require('./utilities');

/**
 * Create a DOCX document
 * @param {string[]} paths - paths to the files that should be included in the document
 * @param {string} initialPath - initial provided path
 * @returns {Promise<void | Error>}
 */
const createDocument = async (paths = [], initialPath = '') => {
  try {
    const paragraphs = [];

    const normalizedInitialPath = normalizePath(initialPath);
    const [root] = normalizedInitialPath.split('/').slice(-1);

    /* eslint-disable-next-line */
    for await (let path of paths) {
      const fileData = await readFile(path, { encoding: 'utf8' });
      const pathText = `~/${path.substring(path.indexOf(root), path.length)}`;

      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            bold: true,
            size: 14,
            text: `// ${pathText}`,
          }),
          new TextRun({
            break: 2,
            size: 12,
            text: fileData,
          }),
        ],
      }));
    }

    const document = new Document({
      sections: [{
        children: [
          ...paragraphs,
        ],
      }],
    });

    const string = await Packer.toBuffer(document);
    return writeFile(`${process.cwd()}/Result.docx`, string);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = createDocument;
