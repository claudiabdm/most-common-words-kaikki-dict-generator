export const CATEGORIES = [
    'noun',
    'adj',
    'det',
    'verb',
    'adv',
    'pron',
    'prep',
    'article',
    'conj',
    'intj',
    'verb',
] as const

export type Category = typeof CATEGORIES[number];

export interface BaseWord { word: string, rank: number }
export type BaseDictionary = Map<string, BaseWord>

export interface KaikkiWord {
    pos: Category,
    word: string,
    head_templates: Array<{
        expansion: string
    }>
    synonyms?: Array<{
        word: string
    }>,
    antonyms?: Array<{
        word: string
    }>
    sounds?: Array<
        { ipa: string } &
        {
            audio: `LL-Q150 ${string}`,
            ogg_url: `${string}.ogg`
            mp3_url: `${string}.mp3`
        }
    >,
    senses: [{
        examples: Array<{
            text: string,
            english: string
            type: string | 'quotation'
        }>,
        glosses: Array<string>,
        links: [[string, string]]
    }],
}

export interface DictionaryWord extends BaseWord, Pick<KaikkiWord, 'senses'> {
    category: Category,
    ipa: string | undefined,
    pronunciation_ogg: `${string}.ogg` | undefined,
    pronunciation_mp3: `${string}.mp3` | undefined,
    head?: Array<string>
}

export const LANG = {
    fr: 'French',
    es: 'Spanish'
} as const

export type LangCode = keyof typeof LANG
export type LangName = typeof LANG[keyof typeof LANG]

export type KaikkiEntriesKey = `${string}-${LangCode}`
export type KaikkiEntries = Record<KaikkiEntriesKey, Array<KaikkiWord>>
export type Dictionary = Map<string, Array<DictionaryWord>>