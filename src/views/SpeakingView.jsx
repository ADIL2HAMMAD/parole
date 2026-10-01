import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, Lightbulb, LoaderCircle, RotateCcw, Square, WandSparkles } from 'lucide-react';
import { speakingPrompts as allSpeakingPrompts } from '../data.js';
import { classNames } from '../lib/utils.js';

function formatTime(total) {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function localCorrections(text) {
  const rules = [
    { pattern: /\bj'ai pas\b/gi, suggestion: 'je n’ai pas', message: 'À l’oral soigné, utilise la négation complète.' },
    { pattern: /\by a\b/gi, suggestion: 'il y a', message: 'Ajoute le pronom « il » pour une formulation complète.' },
    { pattern: /\bparce que car\b/gi, suggestion: 'car', message: 'Un seul connecteur suffit ici.' },
    { pattern: /\bje pense que que\b/gi, suggestion: 'je pense que', message: 'Évite la répétition de « que ».' },
  ];
  return rules.flatMap((rule) => [...text.matchAll(rule.pattern)].map((match) => ({
    offset: match.index,
    length: match[0].length,
    message: rule.message,
    replacements: [{ value: rule.suggestion }],
  }))).slice(0, 6);
}

export function SpeakingView({ learningLevel }) {
  const speakingPrompts = allSpeakingPrompts.filter((item) => item.level === learningLevel);
  const [promptIndex, setPromptIndex] = useState(0);
  const prompt = speakingPrompts[promptIndex];
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [correctionStatus, setCorrectionStatus] = useState('');
  const [corrections, setCorrections] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const transcriberRef = useRef(null);

  useEffect(() => setPromptIndex(0), [learningLevel]);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);
  useEffect(() => {
    setSeconds(0); setRunning(false); setAudioUrl(null); setTranscript(''); setCorrections([]); setCorrectionStatus('');
  }, [promptIndex]);
  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const toggleRecord = async () => {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      setRunning(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        setAudioUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setRunning(false);
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      setRecording(true);
      setRunning(true);
      setTranscript('');
      setCorrections([]);
      setCorrectionStatus('Enregistrement en cours. Tu pourras le traiter une fois arrêté.');
    } catch {
      window.alert('Autorise le microphone dans ton navigateur pour enregistrer ta réponse.');
    }
  };

  const getCorrections = async (text) => {
    setCorrectionStatus('Correction de la transcription…');
    setCorrections([]);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ text, language: 'fr' }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('analysis_failed');
      const result = await response.json();
      setCorrections(result.matches.slice(0, 6));
      setCorrectionStatus(result.matches.length ? 'Voici les principales pistes de correction.' : 'Aucune correction détectée. Très bien !');
    } catch {
      const fallback = localCorrections(text);
      setCorrections(fallback);
      setCorrectionStatus(fallback.length ? 'Correction locale affichée : le service complet est indisponible.' : 'Service indisponible : aucune erreur fréquente détectée dans cette transcription.');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const processAndCorrect = async () => {
    if (!audioUrl) {
      setCorrectionStatus('Enregistre d’abord une réponse pour pouvoir la traiter.');
      return;
    }
    setIsProcessing(true);
    setCorrections([]);
    try {
      setCorrectionStatus('Chargement du moteur de transcription gratuit…');
      if (!transcriberRef.current) {
        const { pipeline } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.0/+esm');
        transcriberRef.current = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', { dtype: 'q8' });
      }
      setCorrectionStatus('Traitement de l’audio en cours…');
      const result = await transcriberRef.current(audioUrl, { language: 'french', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 });
      const text = result.text?.trim() || '';
      if (text.length < 2) {
        setCorrectionStatus('Aucune parole n’a été reconnue. Vérifie le microphone et parle plus près de celui-ci.');
        return;
      }
      setTranscript(text);
      await getCorrections(text);
    } catch {
      setCorrectionStatus('Le traitement audio a échoué. Vérifie ta connexion : le modèle gratuit doit être téléchargé au premier usage.');
    } finally {
      setIsProcessing(false);
    }
  };

  return <div className="page"><section className="page-intro"><p className="eyebrow">EXPRESSION ORALE</p><h1>Prends la parole</h1><p>Prépare trois idées, parle lentement, puis réécoute-toi avec bienveillance.</p></section><div className="speaking-layout"><aside className="prompt-list"><p className="little-label">EXERCICES</p>{speakingPrompts.map((item, index) => <button key={item.id} className={classNames('prompt-choice', index === promptIndex && 'active')} onClick={() => setPromptIndex(index)}><span>{item.level}</span><b>{item.title}</b></button>)}</aside><section className="speak-card"><span className="pill mint-pill">{prompt.level} · {prompt.duration / 60} min</span><h2>{prompt.title}</h2><p>{prompt.instruction}</p><div className="speech-guide">{prompt.guide.map((tip, index) => <span key={tip}><i>{index + 1}</i>{tip}</span>)}</div><div className="timer" aria-live="polite">{formatTime(seconds)}</div><div className="timer-caption">Objectif : parler environ {prompt.duration} secondes</div><div className="speak-actions"><button className={classNames('record-btn', recording && 'recording')} onClick={toggleRecord}><span aria-hidden="true">{recording ? <Square size={12} fill="currentColor" /> : <Circle size={13} fill="currentColor" />}</span>{recording ? 'Arrêter l’enregistrement' : 'Enregistrer ma voix'}</button><button className="icon-btn" onClick={() => setSeconds(0)} title="Réinitialiser" aria-label="Réinitialiser le chronomètre"><RotateCcw size={16} /></button></div>{audioUrl && <div className="audio-result"><span><CheckCircle2 size={15} /> Enregistrement prêt</span><audio controls src={audioUrl} /><a href={audioUrl} download="ma-pratique-francais.webm">Télécharger</a></div>}<section className="speech-analysis"><div className="speech-analysis-head"><div><p className="little-label">TRANSCRIPTION & CORRECTION</p><h3>Analyse ta réponse</h3></div><button className="analyse-btn" onClick={processAndCorrect} disabled={recording || !audioUrl || isProcessing}><WandSparkles size={16} />{isProcessing ? 'Traitement…' : 'Traiter et corriger'}</button></div><textarea value={transcript} onChange={(event) => { setTranscript(event.target.value); setCorrections([]); }} lang="fr" spellCheck placeholder="Après le traitement, ta transcription apparaîtra ici…" aria-label="Transcription de ta réponse" />{correctionStatus && <p className="speech-status">{isProcessing && <LoaderCircle size={15} className="spin" />}{correctionStatus}</p>}{corrections.length > 0 && <div className="speech-corrections">{corrections.map((match) => <article key={`${match.offset}-${match.message}`}><b>{transcript.slice(match.offset, match.offset + match.length)}</b><span>{match.message}</span>{match.replacements?.[0]?.value && <small>Suggestion : {match.replacements[0].value}</small>}</article>)}</div>}</section><div className="oral-tip"><span aria-hidden="true"><Lightbulb size={18} /></span><p><b>Après ta réponse</b>Note une phrase réussie et une phrase à améliorer. Recommence une fois : tu entendras déjà la différence.</p></div></section></div></div>;
}
