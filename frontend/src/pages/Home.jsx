// File Path: frontend/src/pages/Home.jsx

import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HeartPulse, Stethoscope, Star, MessageCircle } from 'lucide-react';
import { useScrollAnimate } from '../hooks/useScrollAnimate.js';
import DoctorCard from '../components/DoctorCard.jsx';
import api from '../services/api.js';
import { useEffect, useState } from 'react';
import HealthTipsSlider from '../components/HealthTipsSlider.jsx';
import FaqSection from '../components/FaqSection.jsx';

// Dummy data for testimonials
const testimonials = [
  {
    name: 'Priya S.',
    text: 'Booking an appointment was so easy, and the doctor was incredibly professional. Highly recommend!',
    image: 'https://placehold.co/100x100/E2E8F0/4A5568?text=PS',
  },
  {
    name: 'Amit K.',
    text: 'The online consultation saved me so much time. The platform is user-friendly and very reliable.',
    image: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AK',
  },
  {
    name: 'Sunita M.',
    text: 'A fantastic experience from start to finish. The doctors are top-notch and truly care about their patients.',
    image: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SM',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  const trustRef = useScrollAnimate();
  const doctorsRef = useScrollAnimate();
  const tipsRef = useScrollAnimate();
  const faqRef = useScrollAnimate();
  const testimonialsRef = useScrollAnimate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setTopDoctors(res.data.slice(0, 3));
        setAvailableDoctors(res.data.sort(() => 0.5 - Math.random()).slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/1E88E5/FFFFFF?text=Modern+Clinic')",
        }}
      >
        <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
        <div className="relative section__container py-24 md:py-32 text-center">
          <h1 className="font-outfit text-4xl md:text-6xl font-bold mb-4">Your Health, Our Priority</h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-200">
            Connect with trusted doctors for in-clinic or online consultations. Book appointments seamlessly and take control of your health journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/doctors')}
              className="px-8 py-3 bg-white text-primary font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform"
            >
              Book an Appointment
            </button>
            <button className="px-8 py-3 bg-secondary text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform">
              Consult Online
            </button>
          </div>
        </div>
      </section>

      {/* 2. Trust Section */}
      <section ref={trustRef} className="section__container py-20 animate-on-scroll">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-3xl font-bold text-text-dark">Why Choose MediConnect?</h2>
          <p className="text-text-light mt-2">Your trusted partner in wellness.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="font-outfit text-xl font-bold mb-2">Verified Doctors</h3>
            <p className="text-text-light">Every doctor on our platform is board-certified and highly experienced.</p>
          </div>
          <div className="text-center p-6">
            <HeartPulse className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="font-outfit text-xl font-bold mb-2">Comprehensive Care</h3>
            <p className="text-text-light">From general health to specialized fields, we've got you covered.</p>
          </div>
          <div className="text-center p-6">
            <MessageCircle className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="font-outfit text-xl font-bold mb-2">Patient-Focused</h3>
            <p className="text-text-light">Trusted by over 100,000 patients for a seamless healthcare experience.</p>
          </div>
        </div>
      </section>

      {/* 3. Doctors Available Today Section */}
      <section className="bg-extra-light py-20">
        <div className="section__container">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-3xl font-bold text-text-dark">Available for Consultation Today</h2>
            <p className="text-text-light mt-2">Book an appointment with these top-rated doctors available now.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableDoctors.slice(0, 3).map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Rated Doctors Section */}
      <section ref={doctorsRef} className="bg-extra-light animate-on-scroll">
        <div className="section__container py-20">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-3xl font-bold text-text-dark">Meet Our Top Doctors</h2>
            <p className="text-text-light mt-2">Handpicked for their expertise and patient care.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Health Tips Section */}
      <section ref={tipsRef} className="section__container py-20 animate-on-scroll">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-3xl font-bold text-text-dark">Quick Health Tips</h2>
          <p className="text-text-light mt-2">Simple advice to help you stay healthy.</p>
        </div>
        <HealthTipsSlider />
      </section>

      {/* 6. Patient Testimonials Section */}
      <section ref={testimonialsRef} className="section__container py-20 animate-on-scroll">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-3xl font-bold text-text-dark">What Our Patients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-text-dark">{testimonial.name}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-light italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section ref={faqRef} className="bg-extra-light animate-on-scroll">
        <div className="section__container py-20">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-3xl font-bold text-text-dark">Have Questions?</h2>
            <p className="text-text-light mt-2">Find answers to common questions below.</p>
          </div>
          <FaqSection />
        </div>
      </section>
    </div>
  );
}
