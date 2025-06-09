import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
} from '@mui/material';

function History() {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/components/unauthorized');
                    return;
                }
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

        const loadHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/components/unauthorized');
                    return;
                }
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

        fetchStats();
        loadHistory();
    }, [navigate]);

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
            <Typography variant="h4" gutterBottom>
                History Summary
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Days Answered:</strong> {stats.daysAnswered}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Total Entries:</strong> {stats.totalEntries}
            </Typography>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Top Answers
                </Typography>
                {stats.questionStats?.map((q, i) => (
                    <Box key={i} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {q.question}
                        </Typography>
                        <List dense>
                            {q.topAnswers.map((a, j) => (
                                <ListItem key={j}>
                                    <ListItemText primary={`${a.text} — ${a.count} times`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Entry Log
                </Typography>
                {history.length === 0 ? (
                    <Typography>No entries yet.</Typography>
                ) : (
                    <List>
                        {history.map((entry) => (
                            <Paper key={entry._id} sx={{ mb: 2, p: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {new Date(entry.date).toLocaleDateString()}
                                </Typography>
                                {Object.entries(entry.answers || {}).map(([q, a]) => (
                                    <Typography key={q} variant="body2">
                                        <em>{q}:</em> {Array.isArray(a) ? a.join(', ') : a}
                                    </Typography>
                                ))}
                            </Paper>
                        ))}
                    </List>
                )}
                {stats.daysAnswered === 0 && (
                    <Typography>No stats available.</Typography>
                )}
            </Box>
        </Box>
    );
}

export default History;