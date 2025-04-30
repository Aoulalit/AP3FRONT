import React from 'react';
import './App.css';
import { FaBoxes, FaPlusSquare, FaEdit } from 'react-icons/fa';

function Accueil() {
    return (
        <>
            <div style={{ height: "100dvh" }}>
                {/* En-tête */}
                <header className="header">
                    <div className="header-content">
                        <h1 className="header-title">Bienvenue sur le Panneau Administrateur</h1>
                        <p className="header-subtitle">Gérez votre stock, vos produits et vos catégories facilement.</p>
                    </div>
                </header>

                {/* Section des fonctionnalités */}
                <section className="features">
                    <div className="features-grid">
                        <div className="feature">
                            <FaBoxes className="feature-icon" />
                            <h2 className="feature-title">Gestion des Stocks</h2>
                            <p className="feature-description">
                                Visualisez, organisez et suivez votre inventaire en temps réel.
                            </p>
                        </div>
                        <div className="feature">
                            <FaPlusSquare className="feature-icon" />
                            <h2 className="feature-title">Ajouter des Produits</h2>
                            <p className="feature-description">
                                Ajoutez de nouveaux articles en quelques clics pour enrichir votre catalogue.
                            </p>
                        </div>
                        <div className="feature">
                            <FaEdit className="feature-icon" />
                            <h2 className="feature-title">Modifier les Produits</h2>
                            <p className="feature-description">
                                Mettez à jour les descriptions, les prix et les disponibilités de vos articles.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Pied de page */}
            <footer className="footer">
                <p className="footer-text">&copy; 2024 E-Achat Admin. Tous droits réservés.</p>
            </footer>
        </>
    );
}

export default Accueil;