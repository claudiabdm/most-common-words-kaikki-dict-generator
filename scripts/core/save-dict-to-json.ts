import fs from "node:fs";
import path from "node:path";
import { Dictionary, LANG, LangCode } from "../../types";
import { printLog } from "../utils/utils";

export function saveDictToJson(output: string, dictionary: Dictionary, langCode: LangCode) {
    const outputResolve = path.resolve(output);
    if (!fs.existsSync(outputResolve)) {
        const dir = path.dirname(output);
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(output, JSON.stringify(Object.fromEntries(dictionary)));
    printLog(`\n✨ You can find the ${dictionary.size} most common words English-${LANG[langCode]} dictionary in ${output} ` + '\n')
}