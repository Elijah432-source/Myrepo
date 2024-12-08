const apiURL = 'https://fakestoreapi.com/products';
const categoriesURL = 'https://fakestoreapi.com/products/categories';

async function fetchProducts() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Error loading products. Please try again later.');
        return [];
    }
}

const fetchCategories = async () => {
    try {
        const response = await fetch(categoriesURL);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Error loading categories. Default categories will be used.');
        return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    }
};

const displayProducts = (products) => {
    const tableBody = document.querySelector('#product-table');
    tableBody.innerHTML = ''; 
    products.forEach(product => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-100');
        row.innerHTML = `
            <td class="p-4"><img src="${product.image}" alt="${product.title}" class="w-16"></td>
            <td class="p-4">${product.title}</td>
            <td class="p-4">$${product.price.toFixed(2)}</td>
            <td class="p-4">${product.category}</td>
        `;
        tableBody.appendChild(row);
    });
};

const filterProducts = (products, query, category) => {
    return products.filter(product => {
        const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = !category || product.category === category;
        return matchesQuery && matchesCategory;
    });
};

const initializeApp = async () => {
    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
    const categoryFilter = document.getElementById('category-filter');
    const searchBar = document.getElementById('search-bar');

    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Categories';
    categoryFilter.appendChild(defaultOption);

    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });

    
    displayProducts(products);

    
    searchBar.addEventListener('input', () => {
        const filteredProducts = filterProducts(products, searchBar.value, categoryFilter.value);
        displayProducts(filteredProducts);
    });

    categoryFilter.addEventListener('change', () => {
        const filteredProducts = filterProducts(products, searchBar.value, categoryFilter.value);
        displayProducts(filteredProducts);
    });
};

document.addEventListener('DOMContentLoaded', initializeApp);
