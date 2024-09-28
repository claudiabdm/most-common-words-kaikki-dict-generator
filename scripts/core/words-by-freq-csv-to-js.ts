import fs from 'node:fs';
import csv from 'csv-parser';
import { BaseDictionary, LangCode } from '../../types';

export function wordsByFreqCsvToJson(langCode: LangCode): Promise<BaseDictionary>;
export function wordsByFreqCsvToJson(langCode: LangCode, jsonFilePath: string): Promise<void>;
export function wordsByFreqCsvToJson(langCode: LangCode, jsonFilePath?: string): Promise<BaseDictionary | void> {
    // Use map to make sure the frequency rank is followed
    const jsonData: BaseDictionary = new Map();

    // Read the CSV file from http://www.lexique.org/
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(`./resources/${langCode}/freq.csv`)
        stream
            .pipe(csv())
            .on('data', (row) => {
                const [rank, word] = row['order;word'].split(';');
                jsonData.set(
                    word,
                    {
                        word,
                        rank,
                    })
            })
            .on('end', () => {
                const freqMap = new Map(jsonData);
                if (jsonFilePath) {
                    fs.writeFileSync(jsonFilePath, JSON.stringify(Object.fromEntries(freqMap), null, 4));
                    resolve()
                } else {
                    resolve(freqMap);
                }
            })
            .on('error', (err) => {
                console.error('Error reading the CSV file:', err);
                reject(`Error reading the CSV file:, ${err}`)
            });
    })
}