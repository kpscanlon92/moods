// === Frontend: App.jsx ===
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { moodsList, emotionCategories, capacityOptions, sensoryBad, sensoryGood } from './questions';

function App() {
    const [mood, setMood] = useState('');
    const [note, setNote] = useState('');
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [otherEmotion, setOtherEmotion] = useState('');

    const [bodyFeeling, setBodyFeeling] = useState([]); // array now
    const [otherBodyFeeling, setOtherBodyFeeling] = useState('');

    const [capacityFeeling, setCapacityFeeling] = useState([]); // array now
    const [otherCapacityFeeling, setOtherCapacityFeeling] = useState('');

    const [sensoryInput, setSensoryInput] = useState([]);

    const [history, setHistory] = useState([]);
    const userId = 'demoUser';

    // Emotion checkbox toggle
    const handleEmotionChange = (emotion) => {
        setSelectedEmotions((prev) =>
            prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
        );
    };

    // Sensory checkbox toggle
    const handleSensoryChange = (input) => {
        setSensoryInput((prev) =>
            prev.includes(input) ? prev.filter((s) => s !== input) : [...prev, input]
        );
    };

    // Body feeling checkbox toggle
    const handleBodyFeelingChange = (option) => {
        if (bodyFeeling.includes(option)) {
            setBodyFeeling(bodyFeeling.filter((b) => b !== option));
            if (option === 'Other') setOtherBodyFeeling('');
        } else {
            setBodyFeeling([...bodyFeeling, option]);
        }
    };

    // Capacity feeling checkbox toggle
    const handleCapacityFeelingChange = (option) => {
        if (capacityFeeling.includes(option)) {
            setCapacityFeeling(capacityFeeling.filter((c) => c !== option));
            if (option === 'Other') setOtherCapacityFeeling('');
        } else {
            setCapacityFeeling([...capacityFeeling, option]);
        }
    };

    // Capacity feeling checkbox toggle
    const handleCurrentEmotion = (option) => {
        if (selectedEmotions.includes(option)) {
            setSelectedEmotions(selectedEmotions.filter((c) => c !== option));
            if (option === 'Other') setOtherEmotion('');
        } else {
            setSelectedEmotions([...selectedEmotions, option]);
        }
    };


    const submitMood = async () => {
        if (!mood) return alert('Please select a mood.');

        const emotionsString = selectedEmotions
            .filter((em) => em !== 'Other')
            .concat(otherEmotion ? [otherEmotion] : [])
            .join(', ');

        const bodyFeelingString = bodyFeeling
            .filter((bf) => bf !== 'Other')
            .concat(otherBodyFeeling ? [otherBodyFeeling] : [])
            .join(', ');

        const capacityFeelingString = capacityFeeling
            .filter((cf) => cf !== 'Other')
            .concat(otherCapacityFeeling ? [otherCapacityFeeling] : [])
            .join(', ');

        try {
            await axios.post('http://localhost:4000/api/moods', {
                userId,
                mood,
                note,
                emotions: emotionsString,
                bodyFeeling: bodyFeelingString,
                capacityFeeling: capacityFeelingString,
                sensoryInput: sensoryInput.join(', '),
            });
            // Clear inputs
            setMood('');
            setNote('');
            setSelectedEmotions([]);
            setOtherEmotion('');
            setBodyFeeling([]);
            setOtherBodyFeeling('');
            setCapacityFeeling([]);
            setOtherCapacityFeeling('');
            setSensoryInput([]);
            loadHistory();
        } catch (error) {
            alert('Error submitting mood');
            console.error(error);
        }
    };

    const loadHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/moods/${userId}`);
            setHistory(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="container">
            <h1>Mood Tracker</h1>
            <div className="card">
                <label>Select Your Mood</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)}>
                    <option value="">-- Choose Mood --</option>
                    {moodsList.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>

                <label>What emotions are you experiencing right now?</label>
                <div className="emotions" style={{marginBottom: '1rem'}}>
                    {emotionCategories.map((option) => (
                        <label key={option} style={{display: 'block'}}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedEmotions.includes(option)}
                                onChange={() => handleEmotionChange(option)}
                            />
                            {option}
                        </label>
                    ))}
                    {selectedEmotions.includes('Other') && (
                        <input
                            type="text"
                            placeholder="Describe your capacity feeling..."
                            value={otherEmotion}
                            onChange={(e) => setOtherEmotion(e.target.value)}
                            style={{width: '100%', marginTop: '0.5rem'}}
                        />
                    )}
                </div>

                <label>Are these emotions showing up in your body?</label>
                <div className="emotions" style={{marginBottom: '1rem'}}>
                    {['Yes', 'Unclear', 'No', 'Other'].map((option) => (
                        <label key={option} style={{display: 'block'}}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={bodyFeeling.includes(option)}
                                onChange={() => handleBodyFeelingChange(option)}
                            />
                            {option}
                        </label>
                    ))}
                    {bodyFeeling.includes('Other') && (
                        <textarea
                            placeholder="Describe other body feeling..."
                            value={otherBodyFeeling}
                            onChange={(e) => setOtherBodyFeeling(e.target.value)}
                            style={{width: '100%', marginTop: '0.5rem'}}
                        />
                    )}
                </div>

                <label>What's your capacity feeling like?</label>
                <div className="emotions" style={{ marginBottom: '1rem' }}>
                    {capacityOptions.map((option) => (
                        <label key={option} style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={capacityFeeling.includes(option)}
                                onChange={() => handleCapacityFeelingChange(option)}
                            />
                            {option}
                        </label>
                    ))}
                    {capacityFeeling.includes('Other') && (
                        <input
                            type="text"
                            placeholder="Describe your capacity feeling..."
                            value={otherCapacityFeeling}
                            onChange={(e) => setOtherCapacityFeeling(e.target.value)}
                            style={{ width: '100%', marginTop: '0.5rem' }}
                        />
                    )}
                </div>

                <label>Sensory input you are not enjoying?</label>
                <div className="emotions" style={{ marginBottom: '1rem' }}>
                    {sensoryBad.map((option) => (
                        <label key={option} style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={sensoryInput.includes(option)}
                                onChange={() => handleSensoryChange(option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>

                <label>Additional notes</label>
                <textarea
                    placeholder="Write anything you want to add..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: '100%', minHeight: '80px' }}
                />

                <button onClick={submitMood} style={{ marginTop: '1rem' }}>
                    Submit Mood
                </button>
            </div>

            <h2>History</h2>
            <div>
                {history.length === 0 && <p>No moods recorded yet.</p>}
                {history.map((entry) => (
                    <div key={entry._id} className="card" style={{ marginBottom: '1rem' }}>
                        <div>
                            <strong>Mood:</strong> {entry.mood}
                        </div>
                        <div>
                            <strong>Emotions:</strong> {entry.emotions}
                        </div>
                        <div>
                            <strong>Body Feeling:</strong> {entry.bodyFeeling}
                        </div>
                        <div>
                            <strong>Capacity Feeling:</strong> {entry.capacityFeeling}
                        </div>
                        <div>
                            <strong>Sensory Input:</strong> {entry.sensoryInput}
                        </div>
                        <div>
                            <strong>Notes:</strong> {entry.note}
                        </div>
                        <div>
                            <em>Recorded on: {new Date(entry.createdAt).toLocaleString()}</em>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;