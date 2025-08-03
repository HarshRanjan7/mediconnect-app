import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import FindDoctors from './pages/FindDoctors.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import Profile from './pages/Profile.jsx';
import Chatbot from './components/Chatbot.jsx';
import Blog from './pages/Blog.jsx'; 
import SelfAssessment from './pages/SelfAssessment.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* ... (keep existing routes) */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<FindDoctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog" element={<Blog />} /> {/* Add new route */}
          <Route path="/self-assessment" element={<SelfAssessment />} /> {/* Add new route */}
          <Route path="/patient-dashboard" element={<ProtectedRoute userType="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute userType="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute userType="patient"><Profile /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:userType/:token" element={<ResetPassword />} />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}

export default App;
