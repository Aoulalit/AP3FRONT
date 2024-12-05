import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ isLoggedIn, onLogout }) => {
    console.log('isLoggedIn:', isLoggedIn); // Vérifiez l'état de connexion

    return (
        <div className="sidebar">
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
                <>
                    <div>
                        <Link to="/product-management">Gestion des Produits</Link>
                    </div>
                    <div>
                        <Link to="/product-crud">CRUD des Produits</Link> {/* Lien vers la page CRUD */}
                    </div>
                    <div>
                        <Link to="/compte">Compte</Link>
                    </div>
                    <div>
                        <button onClick={onLogout} className="logout-button">Déconnexion</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
