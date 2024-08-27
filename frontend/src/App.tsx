import { Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar'
import ErrorPropagator from './components/error_propagator/ErrorPropagator';
import Docs from './components/docs/Docs';
import Membership from './components/membership/Membership';
import About from './components/about/About';
import Login from './components/login/Login';
import Pro from './components/pro/Pro';
// import './index.scss';

function App() {
  return (
    <div className="app">
      <TopNavBar/>
      <Routes>
        <Route path="/" element={ <ErrorPropagator /> }/>
        <Route path="/docs" element={ <Docs /> }/>
        <Route path="/membership" element={ <Membership /> }/>
        <Route path="/about" element={ <About /> }/>
        <Route path="/login" element={ <Login /> }/>
        <Route path="/pro" element={ <Pro /> }/>
      </Routes>
    </div>
  );
}

export default App;