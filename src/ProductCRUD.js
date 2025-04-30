import React, { useState, useEffect } from 'react';
import './App.css';

// // Composant ProductItem : Affiche un produit avec ses informations et boutons d'édition et de suppression
const ProductItem = ({ product, onEdit, onDelete }) => (
    <li className="product-item">
        <div>
            <h3>{product.nom}</h3>

            <p style={{ margin: '5px 0', fontSize: '14px', color: 'gray' }}>
                Stock : {product.quantite !== undefined ? product.quantite : 'N/A'}
            </p>

            <ul>
                {(Array.isArray(product.caracteristiques) ? product.caracteristiques : JSON.parse(product.caracteristiques || "[]")).map((carac, index) => (
                    <li key={index}>{carac}</li>
                ))}
            </ul>

            {/* Afficher l'image du produit */}
            <div>
                <img
                    src={product.image || 'default_image_url'} // Affiche l'image si présente, sinon une image par défaut
                    alt={product.nom}
                    style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                />
            </div>
        </div>
        <div>
            <button className="button edit" onClick={() => onEdit(product)}>Modifier</button>
            <button className="button delete" onClick={() => onDelete(product.id_produit)}>Supprimer</button>
        </div>
    </li>
);

// // Composant ProductForm : Formulaire d'ajout de produit avec champs pour le nom, prix, caractéristiques et image
const ProductForm = ({ newProduct, setNewProduct, addProduct, addCaracteristique }) => (
    <div className="product-form">
        <h2>Ajouter un produit</h2>
        <input
            type="text"
            placeholder="Nom du produit"
            value={newProduct.nom}
            onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
        />
        <input
            type="number"
            placeholder="Prix du produit"
            value={newProduct.prix}
            onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })}
        />
        <input
            type="text"
            placeholder="Caractéristiques"
            value={newProduct.caracteristiques}
            onChange={(e) => setNewProduct({ ...newProduct, caracteristiques: e.target.value })}
        />
        <input
            type="text"
            placeholder="URL de l'image du produit"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <button className="button add" onClick={() => { addCaracteristique(); addProduct(); }}>Ajouter</button>
    </div>
);

// // Composant principal ProductCRUD : Gestion de la liste des produits, ajout, modification et suppression
function ProductCRUD() {
    // // États du composant
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ nom: '', prix: '', caracteristiques: "", quantite: '', image: '' });
    const [editProduct, setEditProduct] = useState(null);
    const [newCaracteristique, setNewCaracteristique] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // // Chargement des produits au montage du composant
    useEffect(() => {
        fetchProducts();
    }, []);

    // // Fonction pour récupérer les produits depuis l'API
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://10.0.0.70:8082/api/products');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des produits.');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            alert('Erreur lors de la récupération des produits. Veuillez réessayer.');
        }
    };

    // // Fonction pour ajouter un produit via l'API
    const addProduct = async () => {
        try {
            const response = await fetch('http://10.0.0.70:8082/api/products/addproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: newProduct.nom,
                    prix: newProduct.prix,
                    caracteristique: newProduct.caracteristiques,
                    image: newProduct.image,  // Inclure l'URL de l'image
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du produit.');
            }

            const data = await response.json();
            setNewProduct({ nom: '', prix: '', caracteristiques: '', image: '' });
            fetchProducts();
            setShowAddModal(false);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            alert('Erreur lors de l\'ajout du produit. Veuillez réessayer.');
        }
    };

    // // Fonction pour supprimer un produit via l'API
    const deleteProduct = async (id) => {
        try {
            await fetch(`http://10.0.0.70:8082/api/products/deleteproduct?id=${id}`, {
                method: 'DELETE',
            });
            fetchProducts();
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            alert('Erreur lors de la suppression du produit. Veuillez réessayer.');
        }
    };

    // // Fonction pour mettre à jour un produit via l'API
    const updateProduct = async () => {
        if (editProduct) {
            try {
                const response = await fetch(`http://10.0.0.70:8082/api/products/editproduct/${editProduct.id_produit}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nom: editProduct.nom,
                        prix: editProduct.prix,
                        caracteristiques: editProduct.caracteristique,
                        quantite: newProduct.quantite,
                        image: editProduct.image,  // Mise à jour de l'image
                    }),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour du produit.');
                }

                fetchProducts();
                setShowEditModal(false);
                setEditProduct(null);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du produit:', error);
                alert('Erreur lors de la mise à jour du produit. Veuillez réessayer.');
            }
        }
    };

    // // Fonction pour ajouter une caractéristique au produit
    const addCaracteristique = () => {
        if (newCaracteristique) {
            setNewProduct(prevState => ({
                ...prevState,
                caracteristiques: [...prevState.caracteristiques.split(','), newCaracteristique].join(','),
            }));
            setNewCaracteristique('');
        }
    };

    // // Fonction pour ouvrir la modal d'édition d'un produit
    const handleEdit = (product) => {
        setEditProduct(product);
        setShowEditModal(true);
    };

    return (
        <div className="product-crud">
            {/* Titre principal de la page */}


            {/* Liste des produits */}
            <h2>Liste des produits</h2>


            <button className="button add" onClick={() => setShowAddModal(true)}>Ajouter un produit</button>
            <ul className="product-list">
                {products.map((product) => (
                    <ProductItem
                        key={product.id_produit}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={deleteProduct}
                    />
                ))}
            </ul>

            {/* Modal Ajouter un produit */}
            {showAddModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <ProductForm
                            newProduct={newProduct}
                            setNewProduct={setNewProduct}
                            addProduct={addProduct}
                            addCaracteristique={addCaracteristique}
                        />
                        <div className="modal-buttons">
                            <button className="button cancel" onClick={() => setShowAddModal(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Modifier un produit */}
            {showEditModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <h2>Modifier le produit</h2>
                        <input
                            type="text"
                            placeholder="Nom du produit"
                            value={editProduct.nom || ''}
                            onChange={(e) => setEditProduct({ ...editProduct, nom: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Prix du produit"
                            value={editProduct.prix || ''}
                            onChange={(e) => setEditProduct({ ...editProduct, prix: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Caractéristiques"
                            value={editProduct.caracteristique || ''}
                            onChange={(e) => setEditProduct({ ...editProduct, caracteristique: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Stock disponible"
                            value={editProduct.quantite || 0}
                            onChange={(e) => setEditProduct({ ...editProduct, quantite: parseInt(e.target.value) })}
                        />
                        <input
                            type="text"
                            placeholder="URL de l'image du produit"
                            value={editProduct.image || ''}
                            onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                        />
                        <div className="modal-buttons">
                            <button className="button update" onClick={updateProduct}>Mettre à jour</button>
                            <button className="button cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductCRUD;