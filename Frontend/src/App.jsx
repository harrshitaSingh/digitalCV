import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import EmailVerify from './Pages/EmailVerificationPage';
import ResumeDashboard from './Pages/ResumeDashboard';
import SettingsPage from './Pages/SettingsPage';
import UserContext from './Context/UserContext';
import AdminPage from './Pages/AdminPage';
import GoogleFormPage from './Pages/HelpPage';
import ResumeProvider from './Context/ResumeContext/index';
import DashboardPage from './Pages/Dashboard';
import SharedResume from './Utils/ActionButton/SharedResume';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <UserContext>
            <LoginPage />
          </UserContext>
        }>
        </Route>
        <Route path='/adminPage' element={<AdminPage />}></Route>
        <Route path="/signUp" element={<SignUpPage />}></Route>
        <Route path="/emailVerify" element={<EmailVerify />}></Route>
        <Route path='/addDetails' element={
          <ResumeProvider>
            <DashboardPage />
          </ResumeProvider>
        }></Route>

        <Route path='/home' element=
          {<ResumeProvider>
            <ResumeDashboard />
          </ResumeProvider>
          }></Route>
        <Route path="/settings" element={
          <UserContext>
            <SettingsPage />
          </UserContext>
        }></Route>
        <Route path='/help' element={<GoogleFormPage />}></Route>
        <Route path="/resume/:id" element={<SharedResume />} />
      </Routes>
    </div>
  );
}

export default App;
