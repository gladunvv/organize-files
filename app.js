const fs = require('fs');
const path = require('path');

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
    await fs.readdir(base, (err, files) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      files.forEach(item => {
        const internalDir = path.join(base, item);
        const state = fs.statSync(internalDir);
        if (state.isFile() && expansions.indexOf(path.extname(internalDir)) !== -1) {
          count += 1;
        } else if (state.isDirectory()) {
          countsFiles(internalDir);
        }
      });
    });
  };

  const iterateDir = async base => {
    await fs.readdir(base, (err, files) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      files.forEach(item => {
        fs.stat(path.join(base, item), async (err, stats) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          if (stats.isDirectory()) {
            iterateDir(path.join(base, item));
          } else {
            const newDir = path.join(destinationDir, item.charAt(0).toUpperCase());
            if (expansions.indexOf(path.extname(item)) !== -1) {
              if (!fs.existsSync(newDir)) {
                await fs.mkdir(newDir, err => {
                  if (err) {
                    console.error(err);
                    process.exit(1);
                  }
                });
              }
              await fs.copyFile(path.join(base, item), path.join(newDir, item), err => {
                if (err) {
                  console.error(err);
                }
                count -= 1;
                if (removeInit && count === 0) {
                  rmInitDir(initialDir);
                }
              });
            }
          }
        });
      });
    });
  };

  countsFiles(initialDir);
  iterateDir(initialDir);
}
