import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Toaster, toast } from 'react-hot-toast';


export default function TestPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [quote, setQuote] = useState("");
    const [questionNumber, setQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);


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

    const questions = [
        {
            question: "How often do you accidentally open TikTok instead of your banking app?",
            options: [
                "Never, I’m normal",
                "Sometimes, muscle memory is weird",
                "I was just checking my balance, now I’m watching capybaras",
                "I don’t even HAVE a banking app"
            ]
        },
        {
            question: "You sit down to do homework. What happens next?",
            options: [
                "I do it",
                "I open 12 tabs “for research”",
                "Somehow I'm watching raccoons making sandwiches",
                "The sun is rising and I’ve written nothing but 'yo' in the doc"
            ]
        },
        {
            question: "Pick your current brain status:",
            options: [
                "Functioning",
                "Lagging",
                "Blue screen of death",
                "404: Thought not found"
            ]
        },
        {
            question: "What’s your sleep schedule like?",
            options: [
                "Normal human hours",
                "Sleep at 3AM, wake at 7AM",
                "I “nap” from 6PM to 1AM and call it self-care",
                "Sleep is a capitalist construct"
            ]
        },
        {
            question: "You see 'Update Available'. What do you do?",
            options: [
                "Update",
                "Remind me tomorrow",
                "Remind me never",
                "I’ve been ignoring it since 2021"
            ]
        },
        {
            question: "Your phone dies. What do you do?",
            options: [
                "Plug it in",
                "Panic slightly",
                "Stare at my reflection and question life",
                "Immediately fall asleep like I was unplugged too"
            ]
        },
        {
            question: "Choose your preferred form of communication:",
            options: [
                "Talking",
                "Texting",
                "💀😩🔥",
                "Sending one blurry meme with zero context"
            ]
        },
        {
            question: "What’s the first thing you do in the morning?",
            options: [
                "Stretch, smile, hydrate",
                "Phone scroll while still half-asleep",
                "Doomscroll and dissociate",
                "Immediately open TikTok with demon eyes"
            ]
        },
        {
            question: "You open YouTube. What happens?",
            options: [
                "Watch a video",
                "Watch 3 videos",
                "Start a 7-hour iceberg documentary at 2AM",
                "“How did I end up on shrimp singing ‘Mr. Brightside’?"
            ]
        },
        {
            question: "Your brain right now feels like:",
            options: [
                "A calm forest",
                "A spinning wheel",
                "A Discord VC at 3AM",
                "A microwave full of bees"
            ]
        }
    ];

    useEffect(() => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(random);
    }, []);

    const handleAnswerSelection = (index) => {
        setSelectedAnswer(index);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer !== null) {
            setScore(score + selectedAnswer);
            setSelectedAnswer(null);
            setQuestionNumber(questionNumber + 1);
        } else {
            toast.error('Please select an answer.',
                {
                    style: {
                        borderRadius: '10px',
                        background: '#191e24',
                        color: '#fff',
                        
                    },
                    position: "top-center",
                    duration: "200"
                }
            );
        }
    };

    return (
        <div className='bg-base-300 min-h-screen min-w-screen '>
            <Toaster />
            <Navbar />
            <div className="bg-base-300 flex flex-col justify-start mt-14 items-center ">
                <h1 className='font-font1 text-5xl font-bold'>Brainrot test</h1>
                {!isVisible && (<p className="text-lg mb-6 w-auto">{quote}</p>)}
                {!isVisible && (<button className="btn btn-primary mt-15" onClick={() => setIsVisible(true)}>Start the test</button>)}
                {isVisible && questionNumber < questions.length && (
                    <div className='mt-30 flex flex-col gap-5 pr-5 pl-5'>

                        <h2 className='font-bold text-2xl'>Question #{questionNumber + 1}</h2>
                        <h3 className='font-bold'>{questions[questionNumber].question}</h3>
                        {questions[questionNumber].options.map((option, index) => (
                            <label key={index} className="flex gap-4">
                                <input
                                    type="radio"
                                    name="question"
                                    title={option}
                                    className="radio radio-primary"
                                    onChange={() => handleAnswerSelection(index)}
                                    checked={selectedAnswer === index}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                        <button
                            className='btn btn-primary'
                            onClick={handleNextQuestion}
                        >
                            Next
                        </button>
                    </div>

                )}
                {questionNumber === questions.length && (
                    <div className="mt-10 text-center">
                        <h2 className="text-3xl font-bold">Your brainrot score:</h2>
                        <p className="text-xl mt-4">
                            {Math.round((score / (questions.length * 3)) * 100)}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
