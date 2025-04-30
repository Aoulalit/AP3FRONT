import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage } from 'react-icons/fa'; // 🔥 Import d'une icône d'image cassée
import './App.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imageError, setImageError] = useState(false); // 🔥 Suivi d'erreur image
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://10.0.0.70:8082/api/products');
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

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setImageError(false); // 🔥 Réinitialiser l'état erreur image
        setIsProductModalOpen(true);
        setIsSearchModalOpen(false);
    };

    const handleEditProduct = () => {
        navigate('/product-crud');
    };

    const getProductImage = (product) => {
        if (product && product.image && product.image.startsWith('http')) {
            return product.image;
        }
        return null;
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
                        <ul className="search-results">
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

            {isProductModalOpen && selectedProduct && (
                <div className="modal active">
                    <div className="modal-content">
                        <button className="edit-button" onClick={handleEditProduct}>
                            Édition
                        </button>
                        <h3>Détails du produit</h3>

                        {/* 🔥 Gestion propre de l'affichage de l'image */}
                        {imageError || !getProductImage(selectedProduct) ? (
                            <div style={{
                                width: '100%',
                                height: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                color: '#666'
                            }}>
                                <FaImage size={64} style={{ marginBottom: '10px' }} />
                                <p>Image non disponible</p>
                            </div>
                        ) : (
                            <img
                                src={getProductImage(selectedProduct)}
                                alt={selectedProduct.nom}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '20px'
                                }}
                                onError={() => setImageError(true)}
                            />
                        )}

                        <h4>{selectedProduct.nom}</h4>
                        <p><strong>Prix :</strong> {selectedProduct.prix} €</p>
                        <p><strong>Quantité :</strong> {selectedProduct.quantite}</p>
                        <p><strong>Caractéristiques :</strong> {selectedProduct.caracteristique}</p>
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