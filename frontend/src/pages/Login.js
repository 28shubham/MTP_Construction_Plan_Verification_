import React, { useState } from 'react';
import{ Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import { handleError , handleSuccess} from '../utils';
function Login() {
  
  const[loginInfo,setLoginInfo] = useState({
    email:'',
    password: ''
  })
  const navigate = useNavigate();
  const handleChange = (e)=>{
    const{name,value } = e.target;

    const copyLoginInfo = { ...loginInfo }; // Use signupInfo instead of loginInfo
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo); 
  
  };
  const handleLogin = async (e)=>{
    e.preventDefault();
    const{email, password} = loginInfo;
    if(!email || !password){
      return handleError('All Fields ae required')
    }
    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url,{
      method: "POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(loginInfo)  
      });
      const result =await response.json();
      const {success, message,jwtToken, name, error} = result;
      if(success){
        handleSuccess(message);
        localStorage.setItem('token',jwtToken);
        localStorage.setItem('loggedInUser',name);
        setTimeout(()=>{
          navigate('/home');
        },1500)
      }else if(error) {
        const details = error?.details[0].message;
        handleError(details);
      }else if(!success){
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  }
  return (
     <div className = 'container'>
      <h1>LogIn</h1>
      <form onSubmit={handleLogin}>
       
        <div>
          <label htmlFor = 'email'>Email</label>
          <input 
          onChange={handleChange}
          type = 'email'
          name = 'email'
          placeholder='Enter your email...'
          value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor = 'password'>Password</label>
          <input 
          onChange={handleChange}
          type = 'password'
          name = 'password'
          placeholder='Enter your password...'
          value={loginInfo.password}
          />
        </div>
        <button type="submit" >LogIn</button>
        <span>Doesn't have a account ?
          <Link to='/signup'>SignUp</Link>
        </span>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default Login
