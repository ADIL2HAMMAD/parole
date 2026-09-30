export const PRONOUNS = [
  "je",
  "tu",
  "il / elle / on",
  "nous",
  "vous",
  "ils / elles",
];

export const CONJUGATION_MODES = {
  indicatif: {
    label: "Indicatif",
    description: "Pour décrire un fait, une habitude ou une situation réelle.",
    tenses: [
      ["present", "Présent"],
      ["imparfait", "Imparfait"],
      ["futur", "Futur simple"],
      ["passe-compose", "Passé composé"],
    ],
  },
  conditionnel: {
    label: "Conditionnel",
    description:
      "Pour exprimer un souhait, une hypothèse ou une demande polie.",
    tenses: [["present", "Présent"]],
  },
  subjonctif: {
    label: "Subjonctif",
    description: "Après une volonté, une émotion, un doute ou une nécessité.",
    tenses: [["present", "Présent"]],
  },
  imperatif: {
    label: "Impératif",
    description: "Pour donner un conseil, une consigne ou un ordre.",
    tenses: [["present", "Présent"]],
  },
};

export const TENSE_NOTES = {
  "indicatif-present":
    "Le présent parle de maintenant, d’une habitude ou d’une vérité générale.",
  "indicatif-imparfait":
    "L’imparfait installe un décor, une habitude ou une action en cours dans le passé.",
  "indicatif-futur":
    "Le futur simple exprime une action à venir, souvent plus distante ou plus certaine que le futur proche.",
  "indicatif-passe-compose":
    "Le passé composé raconte une action terminée : auxiliaire au présent + participe passé.",
  "conditionnel-present":
    "Le conditionnel présent sert à imaginer, souhaiter ou formuler une demande avec tact.",
  "subjonctif-present":
    "Le subjonctif présent apparaît souvent après « il faut que », « je veux que » ou « bien que ».",
  "imperatif-present": "L’impératif ne se conjugue qu’avec tu, nous et vous.",
};

const endings = {
  imparfait: ["ais", "ais", "ait", "ions", "iez", "aient"],
  futur: ["ai", "as", "a", "ons", "ez", "ont"],
  conditionnel: ["ais", "ais", "ait", "ions", "iez", "aient"],
};

const irregular = {
  être: {
    present: ["suis", "es", "est", "sommes", "êtes", "sont"],
    imparfaitStem: "ét",
    futureStem: "ser",
    subj: ["sois", "sois", "soit", "soyons", "soyez", "soient"],
    imperative: ["sois", "soyons", "soyez"],
    pp: "été",
  },
  avoir: {
    present: ["ai", "as", "a", "avons", "avez", "ont"],
    imparfaitStem: "av",
    futureStem: "aur",
    subj: ["aie", "aies", "ait", "ayons", "ayez", "aient"],
    imperative: ["aie", "ayons", "ayez"],
    pp: "eu",
  },
  aller: {
    present: ["vais", "vas", "va", "allons", "allez", "vont"],
    imparfaitStem: "all",
    futureStem: "ir",
    subj: ["aille", "ailles", "aille", "allions", "alliez", "aillent"],
    imperative: ["va", "allons", "allez"],
    pp: "allé",
    auxiliary: "être",
  },
  faire: {
    present: ["fais", "fais", "fait", "faisons", "faites", "font"],
    imparfaitStem: "fais",
    futureStem: "fer",
    subj: ["fasse", "fasses", "fasse", "fassions", "fassiez", "fassent"],
    imperative: ["fais", "faisons", "faites"],
    pp: "fait",
  },
  prendre: {
    present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
    imparfaitStem: "pren",
    futureStem: "prendr",
    subj: ["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"],
    imperative: ["prends", "prenons", "prenez"],
    pp: "pris",
  },
  venir: {
    present: ["viens", "viens", "vient", "venons", "venez", "viennent"],
    imparfaitStem: "ven",
    futureStem: "viendr",
    subj: ["vienne", "viennes", "vienne", "venions", "veniez", "viennent"],
    imperative: ["viens", "venons", "venez"],
    pp: "venu",
    auxiliary: "être",
  },
  pouvoir: {
    present: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
    imparfaitStem: "pouv",
    futureStem: "pourr",
    subj: ["puisse", "puisses", "puisse", "puissions", "puissiez", "puissent"],
    imperative: ["—", "—", "—"],
    pp: "pu",
  },
  vouloir: {
    present: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
    imparfaitStem: "voul",
    futureStem: "voudr",
    subj: [
      "veuille",
      "veuilles",
      "veuille",
      "voulions",
      "vouliez",
      "veuillent",
    ],
    imperative: ["veuille", "voulons", "veuillez"],
    pp: "voulu",
  },
  devoir: {
    present: ["dois", "dois", "doit", "devons", "devez", "doivent"],
    imparfaitStem: "dev",
    futureStem: "devr",
    subj: ["doive", "doives", "doive", "devions", "deviez", "doivent"],
    imperative: ["dois", "devons", "devez"],
    pp: "dû",
  },
  savoir: {
    present: ["sais", "sais", "sait", "savons", "savez", "savent"],
    imparfaitStem: "sav",
    futureStem: "saur",
    subj: ["sache", "saches", "sache", "sachions", "sachiez", "sachent"],
    imperative: ["sache", "sachons", "sachez"],
    pp: "su",
  },
  voir: {
    present: ["vois", "vois", "voit", "voyons", "voyez", "voient"],
    imparfaitStem: "voy",
    futureStem: "verr",
    subj: ["voie", "voies", "voie", "voyions", "voyiez", "voient"],
    imperative: ["vois", "voyons", "voyez"],
    pp: "vu",
  },
};

