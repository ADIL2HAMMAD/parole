import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookMarked,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  CONJUGATION_MODES,
  FEATURED_VERBS,
  PRONOUNS,
  TENSE_NOTES,
  VERB_SUGGESTIONS,
  conjugate,
} from "../lib/conjugation.js";
import { classNames } from "../lib/utils.js";

const modeKeys = Object.keys(CONJUGATION_MODES);

function firstPerson(form) {
  return /^[aeiouéèêëîïôöùûüyh]/i.test(form) ? `j’${form}` : `je ${form}`;
}

function searchText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function ConjugationView() {
  const [verb, setVerb] = useState("parler");
  const [mode, setMode] = useState("indicatif");
  const [tense, setTense] = useState("present");
  const [isVerbFocused, setIsVerbFocused] = useState(false);
  const [isTenseOpen, setIsTenseOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const controlsRef = useRef(null);
  const result = useMemo(
    () => conjugate(verb, mode, tense),
    [verb, mode, tense],
  );
  const modeInfo = CONJUGATION_MODES[mode];
  const tenseLabel = modeInfo.tenses.find(([id]) => id === tense)?.[1];
  const matchingVerbs = useMemo(() => {
    const query = searchText(verb.trim());
    return VERB_SUGGESTIONS.filter(
      (item) => !query || searchText(item).includes(query),
    ).slice(0, 7);
  }, [verb]);
  const imperative = mode === "imperatif";
  const visibleForms = imperative
    ? [
        [1, "tu", result.forms[0]],
        [3, "nous", result.forms[1]],
        [4, "vous", result.forms[2]],
      ]
    : result.forms.map((form, index) => [index, PRONOUNS[index], form]);
  const switchMode = (nextMode) => {
    setMode(nextMode);
    setTense(CONJUGATION_MODES[nextMode].tenses[0][0]);
  };
  const selectVerb = (nextVerb) => {
    setVerb(nextVerb);
    setActiveSuggestion(-1);
    setIsVerbFocused(false);
  };
  const handleVerbKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsVerbFocused(false);
      setActiveSuggestion(-1);
    }
    if (event.key === "ArrowDown" && matchingVerbs.length) {
      event.preventDefault();
      setIsVerbFocused(true);
      setActiveSuggestion((current) => (current + 1) % matchingVerbs.length);
    }
    if (event.key === "ArrowUp" && matchingVerbs.length) {
      event.preventDefault();
      setIsVerbFocused(true);
      setActiveSuggestion((current) =>
        current <= 0 ? matchingVerbs.length - 1 : current - 1,
      );
    }
    if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      selectVerb(matchingVerbs[activeSuggestion]);
    }
  };
  useEffect(() => {
    const closeControls = (event) => {
      if (!controlsRef.current?.contains(event.target)) setIsTenseOpen(false);
    };
    document.addEventListener("mousedown", closeControls);
    return () => document.removeEventListener("mousedown", closeControls);
  }, []);
  const reusableSentence = imperative
    ? `${visibleForms[0]?.[2] || "…"} ce point aujourd’hui.`
    : mode === "subjonctif"
      ? `Il faut que ${firstPerson(result.forms[0] || "…")} français un peu chaque jour.`
      : `${firstPerson(result.forms[0] || "…")} français un peu chaque jour.`;

  return (
    <div className="page conjugation-page">
      <section className="conjugation-hero">
        <div>
          <p className="eyebrow">ATELIER DE CONJUGAISON</p>
          <h1>
            Choisis le verbe,
            <br />
            le français s’adapte.
          </h1>
          <p>
            Explore les temps à ton rythme, compare les formes et transforme
            chaque tableau en phrases utiles.
          </p>
        </div>
        <div className="conjugation-hero-mark" aria-hidden="true">
          <BookMarked size={34} />
          <span>
            je
            <br />
            parle
          </span>
        </div>
      </section>

      <section
        className="conjugation-workspace"
        aria-label="Conjugueur français"
      >
        <div className="conjugation-controls" ref={controlsRef}>
          <label className="verb-field">
            Verbe à l’infinitif
            <span>
              <input
                value={verb}
                onChange={(event) => {
                  setVerb(event.target.value);
                  setActiveSuggestion(-1);
                }}
                onFocus={() => setIsVerbFocused(true)}
                onBlur={() =>
                  window.setTimeout(() => setIsVerbFocused(false), 120)
                }
                onKeyDown={handleVerbKeyDown}
                placeholder="ex. parler"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isVerbFocused && matchingVerbs.length > 0}
                aria-controls="verb-options"
                aria-activedescendant={
                  activeSuggestion >= 0
                    ? `verb-option-${activeSuggestion}`
                    : undefined
                }
                aria-label="Verbe à conjuguer"
              />
              <RotateCcw size={15} aria-hidden="true" />
              {isVerbFocused && matchingVerbs.length > 0 && (
                <div
                  className="autocomplete-menu"
                  id="verb-options"
                  role="listbox"
                >
                  {matchingVerbs.map((item, index) => (
                    <button
                      key={item}
                      id={`verb-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={activeSuggestion === index}
                      className={classNames(
                        activeSuggestion === index && "active",
                      )}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectVerb(item);
                      }}
                    >
                      {item}
                      <small>
                        {FEATURED_VERBS.includes(item)
                          ? "verbe usuel"
                          : "modèle disponible"}
                      </small>
                    </button>
                  ))}
                </div>
              )}
            </span>
          </label>
          <div className="verb-suggestions" aria-label="Verbes fréquents">
            {FEATURED_VERBS.map((item) => (
              <button
                key={item}
                className={classNames(verb === item && "active")}
                onClick={() => selectVerb(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="control-section">
            <span className="control-label">Mode</span>
            <div className="mode-picker">
              {modeKeys.map((item) => (
                <button
                  key={item}
                  className={classNames(mode === item && "active")}
                  onClick={() => switchMode(item)}
                >
                  {CONJUGATION_MODES[item].label}
                </button>
              ))}
            </div>
          </div>
          <div className="tense-select">
            <span>Temps</span>
            <div className="tense-combobox">
              <button
                type="button"
                className={classNames("tense-trigger", isTenseOpen && "open")}
                aria-haspopup="listbox"
                aria-expanded={isTenseOpen}
                onClick={() => setIsTenseOpen((open) => !open)}
                onKeyDown={(event) =>
                  event.key === "Escape" && setIsTenseOpen(false)
                }
              >
                {tenseLabel}
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {isTenseOpen && (
                <div className="tense-menu" role="listbox" aria-label="Temps">
                  {modeInfo.tenses.map(([id, label]) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={tense === id}
                      className={classNames(tense === id && "active")}
                      key={id}
                      onClick={() => {
                        setTense(id);
                        setIsTenseOpen(false);
                      }}
                    >
                      {label}
                      {tense === id && (
                        <CheckCircle2 size={14} aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="conjugation-result">
          <div className="result-heading">
            <div>
              <p className="little-label">
                {modeInfo.label} · {tenseLabel}
              </p>
              <h2>{result.verb || "…"}</h2>
            </div>
            <span className="result-status">
              <Sparkles size={14} />{" "}
              {result.supported
                ? result.isKnown
                  ? "verbe usuel"
                  : "modèle régulier"
                : "à compléter"}
            </span>
          </div>
          {result.supported ? (
            <div className="forms-list">
              {visibleForms.map(([index, pronoun, form]) => (
                <div className="conjugation-form" key={`${pronoun}-${index}`}>
                  <span>{pronoun}</span>
                  <strong>{form === "—" ? "—" : form}</strong>
                  {form !== "—" && (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="unsupported-verb">
              <b>Ce verbe n’est pas encore reconnu.</b>
              <p>
                Essaie un verbe en <code>-er</code>, <code>-ir</code> ou{" "}
                <code>-re</code>, ou choisis un verbe fréquent ci-dessus.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="conjugation-insights">
        <article>
          <Lightbulb size={19} aria-hidden="true" />
          <div>
            <p className="little-label">QUAND L’UTILISER</p>
            <h3>
              {modeInfo.label} {tenseLabel?.toLowerCase()}
            </h3>
            <p>{TENSE_NOTES[`${mode}-${tense}`]}</p>
          </div>
        </article>
        <article>
          <span className="example-quote">“</span>
          <div>
            <p className="little-label">PHRASE À RÉUTILISER</p>
            <h3>{reusableSentence}</h3>
            <p>
              Lis-la à voix haute, puis remplace le complément par une idée
              personnelle.
            </p>
          </div>
        </article>
      </section>
      <p className="conjugation-footnote">
        Les verbes réguliers en -ir suivent ici le modèle <b>finir</b>. Les
        verbes à particularités orthographiques ou très irréguliers peuvent
        nécessiter une fiche dédiée.
      </p>
    </div>
  );
}
