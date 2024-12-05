import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { RotatingLines } from "react-loader-spinner";

const Compte = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userEmail = sessionStorage.getItem('mail'); // Récupérer l'email à partir de la clé 'mail'
        if (userEmail) {
            setEmail(userEmail);
            setLoading(false);
        } else {
            setError('Utilisateur non connecté');
            setLoading(false);
        }
    }, []);
    

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        try {
            const response = await fetch('http://localhost:3002/utilisateurweb/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    oldPassword,
                    newPassword,
                }),
            });
            const data = await response.json();
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

    if (loading) {
        return (
            <div className="spinner">
                <RotatingLines strokeColor="#000" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
                <div>Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>NON CONNECTE</p>
                <button onClick={() => navigate('/login')}>Se connecter</button>
            </div>
        );
    }

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
