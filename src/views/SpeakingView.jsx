import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, Lightbulb, Mic, RotateCcw, Square } from 'lucide-react';
import { speakingPrompts } from '../data.js';
import { classNames } from '../lib/utils.js';

function formatTime(total) {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function SpeakingView() {
  const [promptIndex, setPromptIndex] = useState(0);
  const prompt = speakingPrompts[promptIndex];
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);
  useEffect(() => { setSeconds(0); setRunning(false); setAudioUrl(null); }, [promptIndex]);
  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const toggleRecord = async () => {
    if (recording) { recorderRef.current?.stop(); setRecording(false); return; }
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
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      window.alert('Autorise le microphone dans ton navigateur pour enregistrer ta réponse.');
    }
  };

  return <div className="page"><section className="page-intro"><p className="eyebrow">EXPRESSION ORALE</p><h1>Prends la parole</h1><p>Prépare trois idées, parle lentement, puis réécoute-toi avec bienveillance.</p></section><div className="speaking-layout"><aside className="prompt-list"><p className="little-label">EXERCICES</p>{speakingPrompts.map((item, index) => <button key={item.id} className={classNames('prompt-choice', index === promptIndex && 'active')} onClick={() => setPromptIndex(index)}><span>{item.level}</span><b>{item.title}</b></button>)}</aside><section className="speak-card"><span className="pill mint-pill">{prompt.level} · {prompt.duration / 60} min</span><h2>{prompt.title}</h2><p>{prompt.instruction}</p><div className="speech-guide">{prompt.guide.map((tip, index) => <span key={tip}><i>{index + 1}</i>{tip}</span>)}</div><div className="timer" aria-live="polite">{formatTime(seconds)}</div><div className="timer-caption">Objectif : parler environ {prompt.duration} secondes</div><div className="speak-actions"><button className={classNames('record-btn', recording && 'recording')} onClick={toggleRecord}><span aria-hidden="true">{recording ? <Square size={12} fill="currentColor" /> : <Circle size={13} fill="currentColor" />}</span>{recording ? 'Arrêter l’enregistrement' : 'Enregistrer ma voix'}</button><button className="secondary-btn" onClick={() => setRunning((value) => !value)}><Mic size={15} aria-hidden="true" />{running ? 'Pause' : 'Démarrer le chrono'}</button><button className="icon-btn" onClick={() => setSeconds(0)} title="Réinitialiser" aria-label="Réinitialiser le chronomètre"><RotateCcw size={16} /></button></div>{audioUrl && <div className="audio-result"><span><CheckCircle2 size={15} /> Enregistrement prêt</span><audio controls src={audioUrl} /><a href={audioUrl} download="ma-pratique-francais.webm">Télécharger</a></div>}<div className="oral-tip"><span aria-hidden="true"><Lightbulb size={18} /></span><p><b>Après ta réponse</b>Note une phrase réussie et une phrase à améliorer. Recommence une fois : tu entendras déjà la différence.</p></div></section></div></div>;
}
