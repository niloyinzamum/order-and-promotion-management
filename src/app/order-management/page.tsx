'use client';

import React, { useEffect, useState } from 'react';
import styles from './order-management.module.css';

interface Product {
    id: string;
    name: string;
    price: number;
    weight: number;
    quantity: number;
}

interface Order {
    id: number;
    customerName: string;
    products: Product[];
    subTotal: number;
    totalDiscount: number;
    grandTotal: number;
}

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/product-management');
            const data = await response.json();
            setProducts(
                data.map((product: { id?: string; _id?: string; name: string; price: number; weight: number }) => ({
                    id: product.id || product._id,
                    name: product.name,
                    price: product.price,
                    weight: product.weight,
                    quantity: 0,
                }))
            );
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/order-management');
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const handleCreateOrder = async () => {
        const subTotal = products.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0
        );

        const totalDiscount = 0;
        const grandTotal = subTotal - totalDiscount;

        const newOrder: Order = {
            id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
            customerName,
            products: products.filter((product) => product.quantity > 0),
            subTotal,
            totalDiscount,
            grandTotal,
        };

        if (!customerName.trim()) {
            alert('Customer name is required');
            return;
        }

        if (newOrder.products.length === 0) {
            alert('At least one product with a quantity greater than 0 is required');
            return;
        }

        try {
            const response = await fetch('/api/order-management', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setOrders((prev) => [...prev, newOrder]);
                setCustomerName('');
                setProducts(products.map((product) => ({ ...product, quantity: 0 })));
                setIsCreateOrderModalOpen(false);
            } else {
                console.error('Error creating order:', data.error);
                alert(`Failed to create order: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating the order');
        }
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const closeCreateOrderModal = () => {
        setIsCreateOrderModalOpen(false);
    };

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Order Management</h1>
            <div className={styles.actions}>
                <button className={styles.button} onClick={() => setIsCreateOrderModalOpen(true)}>
                    Create New Order
                </button>
            </div>
            <div className={styles.orderList}>
                {orders.length === 0 ? (
                    <p>No orders available. Start by creating a new order.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Serial No.</th> {/* Updated column header */}
                                <th>Customer Name</th>
                                <th>Sub Total</th>
                                <th>Total Discount</th>
                                <th>Grand Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{index + 1}</td> {/* Serial number */}
                                    <td>{order.customerName}</td>
                                    <td>${order.subTotal.toFixed(2)}</td>
                                    <td>${order.totalDiscount.toFixed(2)}</td>
                                    <td>${order.grandTotal.toFixed(2)}</td>
                                    <td>
                                        <button
                                            className={styles.button}
                                            onClick={() => handleViewOrder(order)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {isModalOpen && selectedOrder && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Order Details</h2>
                        <p>
                            <strong>Order ID:</strong> {selectedOrder.id}
                        </p>
                        <p>
                            <strong>Customer Name:</strong> {selectedOrder.customerName}
                        </p>
                        <p>
                            <strong>Sub Total:</strong> ${selectedOrder.subTotal.toFixed(2)}
                        </p>
                        <p>
                            <strong>Total Discount:</strong> ${selectedOrder.totalDiscount.toFixed(2)}
                        </p>
                        <p>
                            <strong>Grand Total:</strong> ${selectedOrder.grandTotal.toFixed(2)}
                        </p>
                        <h3>Products</h3>
                        <ul>
                            {selectedOrder.products.map((product) => (
                                <li key={product.id}>
                                    {product.name} - ${product.price.toFixed(2)} x {product.quantity}
                                </li>
                            ))}
                        </ul>
                        <div className={styles.modalActions}>
                            <button className={styles.button} onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateOrderModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCreateOrder();
                            }}
                        >
                            <div className={styles.inputGroup}>
                                <label htmlFor="customerName">Customer Name</label>
                                <input
                                    type="text"
                                    id="customerName"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.productList}>
                                <h3>Products</h3>
                                {products.map((product) => (
                                    <div key={product.id} className={styles.product}>
                                        <span>{product.name}</span>
                                        <span>${product.price.toFixed(2)}</span>
                                        <span>{product.weight}kg</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={product.quantity}
                                            onChange={(e) =>
                                                setProducts((prev) =>
                                                    prev.map((p) =>
                                                        p.id === product.id
                                                            ? { ...p, quantity: parseInt(e.target.value) || 0 }
                                                            : p
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.button}>
                                    Save Order
                                </button>
                                <button
                                    type="button"
                                    className={styles.button}
                                    onClick={closeCreateOrderModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default OrderManagement;