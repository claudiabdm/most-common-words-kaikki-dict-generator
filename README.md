# 📖 Most Common Words Dictionary Generator

This repository contains a script to generate a dictionary of the ~10000 most common words in the selected language, specifically tailored for English speakers who are learning a second language. The word lists are curated from reputable linguistic sources.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Data Sources](#data-sources)
- [Usage](#usage)

## Introduction

Learning a new language can be challenging, especially when it comes to building vocabulary. This project aims to simplify the learning process by providing a dictionary of frequently used French words. The generated dictionary includes definitions and example usages, making it a useful resource for English speakers at different proficiency levels.

## Features

- **Common Words**: Generates a list of the most common French words used in everyday conversation.
- **Definitions & Examples**: Each word is accompanied by a definition, pronunciation audio file and example sentences.
- **Easy Integration**: The JSON output can be easily integrated into language learning applications or flashcard tools.

## Data Sources

The dictionary generation relies on the following data sources:

### 🇫🇷 French
- [lexique.org](http://lexique.org): A comprehensive lexical database for the French language.
- [kaikki.org](https://kaikki.org): A multilingual dictionary that provides translations and definitions.

### 🇪🇸 Spanish
- [RAE](https://corpus.rae.es/lfrecuencias.html): Real Academia Española - Corpus de Referencia del Español Actual (CREA)
- [kaikki.org](https://kaikki.org): A multilingual dictionary that provides translations and definitions.

## Usage
### Command Line Interface
```bash
sh ./scripts/utils/generate-dict.sh $langCode
```
For example, we add "fr" to generate English-French dictionary:
```bash
sh ./scripts/utils/generate-dict.sh "fr"
```