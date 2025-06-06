import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [mood, setMood] = useState('');
    const [note, setNote] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [history, setHistory] = useState([]);
    const userId = 'demoUser';

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/questions');
                setQuestions(res.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
        loadHistory();
    }, []);

    const handleChange = (questionId, value, type, isOther = false) => {
        if (type === 'checkbox') {
            setAnswers((prev) => {
                const current = prev[questionId] || [];
                const updated = current.includes(value)
                    ? current.filter((v) => v !== value)
                    : [...current, value];
                return { ...prev, [questionId]: updated };
            });
        } else if (type === 'radio') {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
        } else if (isOther) {
            setAnswers((prev) => ({ ...prev, [questionId + '_other']: value }));
        } else {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
        }
    };

    const submitMood = async () => {
        if (!mood) return alert('Please select a mood.');
        try {
            await axios.post('http://localhost:4000/api/moods', {
                userId,
                mood,
                note,
                answers
            });
            setMood('');
            setNote('');
            setAnswers({});
            loadHistory();
        } catch (error) {
            console.error('Error submitting mood:', error);
        }
    };

    const loadHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/moods/${userId}`);
            setHistory(res.data);
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    return (
        <div className="container">
            <h1>Mood Tracker</h1>
            <div className="card">
                {questions.map((q) => (
                    <div key={q.questionId} className="question-block">
                        <label>{q.questionText}</label>
                        <div className="answer">
                            {q.options.map((option) => (
                                <label key={option}>
                                    <input
                                        type={q.type}
                                        name={q.questionId}
                                        value={option}
                                        checked={
                                            q.type === 'checkbox'
                                                ? answers[q.questionId]?.includes(option)
                                                : answers[q.questionId] === option
                                        }
                                        onChange={() => handleChange(q.questionId, option, q.type)}
                                    />
                                    {option}
                                    {option === 'Other' &&
                                        ((q.type === 'checkbox' && answers[q.questionId]?.includes('Other')) ||
                                            (q.type === 'radio' && answers[q.questionId] === 'Other')) && (
                                            <input
                                                type="text"
                                                placeholder="Please specify"
                                                value={answers[q.questionId + '_other'] || ''}
                                                onChange={(e) =>
                                                    handleChange(q.questionId, e.target.value, q.type, true)
                                                }
                                            />
                                        )}
                                </label>
                            ))}
                            {q.type === 'text' && (
                                <input
                                    type="text"
                                    value={answers[q.questionId] || ''}
                                    onChange={(e) =>
                                        handleChange(q.questionId, e.target.value, q.type)
                                    }
                                />
                            )}
                        </div>
                    </div>
                ))}

                <button onClick={submitMood}>Submit Mood</button>
            </div>

            <h2>Mood History</h2>
            <ul className="history">
                {history.map((entry) => (
                    <li key={entry._id}>
                        <div className="history-item">
                            <span>{entry.date}</span>
                            {Object.entries(entry.answers || {}).map(([q, a]) => {
                                if (q.endsWith('_other')) return null; // skip "other" keys here
                                const otherValue = entry.answers[q + '_other'];
                                const displayValue = Array.isArray(a)
                                    ? a.map((v) => (v === 'Other' && otherValue ? `${v} (${otherValue})` : v)).join(', ')
                                    : a === 'Other' && otherValue ? `${a} (${otherValue})` : a;

                                return (
                                    <p key={q}>
                                        <em>{q}:</em> {displayValue}
                                    </p>
                                );
                            })}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;