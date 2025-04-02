import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './components/client/SignInPage'
import ClientSignUp from './components/client/SignUp/ClientSignUp';
import ClientSignUpStepTwo from './components/client/SignUp/ClientSignUpStepTwo';
import ClientDashboard from './components/client/dashboard/ClientDashboard';
import ClientPayments from './components/client/payments/ClientPayments';
import ClientProjects from './components/client/projects/ClientProjects';
import PostProject from './components/client/projects/PostProjects';
import ProjectDetails from './components/client/projects/ProjectDetails';
import ProjectBids from './components/client/projects/ProjectBids';

import FreelancerSignupStep1 from './components/Freelancer/FreelancerSignUpStep1';
import FreelancerSignupStep2 from './components/Freelancer/FreelancerSignUpStep2';
import FreelancerSignupStep3 from './components/Freelancer/FreelancerSignUpStep3';
import FreelancerDashboard from './components/Freelancer/FreelancerDashboard';
import FreelancerPayments from './components/Freelancer/FreelancerPayments';
import FreelancerProjects from './components/Freelancer/FreelancerProjects';
import FreelancerProjectDetails from './components/Freelancer/FreelancerProjectDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage/>} />
        <Route path="/signup/client" element={<ClientSignUp/>} />
        <Route path="/signup/client/step2" element={<ClientSignUpStepTwo/>} />
        <Route path="/dashboard" element={<ClientDashboard/>} />
        <Route path="/payments" element={<ClientPayments/>} />
        <Route path="/projects" element={<ClientProjects/>} />
        <Route path="/projects/new" element={<PostProject/>} />
        <Route path="/projects/details" element={<ProjectDetails/>} />
        <Route path="/projects/details/bids" element={<ProjectBids/>} />

        
        <Route path="/freelancer-signup" element={<FreelancerSignupStep1/>} />
        <Route path="/freelancer-signup-step2" element={<FreelancerSignupStep2/>} />
        <Route path="/freelancer-signup-step3" element={<FreelancerSignupStep3/>} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard/>} />
        <Route path="/freelancer-payments" element={<FreelancerPayments/>} />
        <Route path="/freelancer-projects" element={<FreelancerProjects/>} />
        <Route path="/freelancer-projects-details" element={<FreelancerProjectDetails/>} />

        
        

      </Routes>
    </Router>
  )
}

export default App;
