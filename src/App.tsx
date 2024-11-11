import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProcessMap from './pages/process/process';
import Oraculo from './pages/oraculo/oraculo';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProcessMap />
          }
        />
        <Route
          path="/oraculo"
          element={
            <Oraculo />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
