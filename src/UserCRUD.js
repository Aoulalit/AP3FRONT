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
            const response = await fetch(`http://10.0.0.70:8082/api/users/users`);
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
            const response = await fetch(`http://10.0.0.70:8082/api/users/user`, {
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
            const response = await fetch(`http://10.0.0.70:8082/api/users/user/${id}`, {
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
            const dataToSend = {
                id_utilisateur: editUser.id_utilisateur,   // 🔥 Ici on transforme
                email: editUser.email || "",
                motdepasse: editUser.motdepasse || "",
                admin: editUser.admin || false
            };

            console.log('Données envoyées au serveur:', dataToSend);

            const response = await fetch(`http://10.0.0.70:8082/api/users/user/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
            }

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

            {showEditModal && (
                <div className="modal">
                    <div className="modal-container">

                        <h3>Modifier un utilisateur</h3>
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
                                    value={editUser?.email || ""}
                                    onChange={handleEditChange}
                                    required
                                    placeholder="Entrez l'email"
                                />
                            </div>
                            <div>
                                <label>Mot de passe (laisser vide pour ne pas changer)</label>
                                <input
                                    type="password"
                                    name="motdepasse"
                                    value={editUser?.motdepasse || ""}
                                    onChange={handleEditChange}
                                    placeholder="Laisser vide pour ne pas changer"
                                />
                            </div>
                            <div className="admin-checkbox">
                                <label htmlFor="admin">Admin</label>
                                <input
                                    id="admin"
                                    type="checkbox"
                                    name="admin"
                                    checked={editUser?.admin || false}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="button">Mettre à jour</button>
                                <button type="button" className="button cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
                            </div>
                        </form>
                    </div>

                </div>
            )
            }
        </div >
    );
};

export default UserCRUD;