function normalize(verb) {
  return verb.trim().toLowerCase().replace(/\s+/g, " ");
}
function regularType(verb) {
  if (verb.endsWith("er")) return "er";
  if (verb.endsWith("ir")) return "ir";
  if (verb.endsWith("re")) return "re";
  return null;
}

function regularForms(verb, key) {
  const type = regularType(verb);
  if (!type) return null;
  const root = verb.slice(0, -2);
  const presentEndings = {
    er: ["e", "es", "e", "ons", "ez", "ent"],
    ir: ["is", "is", "it", "issons", "issez", "issent"],
    re: ["s", "s", "", "ons", "ez", "ent"],
  }[type];
  const subjEndings = {
    er: ["e", "es", "e", "ions", "iez", "ent"],
    ir: ["isse", "isses", "isse", "issions", "issiez", "issent"],
    re: ["e", "es", "e", "ions", "iez", "ent"],
  }[type];
  if (key === "present") return presentEndings.map((end) => root + end);
  if (key === "imparfait")
    return endings.imparfait.map(
      (end) => root + (type === "ir" ? "iss" : "") + end,
    );
  if (key === "futur" || key === "conditionnel") {
    const stem = type === "re" ? verb.slice(0, -1) : verb;
    return endings[key].map((end) => stem + end);
  }
  if (key === "subjonctif") return subjEndings.map((end) => root + end);
  if (key === "imperatif")
    return [
      root + presentEndings[type === "er" ? 0 : 1],
      root + presentEndings[3],
      root + presentEndings[4],
    ];
  if (key === "pp")
    return type === "er" ? `${root}é` : type === "ir" ? `${root}i` : `${root}u`;
  return null;
}

function formsFor(verb, mode, tense) {
  const item = irregular[verb];
  const key = mode === "indicatif" ? tense : mode;
  if (item) {
    if (key === "present") return item.present;
    if (key === "imparfait")
      return endings.imparfait.map((end) => item.imparfaitStem + end);
    if (key === "futur")
      return endings.futur.map((end) => item.futureStem + end);
    if (key === "conditionnel")
      return endings.conditionnel.map((end) => item.futureStem + end);
    if (key === "subjonctif") return item.subj;
    if (key === "imperatif") return item.imperative;
    if (key === "pp") return item.pp;
  }
  return regularForms(verb, key);
}

export function conjugate(rawVerb, mode, tense) {
  const verb = normalize(rawVerb);
  const isKnown = Boolean(irregular[verb]);
  if (!isKnown && !regularType(verb))
    return { verb, supported: false, forms: [], isKnown: false };
  if (mode === "indicatif" && tense === "passe-compose") {
    const auxiliary = irregular[verb]?.auxiliary || "avoir";
    const pp = formsFor(verb, mode, "pp");
    const participle =
      auxiliary === "être"
        ? [
            `${pp}(e)`,
            `${pp}(e)`,
            `${pp}(e)`,
            `${pp}(e)s`,
            `${pp}(e)(s)`,
            `${pp}(e)s`,
          ]
        : Array(6).fill(pp);
    return {
      verb,
      supported: true,
      forms: irregular[auxiliary].present.map(
        (form, index) => `${form} ${participle[index]}`,
      ),
      auxiliary,
      isKnown,
    };
  }
  const forms = formsFor(verb, mode, tense);
  return { verb, supported: Boolean(forms), forms: forms || [], isKnown };
}

export const FEATURED_VERBS = [
  "être",
  "avoir",
  "aller",
  "faire",
  "parler",
  "finir",
  "prendre",
  "venir",
  "pouvoir",
  "vouloir",
];

export const VERB_SUGGESTIONS = [
  ...FEATURED_VERBS,
  "aimer",
  "attendre",
  "choisir",
  "devoir",
  "entendre",
  "étudier",
  "grandir",
  "habiter",
  "jouer",
  "regarder",
  "répondre",
  "réussir",
  "savoir",
  "travailler",
  "vendre",
  "voir",
]
  .filter((verb, index, list) => list.indexOf(verb) === index)
  .sort((a, b) => a.localeCompare(b, "fr"));
