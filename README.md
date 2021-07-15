## File parser

This application parses files from provided path and creates a `DOCX` file that contains text from all of the parsed files

Stack: [Node](https://nodejs.org), [DOCX](https://docx.js.org)

### Deploy

```shell script
git clone https://github.com/peterdee/file-parser
cd ./file-parser
nvm use 16
npm i
```

### Launch

In the project directory, run:

```shell script
npm start <PATH>
```

Replace `<PATH>` with a full path to the **target** directory

A file called `Result.docx` will be generated in the project directory

### Linting

```shell script
npm run lint
```

Using [ESLint](https://eslint.org)

### License

[MIT](LICENSE.md)
