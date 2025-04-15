import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './layout/header'
import Login from './pages/login'
import SignUp from './pages/signup'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Home from './pages/home'
import Expense from './pages/expense'


function App() {


  return (
    <>
      
        

          <Header />

        
        <div className=' container'>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              

            </Routes>
          </BrowserRouter>
        </div>
     



    </>
  )
}

export default App
