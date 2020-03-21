const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const mkdirAsync = promisify(fs.mkdir);
const copyFileAsync = promisify(fs.copyFile);

let initialDir = process.argv[2];
let destinationDir = process.argv[3];
const removeInit = process.argv[4] === 'rmd';

const expansions = ['.mp3'];

if (!initialDir || !destinationDir) {
  console.error('Не указанна начальная и конечная папка');
  process.exit(1);
} else {
  initialDir = path.join(__dirname, initialDir);
  destinationDir = path.join(__dirname, destinationDir);
}

if (!fs.existsSync(destinationDir)) {
  fs.mkdir(destinationDir, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    main();
  });
} else {
  main();
}

function main () {
  let count = 0;

  const rmInitDir = dirPath => {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(point => {
        const entryPoint = path.join(dirPath, point);
        if (fs.statSync(entryPoint).isDirectory()) {
          rmInitDir(entryPoint);
        } else {
          fs.unlinkSync(entryPoint);
        }
      });
    }
    fs.rmdirSync(dirPath);
  };

  const countsFiles = async base => {
    try {
      const files = await readDirAsync(base);
      files.forEach(item => {
        const internalDir = path.join(base, item);
        const state = fs.statSync(internalDir);
        if (state.isFile() && expansions.indexOf(path.extname(internalDir)) !== -1) {
          count += 1;
        } else if (state.isDirectory()) {
          countsFiles(internalDir);
        }
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  const iterateDir = async base => {
    try {
      const files = await readDirAsync(base);
      files.forEach(async item => {
        try {
          const stats = await statAsync(path.join(base, item));
          if (stats.isDirectory()) {
            iterateDir(path.join(base, item));
          } else {
            const newDir = path.join(destinationDir, item.charAt(0).toUpperCase());
            if (expansions.indexOf(path.extname(item)) !== -1) {
              if (!fs.existsSync(newDir)) {
                await mkdirAsync(newDir);
              }
              await copyFileAsync(path.join(base, item), path.join(newDir, item));
              count -= 1;
              if (removeInit && count === 0) {
                rmInitDir(initialDir);
              }
            }
          }
        } catch (err) {
          console.error(err);
          process.exit(1);
        }
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  countsFiles(initialDir);
  iterateDir(initialDir);
}
