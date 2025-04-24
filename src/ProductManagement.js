import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import './App.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false); // Modal pour afficher les détails du produit
    const [selectedProduct, setSelectedProduct] = useState(null); // Produit sélectionné pour afficher les détails
    const navigate = useNavigate(); // Utilisation du hook de navigation

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error('Erreur lors du chargement des produits.');
                }
            } catch (error) {
                console.error('Erreur réseau : ', error);
            }
        };
        fetchProducts();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const result = products.filter((product) =>
            product.nom.toLowerCase().includes(query.toLowerCase()) ||
            (product.caracteristique && product.caracteristique.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredProducts(result);
    };

    // Fonction pour afficher le modal avec les détails du produit
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
        setIsSearchModalOpen(false); // Ferme le modal de recherche si ouvert
    };

    // Fonction pour rediriger vers ProductCRUD
    const handleEditProduct = () => {
        navigate('/product-crud'); // Redirection vers la page ProductCRUD
    };

    return (
        <div className="product-management-container">
            <h2>Liste des produits</h2>
            <button className="button search-btn" onClick={() => setIsSearchModalOpen(true)}>
                Rechercher un produit
            </button>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id_produit} className="product-item" onClick={() => handleProductClick(product)}>
                        <h3>{product.nom}</h3>
                        <p>Prix : {product.prix} €</p>
                        <p>Quantité : {product.quantite}</p>
                    </li>
                ))}
            </ul>

            {/* Modal pour rechercher des produits */}
            {isSearchModalOpen && (
                <div className="modal active">
                    <div className="modal-content">
                        <h3>Recherche de produit</h3>
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="search-input-modal"
                        />
                        <ul className="product-list">
                            {filteredProducts.length === 0 ? (
                                <p>Aucun produit trouvé.</p>
                            ) : (
                                filteredProducts.map((product) => (
                                    <li key={product.id_produit} className="product-item" onClick={() => handleProductClick(product)}>
                                        <h3>{product.nom}</h3>
                                        <p>Prix : {product.prix} €</p>
                                    </li>
                                ))
                            )}
                        </ul>
                        <button className="button cancel" onClick={() => setIsSearchModalOpen(false)}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {/* Modal pour afficher les détails du produit */}
            {isProductModalOpen && selectedProduct && (
                <div className="modal active">
                    <div className="modal-content">
                        <button className="edit-button" onClick={handleEditProduct}>Édition</button> {/* Bouton "Édition" */}
                        <h3>Détails du produit</h3>
                        <img src={selectedProduct.image} alt={selectedProduct.nom} style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }} />
                        <h4>{selectedProduct.nom}</h4>
                        <p><strong>Prix:</strong> {selectedProduct.prix} €</p>
                        <p><strong>Quantité:</strong> {selectedProduct.quantite}</p>
                        <p><strong>Caractéristiques:</strong> {selectedProduct.caracteristique}</p>
                        <button className="button cancel" onClick={() => setIsProductModalOpen(false)}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;