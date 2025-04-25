import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [savingAccount, setSavingAccount] = useState("");
  const [checkingAccount, setCheckingAccount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const savingMap = ["NaN", "little", "moderate", "quite rich", "rich"];
  const checkingMap = ["NaN", "none", "little", "moderate", "rich"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !age || !savingAccount || !checkingAccount || !creditAmount || !duration) {
      setError("All fields are required!");
      return;
    }

    const data = {
      Age: Number(age),
      "Saving accounts": savingAccount,
      "Checking account": checkingAccount,
      "Credit amount": Number(creditAmount),
      Duration: Number(duration),
    };

    try {
      const response = await axios.post("http://localhost:5000/predict", { data });
      const result = response.data.predictions[0];

      setPrediction(result);
      setError(null);

      await addDoc(collection(db, "formSubmissions"), {
        name,
        email,
        age,
        savingAccount,
        checkingAccount,
        creditAmount,
        duration,
        prediction: result === 0 ? "High Risk (Bad)" : "Low Risk (Good)",
        timestamp: new Date(),
      });

      setName("");
      setEmail("");
      setAge("");
      setSavingAccount("");
      setCheckingAccount("");
      setCreditAmount("");
      setDuration("");
    } catch (err) {
      setError("Error predicting risk: " + err.message);
      setPrediction(null);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="App">
      <h1>Risk Prediction</h1>

      {!user ? (
        <button onClick={handleLogin} className="auth-btn">
          Sign In with Google
        </button>
      ) : (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout} className="auth-btn logout">
            Logout
          </button>

          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <label>
              Age:
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            </label>

            <label>
              Saving accounts:
              <select value={savingAccount} onChange={(e) => setSavingAccount(e.target.value)} required>
                <option value="">Select</option>
                {savingMap.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Checking account:
              <select value={checkingAccount} onChange={(e) => setCheckingAccount(e.target.value)} required>
                <option value="">Select</option>
                {checkingMap.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Credit amount:
              <input type="number" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} required />
            </label>

            <label>
              Duration (in months):
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </label>

            <button type="submit">Predict Risk</button>
          </form>

          {error && <p className="error">{error}</p>}

          {prediction !== null && (
            <div className="result">
              <h3>Prediction Result:</h3>
              <p>{prediction === 0 ? "High Risk (Bad)" : "Low Risk (Good)"}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
