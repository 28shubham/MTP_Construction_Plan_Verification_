import React  , {  useState , useEffect }from 'react';
import {  Navigate ,Route, Routes} from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import RefreshHandler from './RefreshHandler';
import Navbar from './pages/components/Navbar';
import VerificationForm from './pages/VerificationForm'; // Ensure path is correct
import VerificationImage from './pages/VerificationImage';
function App() {
  const[isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({element})=>{
    return isAuthenticated ?  element : <Navigate to = '/login'/>;
  };

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated = {setIsAuthenticated}/>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element ={<Home/>} />} />
        <Route path='/VerificationForm' element={<PrivateRoute element ={<VerificationForm/>} />} />
        <Route path='/VerificationImage' element={<PrivateRoute element ={<VerificationImage/>} />} />
        

      </Routes>
    </div>
  );
}

export default App;
