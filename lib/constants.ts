export const defaultSchemaJSON = {
  type: 'object',
  properties: {
    law: {
      type: 'string',
    },
    code: {
      type: ['string', 'null'],
    },
    article: {
      type: ['string', 'null'],
    },
  },
  required: ['law'],
};

const codeAbbreviations = `I give you the codes with the following code abbreviations after =
  ΑΣΤΙΚΟΣ ΚΩΔΙΚΑΣ = ΑΚ
  ΚΩΔΙΚΑΣ ΠΟΛΙΤΙΚΗΣ ΔΙΚΟΝΟΜΙΑΣ = ΚπολΔ
  ΠΟΙΝΙΚΟΣ ΚΩΔΙΚΑΣ = ΠΚ
  ΚΩΔΙΚΑΣ ΠΟΙΝΙΚΗΣ ΔΙΚΟΝΟΜΙΑΣ = ΚΠΔ
`;
export const defaultPromptTemplate = `
  "Entity Definition:"
  "1. article: An article of a legal document. It is referenced as article X or a. X and it consists of an alphanumeric  For example, 3, 302, 608, 121A etc.". It is often referred alongside with the paragraph of the article, please ignore the paragraph and extract only the article number.
  "2. law: The law name of a legal document. Usually it is referred as number/year. Always keep the law with following format: name/year. For example, 1234/2024"
  "3. code: The code that the article is part of. If the law name is referred then usually it is omitted. Usually it is referred without a LAW name and sometimes an abbreviation is provided. For example, article 3 of Civil Code. I want to extract it following the code abbreviations provided here: ${codeAbbreviations}" If you not find any code, please leave it empty. If you have already extracted the law name then do not extract the code, leave it empty. The code is always letters without numbers.
  Examples:
  1. Input: According to article 608 of civil code.
  Entities: ARTICLE: 608, CODE: ΑΣΤΙΚΟΣ ΚΩΔΙΚΑΣ

  2. Input: According to article 302 of Code of civil procedure.
  Entities: ARTICLE: 302, CODE: ΚΩΔΙΚΑΣ ΠΟΛΙΤΙΚΗΣ ΔΙΚΟΝΟΜΙΑΣ

  3. Input: Article 3 of 1234/2024.
  Entities: ARTICLE: 3, LAW: 1234/2024

  4. Input: Article 3, paragraph 2 of 1234/2024.
  Entities: ARTICLE: 3, LAW: 1234/2024

  5. Input: Το άρθρο 3 παρ.2 του Αστικού Κώδικα.
  Entities: ARTICLE: 3, CODE: ΑΣΤΙΚΟΣ ΚΩΔΙΚΑΣ

  For each entity please create a new item in the array of entities. An entity consists of the article and the law or the code. Never create an entity with only the law or article on it. Please, do not create entities with the same article and law or code. also do not create entity from the metadata.

  If you cannot find any entity, please return an empty array.
`;
