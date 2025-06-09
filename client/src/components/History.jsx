import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/History.module.css';

function History() {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:4000/api/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
        const loadHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:4000/api/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHistory(res.data);
            } catch (error) {
                console.error('Error loading history:', error);
            }
        };
        loadHistory();
    }, []);

    return (
        <div>
            <h2>History Summary</h2>
            <p><strong>Days Answered:</strong> {stats.daysAnswered}</p>
            <p><strong>Total Entries:</strong> {stats.totalEntries}</p>

            <h3>Top Answers</h3>
            {stats.questionStats && stats.questionStats.map((q, i) => (
                <div key={i} style={{marginBottom: '1.5rem'}}>
                    <p><strong>{q.question}</strong></p>
                    <ul>
                        {q.topAnswers.map((a, j) => (
                            <li key={j}>{a.text} — {a.count} times</li>
                        ))}
                    </ul>
                </div>
            ))}
            <ul className={styles.history}>
                {history.map((entry) => (
                    <li key={entry._id}>
                        <div className={styles.historyItem}>
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                            {Object.entries(entry.answers || {}).map(([q, a]) => (
                                <p key={q}><em>{q}:</em> {Array.isArray(a) ? a.join(', ') : a}</p>
                            ))}
                        </div>
                    </li>
                ))}
                {history.length === 0 && <p>No entries yet.</p>}
                {stats.daysAnswered === 0 && <p>No stats available.</p>}
            </ul>
        </div>
    );
}

export default History;