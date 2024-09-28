import { readFileSync, writeFileSync } from 'fs';

const INPUT_FILE = './resources/es/freq.csv';
const data = readFileSync(INPUT_FILE, 'utf8');
const lines = data.split('\n');
const newLines = lines.map((line, index) => {
  if (index > 0) {
    const [order, word, ...rest] = line.split(';');
    return `${order};${word}`;
  } else {
    return 'order;word';
  }
});
writeFileSync(INPUT_FILE, newLines.join('\n')); 
