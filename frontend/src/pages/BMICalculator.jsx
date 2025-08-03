import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function BMICalculator() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [message, setMessage] = useState('');

    const calculateBmi = (e) => {
        e.preventDefault();

        if (!height || !weight) {
            alert('Please enter both height and weight.');
            return;
        }

        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        setBmi(bmiValue);

        if (bmiValue < 18.5) {
            setMessage('You are underweight.');
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
            setMessage('You have a healthy weight.');
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
            setMessage('You are overweight.');
        } else {
            setMessage('You are in the obesity range.');
        }
    };

    return (
        <div className="section__container py-12">
            <div className="w-full max-w-lg mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <Calculator className="w-12 h-12 mx-auto text-primary mb-4" />
                    <h1 className="font-poppins text-2xl font-bold text-text-dark">BMI Calculator</h1>
                    <p className="text-text-light mt-2">Calculate your Body Mass Index to assess your health.</p>
                </div>
                <form onSubmit={calculateBmi} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height (in cm)</label>
                        <input 
                            type="number" 
                            value={height} 
                            onChange={e => setHeight(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 mt-1 border rounded-md" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Weight (in kg)</label>
                        <input 
                            type="number" 
                            value={weight} 
                            onChange={e => setWeight(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 mt-1 border rounded-md" 
                        />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 text-white bg-primary rounded-md hover:bg-primary-dark">
                        Calculate BMI
                    </button>
                </form>
                {bmi && (
                    <div className="text-center p-4 bg-extra-light rounded-lg">
                        <h3 className="font-semibold">Your BMI is:</h3>
                        <p className="text-3xl font-bold text-secondary">{bmi}</p>
                        <p className="text-text-light mt-2">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}