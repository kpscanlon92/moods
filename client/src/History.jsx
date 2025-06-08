import { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
    const [history, setHistory] = useState([]);
    const userId = 'demoUser';

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/moods/${userId}`);
                setHistory(res.data);
            } catch (error) {
                console.error('Error loading history:', error);
            }
        };
        loadHistory();
    }, []);

    return (
        <div>
            <ul className="history">
                {history.map((entry) => (
                    <li key={entry._id}>
                        <div className="history-item">
                            <span>{entry.date}</span>
                            {Object.entries(entry.answers || {}).map(([q, a]) => (
                                <p key={q}><em>{q}:</em> {Array.isArray(a) ? a.join(', ') : a}</p>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default History;