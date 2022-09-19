import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import {useNavigate} from 'react-router-dom';

const Home = () => {

  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  useEffect(() => {
    if(currentUser != null){
      navigate('/profile');
    }
    
  }, []);

 
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Home</h3>
        <h4>If you do not yet have an account, kindly SignUp.</h4>
      </header>
    </div>
  );
};

export default Home;
