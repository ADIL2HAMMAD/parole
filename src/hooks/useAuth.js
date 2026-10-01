import { useEffect, useState } from 'react';
import { GoogleAuthProvider, RecaptchaVerifier, browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup, signOut } from 'firebase/auth';
import { auth, firebaseConfigured } from '../lib/firebase.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!auth) return undefined;
    let active = true;
    let unsubscribe = () => {};
    setPersistence(auth, browserLocalPersistence).catch(() => undefined).finally(() => {
      if (!active) return;
      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase n’est pas encore configuré.');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email, password, createAccount = false) => {
    if (!auth) throw new Error('Firebase n’est pas encore configuré.');
    return createAccount
      ? createUserWithEmailAndPassword(auth, email, password)
      : signInWithEmailAndPassword(auth, email, password);
  };

  const sendPhoneCode = async (phoneNumber, containerId) => {
    if (!auth) throw new Error('Firebase n’est pas encore configuré.');
    const verifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      return { confirmation, verifier };
    } catch (error) {
      verifier.clear();
      throw error;
    }
  };

  return { user, loading, configured: firebaseConfigured, signInWithGoogle, signInWithEmail, sendPhoneCode, signOut: () => auth ? signOut(auth) : Promise.resolve() };
}
