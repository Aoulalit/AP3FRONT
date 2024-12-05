import React, { useState, useEffect } from 'react';
import './App.css'; // Importer un fichier CSS pour le style

const ProductItem = ({ product, onEdit, onDelete }) => (
    <li className="product-item">
        <h3>{product.nom} - {product.prix} €</h3>
        <ul>
            {(Array.isArray(product.caracteristiques) ? product.caracteristiques : JSON.parse(product.caracteristiques || "[]")).map((carac, index) => (
                <li key={index}>{carac}</li>
            ))}
        </ul>
        <button className="button edit" onClick={() => onEdit(product)}>Modifier</button>
        <button className="button delete" onClick={() => onDelete(product.id_produit)}>Supprimer</button>
    </li>
);

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
            placeholder="Description"
            value={newProduct.caracteristiques}
            onChange={(e) => setNewProduct({ ...newProduct, caracteristiques: e.target.value })}
        />
        <button className="button add" onClick={() => { addCaracteristique(); addProduct(); }}>Ajouter</button>
    </div>
);

function ProductCRUD() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ nom: '', prix: '', caracteristiques: "" });
    const [editProduct, setEditProduct] = useState(null);
    const [newCaracteristique, setNewCaracteristique] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/products'); // Mise à jour de l'URL
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des produits.');
            }
            const data = await response.json();
            console.log(data)
            setProducts(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            alert('Erreur lors de la récupération des produits. Veuillez réessayer.');
        }
    };

    const addProduct = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/products/addproduct', { // Mise à jour de l'URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: newProduct.nom,
                    prix: newProduct.prix,
                    caracteristique: newProduct.caracteristiques, // Stocke les caractéristiques en tableau
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du produit.');
            }

            const data = await response.json();
            console.log('Produit ajouté avec succès:', data);
            setNewProduct({ nom: '', prix: '', caracteristiques: '' });
            fetchProducts();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            alert('Erreur lors de l\'ajout du produit. Veuillez réessayer.');
        }
    };

    const deleteProduct = async (id) => {
        const url = `http://localhost:3002/api/products/deleteproduct?id=${id}`;
        console.log(`Appel de l'URL de suppression : ${url}`);
        try {
            await fetch(url, {
                method: 'DELETE',
            });
            fetchProducts();
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            alert('Erreur lors de la suppression du produit. Veuillez réessayer.');
        }
    };

    const updateProduct = async () => {
        console.log({
            nom: editProduct.nom,
            prix: editProduct.prix,
            caracteristique: editProduct.caracteristique
        })
        if (editProduct) {
            try {
                const response = await fetch(`http://localhost:3002/api/products/editproduct/${editProduct.id_produit}`, { // Mise à jour de l'URL
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nom: editProduct.nom,
                        prix: editProduct.prix,
                        caracteristiques: editProduct.caracteristique
                    }),
                });

                if (!response.ok) {
                    console.log(response);

                    throw new Error('Erreur lors de la mise à jour du produit.');
                }

                fetchProducts();
                setEditProduct(null);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du produit:', error);
                alert('Erreur lors de la mise à jour du produit. Veuillez réessayer.');
            }
        }
    };

    const addCaracteristique = () => {
        if (newCaracteristique) {
            setNewProduct(prevState => ({
                ...prevState,
                caracteristiques: [...prevState.caracteristiques.split(','), newCaracteristique].join(','), // Stockage sous forme de chaîne
            }));
            setNewCaracteristique('');
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
    };

    const handleUpdate = async () => {
        if (editProduct) {
            await updateProduct();
            setEditProduct(null);
        }
    };

    return (
        <div className="product-crud">
            <h1>Gestion des Produits</h1>
            <ProductForm
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                addProduct={addProduct}
                addCaracteristique={addCaracteristique}
            />
            <h2>Liste des produits</h2>
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
            {editProduct && (
                <div className="edit-form">
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
                    <button className="button update" onClick={handleUpdate}>Mettre à jour</button>
                    <button className="button cancel" onClick={() => setEditProduct(null)}>Annuler</button>
                </div>
            )}
        </div>
    );
}

export default ProductCRUD;
