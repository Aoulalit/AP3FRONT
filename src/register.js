import React, { useState } from 'react';
import './App.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegisterClick = async () => {
        if (!username || !password) {
            alert("Veuillez renseigner tous les champs.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3002/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": username,
                    "motdepasse": password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Utilisateur inscrit");
            } else {
                const errorData = await response.json();
                console.error('Erreur de connexion:', errorData.error);
                alert('Erreur lors de l\'inscription: ' + errorData.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            alert('Erreur lors de l\'inscription: ' + error.message);
        }
    };

    return (
        <div className="register">
            <form>
                <label>
                    Nom d'utilisateur:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Votre nom d'utilisateur"
                    />
                </label>
                <label>
                    Mot de passe:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                    />
                </label>
                <button type="button" onClick={handleRegisterClick}>
                    Inscription
                </button>
            </form>
        </div>
    );
};

export default Register;
