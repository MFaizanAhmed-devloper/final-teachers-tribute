import { Routes, Route } from 'react-router-dom';
import MetaNav from './components/MetaNav.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import BackToTop from './components/BackToTop.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import FloatingHearts from './components/FloatingHearts.jsx';

import Home from './pages/Home.jsx';
import Teachers from './pages/Teachers.jsx';
import TeacherTribute from './pages/TeacherTribute.jsx';
import Principal from './pages/Principal.jsx';
import StudentPage from './pages/StudentPage.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <WelcomeScreen />
      <FloatingHearts />
      <ScrollToTop />
      <MetaNav />
      <main id="main">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/teachers"    element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherTribute />} />
          <Route path="/principal"   element={<Principal />} />
          <Route path="/student"     element={<StudentPage />} />
          <Route path="/about"       element={<About />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <Toast />
    </>
  );
}