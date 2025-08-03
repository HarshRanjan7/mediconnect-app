import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Heart, Brain } from 'lucide-react';

const tips = [
    { 
        icon: <Droplets className="w-8 h-8 text-white" />, 
        title: "Stay Hydrated", 
        text: "Drinking enough water is crucial, especially during the monsoon season, to maintain energy levels and overall health.",
        bgColor: "bg-blue-500"
    },
    { 
        icon: <Heart className="w-8 h-8 text-white" />, 
        title: "5 Tips for a Healthy Heart", 
        text: "Incorporate balanced meals, regular exercise, and stress management techniques to keep your heart strong.",
        bgColor: "bg-red-500"
    },
    { 
        icon: <Brain className="w-8 h-8 text-white" />, 
        title: "Prioritize Mental Wellness", 
        text: "Taking short breaks, practicing mindfulness, and talking to someone can significantly improve your mental health.",
        bgColor: "bg-purple-500"
    },
];

export default function HealthTipsSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevTip = () => {
        const isFirstTip = currentIndex === 0;
        const newIndex = isFirstTip ? tips.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextTip = () => {
        const isLastTip = currentIndex === tips.length - 1;
        const newIndex = isLastTip ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto h-64 rounded-lg shadow-lg overflow-hidden">
            <div 
                className="w-full h-full flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {tips.map((tip, index) => (
                    <div key={index} className={`min-w-full h-full p-8 flex flex-col justify-center items-center text-center text-white ${tip.bgColor}`}>
                        <div className="mb-4">{tip.icon}</div>
                        <h3 className="font-outfit text-2xl font-bold mb-2">{tip.title}</h3>
                        <p>{tip.text}</p>
                    </div>
                ))}
            </div>
            {/* Navigation Buttons */}
            <button onClick={prevTip} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 p-2 rounded-full text-white hover:bg-white/50">
                <ChevronLeft size={24} />
            </button>
            <button onClick={nextTip} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 p-2 rounded-full text-white hover:bg-white/50">
                <ChevronRight size={24} />
            </button>
        </div>
    );
}