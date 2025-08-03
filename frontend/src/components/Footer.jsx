import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-text-dark text-extra-light">
            <div className="section__container py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div className="footer__col">
                    <h3 className="font-poppins text-2xl font-bold text-primary mb-4">
                        Medi<span>Connect</span>
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                        We are honored to be a part of your healthcare journey and committed to delivering compassionate, personalized, and top-notch care.
                    </p>
                </div>
                <div className="footer__col">
                    <h4 className="font-poppins text-lg font-semibold mb-4">About Us</h4>
                    <ul className="space-y-2">
                        <li><Link to="/" className="text-gray-300 hover:text-primary">Home</Link></li>
                        <li><a href="#" className="text-gray-300 hover:text-primary">About Us</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-primary">Our Blog</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-primary">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div className="footer__col">
                    <h4 className="font-poppins text-lg font-semibold mb-4">Services</h4>
                     <ul className="space-y-2">
                        <li><Link to="/doctors" className="text-gray-300 hover:text-primary">Find a Doctor</Link></li>
                        <li><a href="#" className="text-gray-300 hover:text-primary">Health Check</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-primary">Lab Tests</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-primary">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer__col">
                    <h4 className="font-poppins text-lg font-semibold mb-4">Contact Us</h4>
                    <p className="text-gray-300">Najafgarh Main Street, Delhi</p>
                    <p className="text-gray-300">swiftsupport@care.com</p>
                    <p className="text-gray-300">(+91) 70156 87989</p>
                </div>
            </div>
            <div className="bg-black/20 py-4">
                <div className="section__container text-center text-gray-400 text-sm">
                    Copyright © 2025 MediConnect. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
