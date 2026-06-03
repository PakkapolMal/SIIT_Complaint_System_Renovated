import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import {
  fetchQuestionsByTopic,
  fetchTopics,
  getErrorMessage,
  submitComplaint,
} from '../lib/complaintsService';

const ComplaintStart = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [questions, setQuestions] = useState([]);
    
    const [answers, setAnswers] = useState({});
    const [files, setFiles] = useState({});
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { userId, userRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchTopics()
            .then(setTopics)
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    const handleTopicSelect = async (topicId) => {
        if (!topicId) {
            setSelectedTopic('');
            setQuestions([]);
            setAnswers({});
            setFiles({});
            return;
        }

        setLoading(true);
        setSelectedTopic(topicId);
        setError('');

        try {
            const nextQuestions = await fetchQuestionsByTopic(topicId);
            setQuestions(nextQuestions);
            const initialAnswers = {};
            nextQuestions.forEach((q) => {
                const isFile = q.QText.includes('FILE:');
                initialAnswers[q.QID] = { text: '', isFile };
            });
            setAnswers(initialAnswers);
            setFiles({});
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (qid, value) => {
        setAnswers(prev => ({
            ...prev,
            [qid]: { ...prev[qid], text: value }
        }));
    };

    const handleFileChange = (qid, file) => {
        setFiles(prev => ({
            ...prev,
            [qid]: file
        }));
        
        setAnswers(prev => ({
            ...prev,
            [qid]: { ...prev[qid], text: file ? file.name : '' }
        }));
    };

    const handleCheckboxChange = (qid, option, isChecked) => {
        const currentAnswer = answers[qid]?.text || '';
        let currentOptions = currentAnswer ? currentAnswer.split(', ') : [];

        if (isChecked) {
            if (!currentOptions.includes(option)) {
                currentOptions.push(option);
            }
        } else {
            currentOptions = currentOptions.filter(opt => opt !== option);
        }
        
        handleAnswerChange(qid, currentOptions.join(', '));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!userId || !userRole) {
            setError('Authentication Error: User ID or Role is missing. Please log out and log back in.');
            setLoading(false);
            return;
        }

        const simplifiedAnswers = Object.keys(answers).map(qid => ({
            qid,
            text: answers[qid].text,
            isFile: answers[qid].isFile
        }));

        try {
            const submissionId = await submitComplaint({
                topicId: selectedTopic,
                answers: simplifiedAnswers,
                files,
            });

            navigate('/thankyou', {
                replace: true,
                state: { submissionId },
            });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout mainClassName="p-4 sm:p-8">
                <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-6 shadow-md sm:p-8">
                    <button onClick={() => navigate(-1)} className="text-siit-purple hover:underline mb-4">
                        &larr; Back to Menu
                    </button>
                    <h1 className="text-4xl font-extrabold text-siit-purple mb-6 border-b pb-4">
                        File a New Complaint
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-6">
                            <label htmlFor="topic" className="block text-lg font-semibold text-gray-800 mb-2">
                                1. Select a Topic <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="topic"
                                value={selectedTopic}
                                onChange={(e) => handleTopicSelect(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-lg"
                                required
                            >
                                <option value="">-- Please select a topic --</option>
                                {topics.map(topic => (
                                    <option key={topic.TopicID} value={topic.TopicID}>
                                        {topic.Tname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading && <p>Loading questions...</p>}
                        
                        {questions.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    2. Provide Details <span className="text-red-500">*</span>
                                </h2>
                                {questions.map(question => {
                                    const isFile = question.QText.includes('FILE:');
                                    const isCheckbox = question.QText.includes('CHECKBOX:');
                                    const isDropdown = question.QText.includes('DROPDOWN:');

                                    let label = question.QText;
                                    let options = [];
                                    
                                    if (isCheckbox) {
                                        const parts = question.QText.split('CHECKBOX:');
                                        label = parts[0].trim();
                                        options = parts[1].split('|').map(opt => opt.trim().replace('*', ''));
                                    } else if (isDropdown) {
                                        const parts = question.QText.split('DROPDOWN:');
                                        label = parts[0].trim();
                                        options = parts[1].split('|').map(opt => opt.trim().replace('*', ''));
                                    } else if (isFile) {
                                        label = question.QText.split('FILE:')[0].trim();
                                    }

                                    return (
                                        <div key={question.QID} className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                {label}
                                            </label>

                                            {isCheckbox ? (
                                                <div className="space-y-2">
                                                    {options.map((option, index) => (
                                                        <label key={index} className="flex items-center text-gray-800">
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                                onChange={(e) => handleCheckboxChange(question.QID, option, e.target.checked)}
                                                                checked={(answers[question.QID]?.text || '').split(', ').includes(option)}
                                                            />
                                                            <span className="ml-3">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : isDropdown ? (
                                                <select
                                                    value={answers[question.QID]?.text || ''}
                                                    onChange={(e) => handleAnswerChange(question.QID, e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                                                    required={!label.includes('(If any)')}
                                                >
                                                    <option value="">-- Select an option --</option>
                                                    {options.map((opt, index) => (
                                                        <option key={index} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : isFile ? (
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(question.QID, e.target.files[0])}
                                                    className="mt-1 block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-purple-50 file:text-purple-700
                                                    hover:file:bg-purple-100"
                                                />
                                            ) : (
                                                <textarea
                                                    rows="4"
                                                    value={answers[question.QID]?.text || ''}
                                                    onChange={(e) => handleAnswerChange(question.QID, e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="Enter your detailed response here..."
                                                    required={!label.includes('(If any)')}
                                                />
                                            )}
                                        </div>
                                    );
                                })} 
                            </div>
                        )}

                        {error && (
                            <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">
                                {error}
                            </div>
                        )}

                        <div className="text-center pt-4">
                            <button
                                type="submit"
                                disabled={loading || questions.length === 0}
                                className="w-full sm:w-auto px-8 py-3 bg-siit-purple text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
        </AuthenticatedLayout>
    );
};

export default ComplaintStart;
