import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import BrowseSchemes from './pages/BrowseSchemes';
import SmartAssistant from './pages/SmartAssistant';
import SchemeDetail from './pages/SchemeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import useAuthStore from './store/authStore';

// Restores user session on page load if a token exists in localStorage
const AuthInitializer = () => {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) fetchMe();
  }, []);

  return null;
};

function App() {
  return (
    <Router>
      <AuthInitializer />
      <Routes>
        {/* Standalone auth pages (no app layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main app with sidebar layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="schemes" element={<BrowseSchemes />} />
          <Route path="schemes/:id" element={<SchemeDetail />} />
          <Route path="assistant" element={<SmartAssistant />} />
          <Route path="support" element={<HelpSupport />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
