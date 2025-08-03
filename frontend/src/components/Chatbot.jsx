// File Path: frontend/src/components/Chatbot.jsx

import { useState } from 'react';
import { MessageSquare, X, Bot } from 'lucide-react';

const questions = [
    "How do I book an appointment?",
    "How can I cancel my appointment?",
    "What are your clinic hours?",
    "Do you accept insurance?",
];

const answers = {
    "How do I book an appointment?": "You can book an appointment by finding a doctor on our 'Find Doctors' page, viewing their profile, and selecting an available time slot.",
    "How can I cancel my appointment?": "To cancel, please log in and go to your dashboard. You will see a 'Cancel' button next to your upcoming appointments.",
    "What are your clinic hours?": "Most clinics are open from 9 AM to 5 PM, Monday to Friday. Please check the specific doctor's profile for their exact hours.",
    "Do you accept insurance?": "This varies by doctor and clinic. We recommend contacting the clinic directly to confirm their insurance policies.",
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! How can I help you today? Please select a question below.' }
    ]);

    const handleQuestionClick = (question) => {
        const newMessages = [...messages, { from: 'user', text: question }];
        setMessages(newMessages);

        setTimeout(() => {
            setMessages([...newMessages, { from: 'bot', text: answers[question] }]);
        }, 500);
    };

    return (
        <>
            {/* Chat Bubble */}
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
                >
                    {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col animate-fade-in-up">
                    <div className="p-4 bg-primary text-white flex items-center rounded-t-lg">
                        <Bot className="mr-2"/>
                        <h3 className="font-poppins font-semibold">MediConnect Helper</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                <p className={`max-w-[80%] p-2 rounded-lg ${msg.from === 'bot' ? 'bg-gray-200' : 'bg-blue-100'}`}>
                                    {msg.text}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t">
                        <div className="flex flex-wrap gap-2">
                            {questions.map(q => (
                                <button key={q} onClick={() => handleQuestionClick(q)} className="text-xs bg-extra-light p-2 rounded-lg hover:bg-gray-200">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}