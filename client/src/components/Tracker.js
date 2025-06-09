import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Tracker.module.css';

function Tracker() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const token = localStorage.getItem('token');

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
    }, []);

    const handleChange = (questionId, value, type) => {
        if (type === 'checkbox') {
            setAnswers((prev) => {
                const current = prev[questionId] || [];
                const newValue = current.includes(value)
                    ? current.filter((v) => v !== value)
                    : [...current, value];
                return { ...prev, [questionId]: newValue };
            });
        } else {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
        }
    };

    const submitMood = async () => {
        try {
            await axios.post('http://localhost:4000/api/moods', {
                answers
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAnswers({});
            alert('Mood saved!');
        } catch (error) {
            console.error('Error submitting mood:', error);
        }
    };

    return (
        <div className={styles.container}>
            {questions.map((q) => (
                <div key={q.questionId} className={styles.questionBlock}>
                    <label>{q.questionText}</label>
                    <div className={styles.answerBlock}>
                        {q.options.map((option) => (
                            <label key={option}>
                                <input
                                    type={q.type}
                                    value={option}
                                    checked={answers[q.questionId]?.includes(option) || false}
                                    onChange={() => handleChange(q.questionId, option, q.type)}
                                />
                                {option}
                                {option === 'Other' && answers[q.questionId]?.includes('Other') &&
                                    <input
                                        type="text"
                                        value={answers[q.questionId + '_other'] || ''}
                                        placeholder="Please specify"
                                        onChange={(e) => handleChange(q.questionId + '_other', e.target.value, "text")}
                                    />
                            }
                            </label>
                        ))}
                        {q.type === 'text' && (
                            <input
                                type="text"
                                value={answers[q.questionId] || ''}
                                onChange={(e) => handleChange(q.questionId, e.target.value, q.type)}
                            />
                        )}
                    </div>
                </div>
            ))}

            <button onClick={submitMood}>Submit Mood</button>
        </div>
    );
}

export default Tracker;
