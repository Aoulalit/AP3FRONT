import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

function MainContent() {
    const [datas, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('nom');
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);

    const getDatas = async () => {
        try {
            let response = await fetch('http://localhost:3002/api/products');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des produits: ' + response.statusText);
            }
            let data = await response.json();
            console.log("Produits:", data);
            setData(data); // Mettez à jour l'état avec les produits récupérés
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
        }
    };

    const getEmail = () => {
        const emailFromStorage = sessionStorage.getItem('mail');
        if (emailFromStorage) {
            setEmail(emailFromStorage);
        }
    };

    const getCart = useCallback(async () => {
        if (!email) return; // Ne pas récupérer le panier si l'email est vide
        try {
            const response = await fetch(`http://localhost:3002/api/cart?email=${email}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du panier: ' + response.statusText);
            }
            const cartData = await response.json();
            setCart(Array.isArray(cartData) ? cartData : []);
        } catch (error) {
            console.error('Erreur lors de la récupération du panier:', error);
            alert('Erreur lors de la récupération du panier. Veuillez réessayer.');
        }
    }, [email]);

    useEffect(() => {
        getEmail(); // Récupérer l'email au montage du composant
    }, []);

    useEffect(() => {
        if (email) {
            getDatas(); // Récupérer les produits si l'utilisateur est connecté
            if (isCartVisible) {
                getCart(); // Récupérer le panier si visible
            }
        }
    }, [email, isCartVisible]);

    // Si l'utilisateur n'est pas connecté, affichez le message
    if (!email) {
        return <p>Vous n'êtes pas connecté. Veuillez vous connecter pour afficher les produits.</p>;
    }

    const handleFilterClick = async () => {
        try {
            const response = await fetch(`http://localhost:3002/api/produitsOrder?order=${sortColumn}&orderBy=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Erreur lors du filtrage des produits: ' + response.statusText);
            }
            const filteredData = await response.json();
            setData(Array.isArray(filteredData) ? filteredData : []);
        } catch (error) {
            console.error('Une erreur de filtrage est survenue:', error);
            alert('Erreur lors du filtrage des produits. Veuillez réessayer.');
        }
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const changeSortColumn = (column) => {
        setSortColumn(column);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3002/api/searchProducts?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche des produits: ' + response.statusText);
            }
            const searchData = await response.json();
            setData(Array.isArray(searchData) ? searchData : []);
        } catch (error) {
            console.error('Erreur lors de la recherche des produits:', error);
            alert('Erreur lors de la recherche des produits. Veuillez réessayer.');
        }
    };

    const handleReserveClick = async (productId) => {
        const reservedProduct = datas.find((data) => data.id_produit === productId);
        if (!reservedProduct) {
            console.error('Produit non trouvé');
            return;
        }

        const existingProductIndex = cart.findIndex(item => item.id_produit === productId && item.email === email);

        if (existingProductIndex > -1) {
            // Si le produit existe déjà dans le panier, on augmente la quantité
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantite += 1;
            setCart(updatedCart);
        } else {
            // Sinon, on ajoute un nouveau produit au panier
            setCart([...cart, { ...reservedProduct, quantite: 1, email, date: new Date().toISOString().slice(0, 10) }]);
        }

        try {
            const response = await fetch('http://localhost:3002/api/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_produit: reservedProduct.id_produit,
                    nom_produit: reservedProduct.nom,
                    email,
                    date: new Date().toISOString().slice(0, 10),
                    quantite: existingProductIndex > -1 ? cart[existingProductIndex].quantite + 1 : 1,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout au panier: ' + response.statusText);
            }

            console.log('Produit ajouté au panier');
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
        }
    };

    const handleConfirmCart = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/confirmCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, cart }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la confirmation du panier: ' + response.statusText);
            }

            console.log('Panier confirmé');
            setCart([]); // Réinitialiser le panier
            setIsCartVisible(false); // Fermer le panier
        } catch (error) {
            console.error('Erreur lors de la confirmation du panier:', error);
            alert('Erreur lors de la confirmation du panier. Veuillez réessayer.');
        }
    };

    return (
        <div className="main-content">
            <header className="App-header">
                <h1>Location de matériel multimédia</h1>
                <button className="cart-button" onClick={() => setIsCartVisible(true)}>Consulter le panier</button>
            </header>
            <main className="App-main">
                <div className="filter-sort">
                    <button onClick={() => setFiltersVisible(!filtersVisible)}>Filtre</button>
                    {filtersVisible && (
                        <div className="filter-options">
                            <button onClick={() => { changeSortColumn('nom'); handleFilterClick(); }}>Trier par Nom</button>
                            <button onClick={() => { changeSortColumn('prix'); handleFilterClick(); }}>Trier par Prix</button>
                            <button onClick={toggleSortOrder}>Changer l'ordre de tri</button>
                            <form onSubmit={handleSearchSubmit} className="search-form">
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button type="submit">Rechercher</button>
                            </form>
                        </div>
                    )}
                </div>
                <ul className="item-list">
                    {datas.map((data) => (
                        <li key={data.id_produit} className="product-item">
                            <img src={`/images/${data.image}`} alt={data.nom} height="100" />
                            <p>{data.nom} {data.caracteristique}</p>
                            <p>{data.prix} €</p>
                            <button onClick={() => handleReserveClick(data.id_produit)}>Réserver</button>
                        </li>
                    ))}
                </ul>
                {isCartVisible && (
                    <div className="cart-modal">
                        <div className="cart-content">
                            <h2>Panier</h2>
                            <ul>
                                {cart.map((product, index) => (
                                    <li key={index}>
                                        {product.nom_produit} - ID Produit: {product.id_produit} - Quantité: {product.quantite} - Date: {product.date}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleConfirmCart}>Confirmer le panier</button>
                            <button onClick={() => setIsCartVisible(false)}>Fermer</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default MainContent;
