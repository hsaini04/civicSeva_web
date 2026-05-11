import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home';
import BrowseSchemes from './pages/BrowseSchemes';
import SmartAssistant from './pages/SmartAssistant';
import SchemeDetail from './pages/SchemeDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="schemes" element={<BrowseSchemes />} />
          <Route path="schemes/:id" element={<SchemeDetail />} />
          <Route path="assistant" element={<SmartAssistant />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
