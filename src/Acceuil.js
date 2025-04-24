import React from 'react';
import './App.css';
import { FaShoppingCart, FaSearch, FaHeadset } from 'react-icons/fa';

function Accueil() {
    return (
        <>
            <div className='' style={{
                height: "100dvh"
            }}>


                {/* En-tête */}
                <header className="header">
                    <div className="header-content">
                        <h1 className="header-title">Bienvenue sur E-Achat</h1>
                        <p className="header-subtitle">Explorez notre plateforme pour découvrir les meilleures offres en ligne.</p>
                    </div>
                </header>

                {/* Section des fonctionnalités */}
                <section className="features">
                    <div className="features-grid">
                        <div className="feature">
                            <FaShoppingCart className="feature-icon" />
                            <h2 className="feature-title">Achetez facilement</h2>
                            <p className="feature-description">
                                Commandez des produits en toute simplicité grâce à une navigation intuitive.
                            </p>
                        </div>
                        <div className="feature">
                            <FaSearch className="feature-icon" />
                            <h2 className="feature-title">Trouvez rapidement</h2>
                            <p className="feature-description">
                                Recherchez rapidement des produits qui répondent à vos besoins avec notre moteur de recherche puissant.
                            </p>
                        </div>
                        <div className="feature">
                            <FaHeadset className="feature-icon" />
                            <h2 className="feature-title">Support client</h2>
                            <p className="feature-description">
                                Une équipe dédiée est disponible pour répondre à toutes vos questions.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Pied de page */}
            <footer className="footer">
                <p className="footer-text">&copy; 2024 E-Achat. Tous droits réservés.</p>
            </footer>

        </>
    );
}

export default Accueil;