import { Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar'
import ErrorPropagator from './components/ErrorPropagator';
import Docs from './components/Docs';
import Membership from './components/Membership';
import About from './components/About';
// import './index.scss';

function App() {
  return (
    <div className="app">
      <TopNavBar/>
      <Routes>
        <Route path="/" element={ <ErrorPropagator /> }/>
        <Route path="/Docs" element={ <Docs /> }/>
        <Route path="/Membership" element={ <Membership /> }/>
        <Route path="/About" element={ <About /> }/>
      </Routes>
    </div>
  );
}

export default App;