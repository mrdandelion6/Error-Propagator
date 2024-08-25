import { Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar'
import ErrorPropagator from './ErrorPropagator';
import Docs from './Docs';
import Membership from './Membership';
import About from './About';
// import './index.scss';

function App() {
  return (
    <div className="app">
      <TopNavBar/>
      <Routes>
        <Route path="/" element={ <ErrorPropagator /> }/>
        {/* <Route path="/Docs" element={ <Docs /> }/>
        <Route path="/Membership" element={ <Membership /> }/>
        <Route path="/About" element={ <About /> }/> */}
      </Routes>
    </div>
  );
}

export default App;