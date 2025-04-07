'use client';

import React, { useState, useEffect } from 'react';
import styles from './product-management.module.css';

interface Product {
    _id: string;
    name: string;
    price: string;
    weight: string;
    disabled: boolean;
}

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/product-management');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setWeight('');
        setIsEditing(false);
        setEditingProductId(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = { name, price, weight };

        try {
            if (isEditing && editingProductId) {
                await fetch(`/api/product-management/${editingProductId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            } else {
                await fetch('/api/product-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product:', error);
        }
    };

    const handleDisable = async (id: string) => {
        try {
            await fetch(`/api/product-management/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ disabled: true }),
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to disable product:', error);
        }
    };

    const handleEnable = async (id: string) => {
        try {
            await fetch(`/api/product-management/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ disabled: false }),
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to enable product:', error);
        }
    };

    const handleEdit = (product: Product) => {
        setIsEditing(true);
        setEditingProductId(product._id);
        setName(product.name);
        setPrice(product.price);
        setWeight(product.weight);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/product-management/${id}`, {
                method: 'DELETE',
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Product Management</h1>
            
            <div className={styles.actions}>
                <button 
                    className={styles.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Product
                </button>
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="price">Price:</label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="weight">Weight:</label>
                                <input
                                    type="text"
                                    id="weight"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.button}>
                                    {isEditing ? 'Update' : 'Add'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className={styles.button}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.productList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Weight</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.weight}</td>
                                <td>{product.disabled ? 'Disabled' : 'Active'}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className={styles.button}
                                    >
                                        Edit
                                    </button>
                                    {product.disabled ? (
                                        <button
                                            onClick={() => handleEnable(product._id)}
                                            className={styles.button}
                                        >
                                            Enable
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDisable(product._id)}
                                            className={styles.button}
                                        >
                                            Disable
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className={styles.button}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;