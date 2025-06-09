import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
    Box,
    Typography,
    TextField,
    Checkbox,
    Radio,
    RadioGroup,
    FormControl,
    FormGroup,
    FormControlLabel,
    Button,
    Paper
} from '@mui/material';

function Tracker() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/api/questions');
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
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/components/unauthorized');
                return;
            }
            await api.post('/api/moods',
                { answers },
                { headers: { Authorization: `Bearer ${token}` }, }
            );
            setAnswers({});
            alert('Mood saved!');
        } catch (error) {
            console.error('Error submitting mood:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Track Your Mood
            </Typography>

            {questions.map((q) => (
                <Paper key={q.questionId} sx={{ mb: 3, p: 3 }}>
                    <FormControl fullWidth component="fieldset" variant="standard">
                        <Typography variant="h6">{q.questionText}</Typography>

                        {q.type === 'checkbox' && (
                            <FormGroup>
                                {q.options.map((option) => (
                                    <Box key={option} sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                        <FormControlLabel sx={{ m: 0 }}
                                            control={
                                                <Checkbox
                                                    checked={answers[q.questionId]?.includes(option) || false}
                                                    onChange={() => handleChange(q.questionId, option, 'checkbox')}
                                                />
                                            }
                                            label={option}
                                        />
                                        {option === 'Other' && answers[q.questionId]?.includes('Other') && (
                                            <TextField
                                                size="small"
                                                placeholder="Please specify"
                                                value={answers[q.questionId + '_other'] || ''}
                                                onChange={(e) =>
                                                    handleChange(q.questionId + '_other', e.target.value, 'text')
                                                }
                                                sx={{ ml: 2 }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </FormGroup>
                        )}

                        {q.type === 'radio' && (
                            <RadioGroup
                                value={answers[q.questionId] || ''}
                                onChange={(e) => handleChange(q.questionId, e.target.value, 'radio')}
                            >
                                {q.options.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio />}
                                        label={option}
                                    />
                                ))}
                            </RadioGroup>
                        )}

                        {q.type === 'text' && (
                            <TextField
                                fullWidth
                                value={answers[q.questionId] || ''}
                                onChange={(e) => handleChange(q.questionId, e.target.value, 'text')}
                                margin="normal"
                            />
                        )}
                    </FormControl>
                </Paper>
            ))}

            <Button
                variant="contained"
                color="primary"
                onClick={submitMood}
                disabled={questions.length === 0}
            >
                Submit Mood
            </Button>
        </Box>
    );
}

export default Tracker;