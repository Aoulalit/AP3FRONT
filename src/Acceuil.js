import React from 'react';
import './App.css';

function Accueil() {
    return (
        <div className="main-content">
            <header className="header">
                <h1>Bienvenue sur ACHAT</h1>
                <p>Explorez notre plateforme pour trouver les meilleures offres d'achat en ligne.</p>
            </header>
            <section className="features">
                <div className="feature">
                    <h2>Acheter facilement</h2>
                    <p>Commander des biens en toute simplicité grâce à notre interface conviviale.</p>
                </div>
                <div className="feature">
                    <h2>Trouvez rapidement ce dont vous avez besoin</h2>
                    <p>Utilisez notre puissant moteur de recherche pour trouver rapidement les biens qui correspondent à vos besoins.</p>
                </div>
                <div className="feature">
                    <h2>Contactez-nous en cas de besoin</h2>
                    <p>Notre équipe est là pour répondre à toutes vos questions et vous aider à profiter au maximum de notre service.</p>
                </div>
            </section>
            <footer className="footer">
                <p>&copy; 2024 Achat en ligne. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default Accueil;
