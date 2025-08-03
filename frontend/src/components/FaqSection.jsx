import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    { question: "How do I find the right doctor for me?", answer: "You can use our 'Find Doctors' page and filter by specialty and location. Reading patient reviews can also help you make an informed decision." },
    { question: "Can I book an appointment for a family member?", answer: "Yes, you can book an appointment for a family member. Please make sure to enter their correct details during the booking process." },
    { question: "What happens if I miss my appointment?", answer: "If you miss an appointment, you will need to book a new one. Please try to cancel at least 24 hours in advance if you cannot make it." },
    { question: "Are online consultations secure?", answer: "Absolutely. We use end-to-end encryption to ensure that your online consultations are private and secure, in compliance with HIPAA standards." },
];

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left font-semibold"
            >
                <span>{faq.question}</span>
                <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                <p className="p-4 pt-0 text-text-light">{faq.answer}</p>
            </div>
        </div>
    );
};

export default function FaqSection() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
                <FaqItem key={index} faq={faq} />
            ))}
        </div>
    );
}