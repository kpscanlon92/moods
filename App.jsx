// === Frontend: App.jsx ===
import { useState, useEffect } from 'react';
import axios from 'axios';

const moodsList = ['happy', 'sad', 'anxious', 'excited', 'angry'];

function App() {
    const [mood, setMood] = useState('');
    const [note, setNote] = useState('');
    const [history, setHistory] = useState([]);
    const userId = 'demoUser';

    const submitMood = async () => {
        const res = await axios.post('http://localhost:4000/api/moods', {
            userId,
            mood,
            note,
        });
        setMood('');
        setNote('');
        loadHistory();
    };

    const loadHistory = async () => {
        const res = await axios.get(`http://localhost:4000/api/moods/${userId}`);
        setHistory(res.data);
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
            <h2>Mood Tracker</h2>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="">Select Mood</option>
                {moodsList.map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <br />
            <textarea
                placeholder="Write a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <br />
            <button onClick={submitMood}>Submit</button>

            <h3>History</h3>
            <ul>
                {history.map((entry) => (
                    <li key={entry._id}>
                        <strong>{entry.date}:</strong> {entry.mood} - {entry.note}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;