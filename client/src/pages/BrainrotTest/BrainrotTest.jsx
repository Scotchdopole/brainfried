import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Toaster, toast } from 'react-hot-toast';
import questionsData from './questions.js'

export default function TestPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [quote, setQuote] = useState("");
    const [questionNumber, setQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);

    const quotes = [
        "How cooked is your brain, really? Let’s find out.",
        "Warning: Results may cause existential dread.",
        "One test. Zero braincells.",
        "The less you think, the better you score.",
        "Mentally spiraling? Confirm it below.",
        "Take this test or be doomed to scroll forever.",
        "Science™ says you’re not okay. This test proves it.",
        "Find out if your brain still boots.",
        "Built by sleep-deprived students, for sleep-deprived students.",
        "Results 100% inaccurate, but emotionally devastating.",
    ];

    const questions = questionsData;

    useEffect(() => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(random);
    }, []);

    useEffect(() => {
        if (questionNumber < questions.length) {
            const current = questions[questionNumber];
            const withIndex = current.options.map((option, index) => ({ option, index }));
            const shuffled = withIndex.sort(() => Math.random() - 0.5);
            setShuffledOptions(shuffled);
        } else {
            const end = Date.now();
            setElapsedTime(((end - startTime) / 1000).toFixed(1));
        }
    }, [questionNumber]);

    const handleAnswerSelection = (selectedIndex) => {
        setSelectedAnswer(selectedIndex);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === null) {
            toast.error('Please select an answer.', {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 1000
            });
            return;
        }

        const correctIndex = questions[questionNumber].ans;
        const originalIndex = shuffledOptions[selectedAnswer].index;

        if (originalIndex === correctIndex) {
            toast.success("Correct!", {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 5000
            });
            setScore(score + 1);
            setCorrectAnswers(correctAnswers + 1);
        } else {
            toast.error("Wrong answer!", {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 5000
            });
        }

        setSelectedAnswer(null);
        setQuestionNumber(questionNumber + 1);
    };

    const handleStart = () => {
        setIsVisible(true);
        setStartTime(Date.now());
    };

    const handleRestart = () => {
        setIsVisible(false);
        setScore(0);
        setCorrectAnswers(0);
        setQuestionNumber(0);
        setSelectedAnswer(null);
        setElapsedTime(null);
        setStartTime(null);
    };

    const finalMessage = (scorePercent) => {
        if (scorePercent <= 19) return "📚 You’re safe. Still living in the real world.";
        if (scorePercent <= 39) return "🤨 You’ve seen some things. Mild exposure detected.";
        if (scorePercent <= 59) return "😬 You’re terminally online. Touching grass is optional.";
        if (scorePercent <= 79) return "🧠 Your brain is medium-rare. Steaming with TikTok references.";
        if (scorePercent <= 99) return "🔥 Cooked beyond saving. You are the algorithm.";
        return "☠️ You have ascended. Pure brainrot. No coming back.";
    };

    return (
        <div className='bg-base-300 min-h-screen min-w-screen'>
            <Toaster />
            <Navbar />
            <div className="bg-base-300 flex flex-col justify-start mt-14 items-center">
                <h1 className='font-font1 text-5xl font-bold'>Brainrot test</h1>
                {!isVisible && (<p className="text-lg mb-6 w-auto">{quote}</p>)}
                {!isVisible && (<button className="btn btn-primary mt-15" onClick={handleStart}>Start the test</button>)}

                {isVisible && questionNumber < questions.length && (
                    <div className='mt-10 flex flex-col gap-5 pr-5 pl-5 items-center'>
                        <h2 className='font-bold text-2xl text-center'>Question #{questionNumber + 1}</h2>
                        <h3 className='font-bold text-center'>{questions[questionNumber].question}</h3>
                        {questions[questionNumber].img && (
                            <img
                                src={questions[questionNumber].img}
                                alt="Question image"
                                className="max-h-72 rounded-2xl shadow-md mt-2"
                            />
                        )}
                        <div className="flex flex-col gap-2">
                            {shuffledOptions.map((opt, index) => (
                                <label
                                    key={index}
                                    className="flex gap-4 items-center cursor-pointer p-2 rounded-xl hover:bg-base-200 select-none"
                                >
                                    <input
                                        type="radio"
                                        name="question"
                                        className="radio radio-primary"
                                        onChange={() => handleAnswerSelection(index)}
                                        checked={selectedAnswer === index}
                                    />
                                    <span>{opt.option}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            className='btn btn-primary mt-3'
                            onClick={handleNextQuestion}
                        >
                            Next
                        </button>
                    </div>
                )}

                {questionNumber === questions.length && (
                    <div className="mt-10 text-center">
                        <h2 className="text-3xl font-bold">Your result:</h2>
                        <p className="text-xl mt-4">Correct answers: {correctAnswers} / {questions.length}</p>
                        <p className="text-xl mt-2">Score: {Math.round((correctAnswers / questions.length) * 100)}%</p>
                        <p className="text-lg mt-2 text-gray-400">Time: {elapsedTime} seconds</p>
                        <p className="text-lg mt-10 italic text-warning">
                            {finalMessage(Math.round((correctAnswers / questions.length) * 100))}
                        </p>
                        <button
                            className="btn btn-primary mt-6"
                            onClick={handleRestart}
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
