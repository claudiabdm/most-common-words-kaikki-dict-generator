import { KaikkiEntriesKey, LangCode, KaikkiEntries, Dictionary, KaikkiWord, DictionaryWord, BaseDictionary, CATEGORIES, LANG } from '../../types';
import { kaikkiWords } from './kaikki-words-dict-entries';
import { printLog } from '../utils/utils';
import { wordsByFreqCsvToJson } from './words-by-freq-csv-to-js';

export async function generateMostCommonWordsDict(langCode: LangCode) {
    printLog("⏳ Converting csv word frecuency into dictionary...")
    const baseDictionary = await wordsByFreqCsvToJson(langCode)
    printLog("✅ Converting csv word frecuency into dictionary\n")

    printLog("⏳ Generating dictionary for Kaikki words...")
    const kaikkiEntries: KaikkiEntries = await kaikkiWords(langCode);
    printLog(`✅ Generating dictionary for  ${Object.keys(kaikkiEntries).length} Kaikki words\n`);


    const logLine = "⏳ Adding Kaikki info to dictionary with the 10000 most common words..."
    printLog(logLine)
    const dictionary: Dictionary = generateDictionary(baseDictionary, kaikkiEntries, langCode)

    printLog("✅ Adding Kaikki info to dictionary with the 10000 most common words\n")

    return dictionary;
}

function createNewWord(kaikkiWord: KaikkiWord, size = 0): DictionaryWord {
    return {
        word: kaikkiWord.word,
        rank: size + 1,
        category: kaikkiWord.pos,
        ipa: kaikkiWord.sounds?.find(s => s.ipa)?.ipa,
        pronunciation_ogg: kaikkiWord.sounds?.find(s => s.ogg_url)?.ogg_url,
        pronunciation_mp3: kaikkiWord.sounds?.find(s => s.mp3_url)?.mp3_url,
        senses: kaikkiWord.senses,
        head: kaikkiWord.head_templates?.map(h => h.expansion),
    }
}

function addWordEntry(mainDict: Dictionary, kaikkiWord: KaikkiWord, langCode: LangCode) {
    // For example, avoids adding words that are characters
    if (!CATEGORIES.includes(kaikkiWord.pos)) return;

    // We're using lemmized list, so we don't want to include a different form of a word like for verbs
    const langName = LANG[langCode];
    const linkedWord = kaikkiWord.senses[0].links?.[0].find(l => l.includes(`#${langName}`))?.replace(`#${langName}`, '');
    if (linkedWord && mainDict.has(linkedWord)) return;

    const newWord = createNewWord(kaikkiWord, mainDict.size);
    
    // Group different entries for the same word
    if (!mainDict.has(kaikkiWord.word)) {
        mainDict.set(kaikkiWord.word, [newWord]);
    } else {
        const wordInDict = mainDict.get(kaikkiWord.word)!;
        if (!wordInDict.some(w => w.category === newWord.category)) {
            wordInDict.push(newWord);
        }
    }
}

function addOnyms(mainDict: Dictionary, baseDictionary: BaseDictionary, kaikkiEntries: KaikkiEntries, kaikkiWord: KaikkiWord, langCode: LangCode) {
    const onyms = [...(kaikkiWord.synonyms ?? []), ...(kaikkiWord.antonyms ?? [])]
    onyms.forEach(a => {
        if (!mainDict.has(a.word) && !baseDictionary.has(a.word)) {
            const kaikkiEntryKey: KaikkiEntriesKey = `${a.word}-${langCode}`;
            kaikkiEntries[kaikkiEntryKey]?.forEach((ww: KaikkiWord) => {
                addWordEntry(mainDict, ww, langCode);
            });
        }
    })
}

function generateDictionary(baseDictionary: BaseDictionary, kaikkiEntries: KaikkiEntries, langCode: LangCode, limit = 10000) {
    const baseWords = baseDictionary.keys();
    const baseSize = baseDictionary.size;
    const logLine = "⏳ Adding Kaikki info to dictionary with the 10000 most common words..."
    printLog(logLine)
    let counter = 0;
    const dictionary: Dictionary = new Map();
    for (const word of baseWords) {
        if (dictionary.size >= limit) break;
        try {
            const kaikkiWord: KaikkiEntriesKey = `${word}-${langCode}`;
            const kaikkiWords = kaikkiEntries[kaikkiWord];
            if (kaikkiWords) {
                kaikkiWords.forEach(w => {
                    if (CATEGORIES.includes(w.pos)) {
                        addWordEntry(dictionary, w, langCode);
                        addOnyms(dictionary, baseDictionary, kaikkiEntries, w, langCode);
                    }
                })
            }
        }
        catch (err) {
            console.error(`Error parsing word: ${word}`, err);
        }
        counter += 1
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(logLine + ' ' + ((counter / baseSize) * 100).toFixed(2) + '%');
    }
    return dictionary;
}
