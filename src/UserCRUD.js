import React, { useState, useEffect } from 'react';

const UserCRUD = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ email: '', motdepasse: '', admin: false });
    const [editUser, setEditUser] = useState(null); // To store the user to be edited
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // For editing user modal
    const [loading, setLoading] = useState(true);

    // Récupère les utilisateurs depuis l'API
    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:3002/api/users/users`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs.');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Erreur de récupération des utilisateurs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Charger les utilisateurs au montage du composant
    useEffect(() => {
        fetchUsers();
    }, []);

    // Gère l'ajout d'un utilisateur
    const handleAddUser = async () => {
        try {
            const response = await fetch(`http://localhost:3002/api/users/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout de l'utilisateur.");
            }

            // Réinitialiser le formulaire et rafraîchir la liste
            setNewUser({ email: '', motdepasse: '', admin: false });
            setShowAddModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        }
    };

    // Gère la suppression d'un utilisateur
    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:3002/api/users/user/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression de l'utilisateur.");
            }

            fetchUsers(); // Rafraîchir la liste des utilisateurs
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };

    // Gère la modification d'un utilisateur
    const handleEditUser = async () => {
        try {
            const response = await fetch(`http://localhost:3002/api/users/user/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
            }

            // Rafraîchir la liste des utilisateurs
            setShowEditModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        }
    };

    // Gère les changements dans les champs du formulaire
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditUser((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="user-crud">
            <h2>Gestion des utilisateurs</h2>

            {loading ? (
                <p>Chargement des utilisateurs...</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="3">Aucun utilisateur trouvé</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id_utilisateur}>
                                    <td>{user.email}</td>
                                    <td>{user.admin ? 'Oui' : 'Non'}</td>
                                    <td>
                                        <button onClick={() => {
                                            setEditUser(user);
                                            setShowEditModal(true);
                                        }}>
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id_utilisateur)}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            <button onClick={() => setShowAddModal(true)}>Ajouter un utilisateur</button>

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Ajouter un utilisateur</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddUser();
                            }}
                        >
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    name="motdepasse"
                                    value={newUser.motdepasse}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Admin</label>
                                <input
                                    type="checkbox"
                                    name="admin"
                                    checked={newUser.admin}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <button type="submit">Ajouter</button>
                                <button type="button" onClick={() => setShowAddModal(false)}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Modifier l'utilisateur</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleEditUser();
                            }}
                        >
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editUser.email}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    name="motdepasse"
                                    value={editUser.motdepasse}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Admin</label>
                                <input
                                    type="checkbox"
                                    name="admin"
                                    checked={editUser.admin}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <button type="submit">Mettre à jour</button>
                                <button type="button" onClick={() => setShowEditModal(false)}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCRUD;


