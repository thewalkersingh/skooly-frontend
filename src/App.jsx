import React, {Suspense} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

const SchoolList = React.lazy(() => import('./components/School/SchoolList'));
const SchoolForm = React.lazy(() => import('./components/School/SchoolForm'));
const Login = React.lazy(() => import('./components/Auth/Login'));
const Signup = React.lazy(() => import('./components/Auth/Signup'));
const Contact = React.lazy(() => import('./components/Contact/Contact'));

function App() {
  return (
    <Router>
      <Navbar/>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/schools" replace/>}/>
          <Route path="/schools" element={<SchoolList/>}/>
          <Route path="/schools/new" element={<SchoolForm/>}/>
          <Route path="/schools/:id/edit" element={<SchoolForm/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/contact" element={<Contact/>}/>
        
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;