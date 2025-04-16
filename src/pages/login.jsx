import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 


const LoginPage = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  

 
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || []; 
    
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      
        
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/expenses"); 
    } else {
     
        
      setErrorMessage("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="container" style={{ width: "auto" }}>
      <h2>Login</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        
        {errorMessage && <p className="text-danger">{errorMessage}</p>}

      
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
        
      </Form>
      </div>
    </div>
  );
};

export default LoginPage;
