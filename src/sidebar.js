import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ isLoggedIn, onLogout }) => {
    console.log('isLoggedIn:', isLoggedIn); // Vérifiez l'état de connexion

    return (
        <div className="sidebar">
            <nav>
                <div>
                    <Link to="/">Accueil</Link>
                </div>
                {!isLoggedIn && (
                    <div>
                        <Link to="/login">Connexion</Link>
                    </div>
                )}
                {!isLoggedIn && (
                    <div>
                        <Link to="/register">Inscription</Link>
                    </div>
                )}
                {isLoggedIn && (
                    <div>
                        <Link to="/user-crud">Utilisateurs</Link>
                    </div>
                )}
                {isLoggedIn && (
                    <>
                        <div>
                            <Link to="/product-management">Produits</Link>
                        </div>
                        <div>
                            <Link to="/product-crud">Stock</Link> {/* Lien vers la page CRUD */}
                        </div>
                        <div>
                            <Link to="/compte">Compte</Link>
                        </div>
                        <div>
                            <button onClick={onLogout} className="logout-button">Déconnexion</button>
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;
