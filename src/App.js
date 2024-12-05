import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import ProductManagement from './ProductManagement';
import Sidebar from './sidebar';
import Accueil from './Acceuil';
import Register from './register';
import Compte from './compte';
import ProductCRUD from './ProductCRUD'; // Importation du nouveau composant CRUD

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem('token', 'some-token');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
  };



  return (
    <Router>
      <div className="App">
        <Sidebar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product-management" element={isLoggedIn ? <ProductManagement /> : <Navigate to="/login" />} />
            <Route path="/product-crud" element={isLoggedIn ? <ProductCRUD /> : <Navigate to="/login" />} /> {/* Ajout de la route CRUD */}
            <Route path="/compte" element={isLoggedIn ? <Compte /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
