import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import MainContent from './MainContent';

const ProductManagement = () => {
    const [affichage, setAffichage] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getRes = async () => {
        const mail = localStorage.getItem("mail");
        console.log("mail from localStorage:", mail);
        if (!mail) {
            console.error('No mail found in localStorage');
            setLoading(false);
            return;
        }

        try {
            let result = await fetch('http://localhost:3002/api/products/islogged', { // Notez bien le préfixe 'products'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail }),
            });

            if (!result.ok) {
                throw new Error('Network response was not ok: ' + result.statusText);
            }

            let data = await result.json();
            console.log("response from /islogged:", data);

            if (data.success) {
                setAffichage(true);
            } else {
                setAffichage(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Erreur lors de la vérification de la connexion. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRes();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (affichage) {
        return <MainContent />;
    } else {
        return (
            <div>
                <p>NON CONNECTE</p>
                <button onClick={() => navigate('/login')}>Se connecter</button>
            </div>
        );
    }
};

export default ProductManagement;
