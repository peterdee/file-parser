const createDocument = require('./create-document');
const runParsing = require('./parser');

const path = process.argv[2];

(async function run() {
  const filePaths = await runParsing(path);

  return createDocument(filePaths, path);
}());
