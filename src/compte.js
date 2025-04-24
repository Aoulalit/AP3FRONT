import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Compte = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [token, setToken] = useState(null);

    // Récupérer le token et l'email depuis localStorage et vérifier l'authentification
    const getTokenAndEmail = () => {
        const storedToken = localStorage.getItem('token');  // Utilisation de localStorage ici
        const storedEmail = localStorage.getItem('email');  // Utilisation de localStorage ici
        console.log('Token:', storedToken, 'Email:', storedEmail);  // Ajout de logs pour vérifier les données
        if (storedToken && storedEmail) {
            setToken(storedToken);
            setEmail(storedEmail);
        } else {
            console.log("Token ou email manquant dans localStorage");
        }
    };

    useEffect(() => {
        getTokenAndEmail();  // Appeler la fonction pour récupérer les données à l'ouverture de la page
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        try {
            const response = await fetch('http://localhost:3002/api/users/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: email,
                    oldPassword,
                    newPassword,
                }),
            });
            const data = await response.json();
            console.log('Réponse:', data);
            if (data.success) {
                alert('Mot de passe changé avec succès');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            alert('Erreur lors du changement de mot de passe');
        }
    };

    return (
        <div className="compte-page">
            <h1>Mon Compte</h1>
            <div className="info-utilisateur">
                <p><strong>Email:</strong> {email}</p>
            </div>
            <div className="change-password">
                <h2>Changer le mot de passe</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
                    <label>
                        Ancien mot de passe:
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Nouveau mot de passe:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Confirmer le nouveau mot de passe:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Changer le mot de passe</button>
                </form>
            </div>
        </div>
    );
};

export default Compte;