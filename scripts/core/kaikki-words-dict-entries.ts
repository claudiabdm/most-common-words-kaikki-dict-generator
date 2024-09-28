import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { KaikkiEntries, KaikkiEntriesKey, KaikkiWord, LANG, LangCode } from '../../types';

export async function kaikkiWords(langCode: LangCode) {
    const input = `./resources/${langCode}/kaikki.org-dictionary-${LANG[langCode]}.jsonl`;
    const inputResolve = path.resolve(input);
    const fileStream = fs.createReadStream(inputResolve);
    const kaikkiEntries: KaikkiEntries = {};
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        try {
            const jsonObject: KaikkiWord = JSON.parse(line);
            const word: KaikkiEntriesKey = `${jsonObject.word}-${langCode}`;
            if (kaikkiEntries[word]) {
                kaikkiEntries[word].push(jsonObject)
            } else {
                kaikkiEntries[word] = [jsonObject]
            }
        } catch (err) {
            console.error(`Error parsing line: ${line}`, err);
        }
    }
    return kaikkiEntries;
}