const fs = require('fs');
const path = require('path');

let initialDir = process.argv[2];
let destinationDir = process.argv[3];
let removeInit = process.argv[4] === 'rmd';


if (!initialDir || !destinationDir) {
  console.error('Не указанна начальная и конечная папка');
  process.exit(1);
} else {
  initialDir = path.join(__dirname, initialDir);
  destinationDir = path.join(__dirname, destinationDir);
}

console.log('initialDir :', initialDir);
console.log('destinationDir :', destinationDir);
console.log('removeInit :', removeInit);