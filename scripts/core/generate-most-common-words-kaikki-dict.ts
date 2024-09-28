import { LangCode } from "../../types";
import { generateMostCommonWordsDict } from "./most-common-words-dict";
import { saveDictToJson } from "./save-dict-to-json";

export async function generateMostCommonWordsKaikkiDictionary(langCode: LangCode, saveToJsonOutput: string) {
    const entries = await generateMostCommonWordsDict(langCode);

    if (saveToJsonOutput) {
        saveDictToJson(saveToJsonOutput, entries, langCode);
    }

    return entries
}