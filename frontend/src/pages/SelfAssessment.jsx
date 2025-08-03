import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

// Dummy questions for a simple anxiety screening
const questions = [
    "Feeling nervous, anxious, or on edge?",
    "Not being able to stop or control worrying?",
    "Worrying too much about different things?",
    "Trouble relaxing?",
    "Being so restless that it is hard to sit still?",
];

const options = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

export default function SelfAssessment() {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers({ ...answers, [questionIndex]: answer });
    };

    const calculateResult = (e) => {
        e.preventDefault();
        if (Object.keys(answers).length < questions.length) {
            alert("Please answer all questions.");
            return;
        }
        
        // This is a very simplified scoring for demonstration purposes
        const score = Object.values(answers).reduce((total, answer) => total + options.indexOf(answer), 0);
        
        let message = "Your results suggest a low level of anxiety. However, if you have concerns, it's always best to speak with a healthcare professional.";
        if (score > 5 && score <= 10) {
            message = "Your results suggest a mild to moderate level of anxiety. It may be helpful to discuss these feelings with a doctor or a mental health professional.";
        } else if (score > 10) {
            message = "Your results suggest a significant level of anxiety. We strongly recommend speaking with a healthcare professional to discuss your symptoms and potential treatment options.";
        }
        setResult(message);
    };

    return (
        <div className="section__container py-12">
            <div className="w-full max-w-2xl mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-4" />
                    <h1 className="font-poppins text-2xl font-bold text-text-dark">Mental Wellness Check-in</h1>
                    <p className="text-text-light mt-2">This is an anonymous screening tool and not a diagnosis. Please consult a doctor for a professional opinion.</p>
                </div>
                <form onSubmit={calculateResult} className="space-y-8">
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p className="font-semibold mb-3">{index + 1}. {question}</p>
                            <div className="flex flex-wrap gap-4">
                                {options.map(option => (
                                    <label key={option} className="flex items-center space-x-2">
                                        <input 
                                            type="radio" 
                                            name={`question-${index}`} 
                                            value={option} 
                                            onChange={() => handleAnswerChange(index, option)} 
                                            required
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="w-full py-2 px-4 text-white bg-primary rounded-md hover:bg-primary-dark">
                        See My Results
                    </button>
                </form>
                {result && (
                    <div className="text-center p-4 bg-extra-light rounded-lg">
                        <h3 className="font-poppins font-semibold text-lg mb-2">Assessment Result:</h3>
                        <p className="text-text-light">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}