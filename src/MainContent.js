import React, { useEffect, useState, useCallback } from 'react';
import './App.css';



// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST


// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST
// TEST








function MainContent() {
    const [datas, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('nom');
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [token, setToken] = useState(null);

    // Fonction pour récupérer le token depuis sessionStorage et vérifier l'authentification
    const getToken = () => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);  // Enregistrer le token dans l'état
        }
    };


    // Récupérer les produits si l'utilisateur est authentifié
    const getDatas = async () => {
        if (!token) return;  // Ne pas récupérer les produits si le token est absent
        try {
            let response = await fetch('http://10.0.0.70:8082/api/products', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Ajouter le token dans les headers de la requête
                },
            });

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

    useEffect(() => {
        getToken(); // Récupérer le token au montage du composant
    }, []);

    useEffect(() => {
        if (token) {
            verifyToken(token);  // Vérifier si le token est valide
        }
    }, [token]);



    // Si l'utilisateur n'est pas connecté ou si le token est invalide
    if (!email) {
        return <p>Vous n'êtes pas connecté ou le token est invalide. Veuillez vous connecter pour afficher les produits.</p>;
    }

    const handleFilterClick = async () => {
        try {
            const response = await fetch(`http://10.0.0.70:8082/api/produitsOrder?order=${sortColumn}&orderBy=${sortOrder}`);
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
            const response = await fetch(`http://10.0.0.70:8082/api/searchProducts?query=${searchQuery}`);
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
                    {datas.length > 0 ? (
                        datas.map((data) => (
                            <li key={data.id_produit} className="product-item">
                                <img src={`/images/${data.image}`} alt={data.nom} height="100" />
                                <p>{data.nom} - {data.caracteristique}</p>
                                <p>{data.prix} €</p>

                            </li>
                        ))
                    ) : (
                        <li>Aucun produit disponible.</li>
                    )}
                </ul>
            </main>
        </div>
    );
}

export default MainContent;