import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginClick = async () => {
        try {
            const response = await fetch('http://10.0.0.70:8082/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    motdepasse: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                // Stocker le token JWT dans sessionStorage
                sessionStorage.setItem("token", data.token); // Le token JWT est ici
                localStorage.setItem("email", username); // L'email est stocké dans localStorag

                onLogin(username); // Vous pouvez également passer des infos utilisateur ici si nécessaire
                navigate('/product-management');
            } else {
                const errorData = await response.json();
                alert('Login échoué: ' + errorData.error);
            }
        } catch (error) {
            alert('Erreur durant le login: ' + error.message);
        }
    };
    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="login-page">
            <form>
                <label>
                    Nom d'utilisateur :
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Votre nom d'utilisateur"
                    />
                </label>
                <label>
                    Mot de passe :
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                    />
                </label>
                <button type="button" onClick={handleLoginClick}>
                    Connexion
                </button>
                <button type="button" onClick={handleRegisterClick}>
                    S'inscrire
                </button>
            </form>
        </div>
    );
};

export default Login;