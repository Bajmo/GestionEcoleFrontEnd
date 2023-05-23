import { Container } from '@mui/material';
import './App.css';
import ButtonAppBar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClassesMourad from './screens/ClassesMourad';
import Cours from './screens/Cours';
import Etudiants from './screens/Etudiants';
import Salles from './screens/Salles';

function App() {
  return (
    <Router>
      <Container>
        <ButtonAppBar />
      </Container>
      <Routes>
      <Route path="/" element={<ClassesMourad />} />
        <Route path="/etudiants" element={<Etudiants />} />
        <Route path="/cours" element={<Cours />} />
        <Route path="/salles" element={<Salles />} />
      </Routes>
    </Router>
  );
}

export default App;
