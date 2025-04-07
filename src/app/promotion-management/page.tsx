'use client';

import React, { useEffect, useState } from 'react';
import styles from './promotion-management.module.css';

interface Slab {
    minWeight: number;
    maxWeight: number;
    discount: number;
}

interface Promotion {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    enabled: boolean;
    discountType?: string;
    slabs?: Slab[];
}

const PromotionManagement: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);

    // Fetch promotions from the API
    useEffect(() => {
        fetchPromotions();
    }, []);
    
    const fetchPromotions = async () => {
        try {
            const response = await fetch('/api/promotion-management');
            const data = await response.json();
            if (data.success) {
                const formattedPromotions = data.data.map((promotion: Omit<Promotion, 'id'> & { _id: number }) => ({
                    ...promotion,
                    id: promotion._id, // Map _id to id
                }));
                console.log('Fetched Promotions:', formattedPromotions); // Log the formatted promotions
                setPromotions(formattedPromotions);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleCreate = () => {
        setCurrentPromotion(null); // Reset current promotion for creation
        setIsModalOpen(true);
    };

    const handleEdit = (promotion: Promotion) => {
        setCurrentPromotion(promotion); // Set the promotion to be edited
        setIsModalOpen(true);
    };

    const handleToggleEnable = async (id: number) => {
        console.log('Toggling enable for ID:', id); // Log the ID being sent
        try {
            const response = await fetch('/api/promotion-management', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }), // Ensure the ID is sent in the request body
            });
            const data = await response.json();
            if (data.success) {
                console.log('Backend response:', data); // Log the backend response
                setPromotions((prev) => {
                    const updatedPromotions = prev.map((p) =>
                        p.id === id ? { ...p, enabled: !p.enabled } : p
                    );
                    console.log('Updated promotions state:', updatedPromotions); // Log the updated state
                    return updatedPromotions;
                });
            } else {
                console.error('Failed to toggle promotion status:', data.error);
            }
        } catch (error) {
            console.error('Error toggling promotion status:', error);
        }
    };

    const handleSave = async (promotion: Promotion) => {
        try {
            if (currentPromotion) {
                // Update existing promotion
                const response = await fetch('/api/promotion-management', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...promotion, id: currentPromotion.id }),
                });
                const data = await response.json();
                if (data.success) {
                    setPromotions((prev) =>
                        prev.map((p) => (p.id === currentPromotion.id ? data.data : p))
                    );
                }
            } else {
                // Create new promotion
                const response = await fetch('/api/promotion-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(promotion),
                });
                const data = await response.json();
                if (data.success) {
                    setPromotions((prev) => [...prev, data.data]);
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving promotion:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch('/api/promotion-management', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                setPromotions((prev) => prev.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
        }
    };

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Promotion Management</h1>
            <div className={styles.actions}>
                <button className={styles.button} onClick={handleCreate}>
                    Create New Promotion
                </button>
            </div>
            <div className={styles.promotionList}>
                <h2>Promotion List</h2>
                {promotions.length === 0 ? (
                    <p>No promotions available. Start by creating a new promotion.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promotion) => (
                                <tr key={promotion.id}>
                                    <td>{promotion.title}</td>
                                    <td>{promotion.startDate}</td>
                                    <td>{promotion.endDate}</td>
                                    <td>{promotion.enabled ? 'Enabled' : 'Disabled'}</td>
                                    <td>
                                        <button
                                            className={styles.button}
                                            onClick={() => handleEdit(promotion)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`${styles.button} ${
                                                promotion.enabled ? styles.disableButton : styles.enableButton
                                            }`}
                                            onClick={() => handleToggleEnable(promotion.id)}
                                        >
                                            {promotion.enabled ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(promotion.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {isModalOpen && (
                <PromotionModal
                    promotion={currentPromotion}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </main>
    );
};

interface PromotionModalProps {
    promotion: Promotion | null;
    onSave: (promotion: Promotion) => void;
    onClose: () => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ promotion, onSave, onClose }) => {
    const [title, setTitle] = useState(promotion?.title || '');
    const [startDate, setStartDate] = useState(promotion?.startDate || '');
    const [endDate, setEndDate] = useState(promotion?.endDate || '');
    const [discountType, setDiscountType] = useState(promotion?.discountType || 'percentage');
    const [slabs, setSlabs] = useState(
        promotion?.slabs || [{ minWeight: 0, maxWeight: 0, discount: 0 }]
    );

    const handleAddSlab = () => {
        setSlabs([...slabs, { minWeight: 0, maxWeight: 0, discount: 0 }]);
    };

    const handleRemoveSlab = (index: number) => {
        setSlabs(slabs.filter((_, i) => i !== index));
    };

    const handleSlabChange = (index: number, field: string, value: number) => {
        const updatedSlabs = slabs.map((slab, i) =>
            i === index ? { ...slab, [field]: value } : slab
        );
        setSlabs(updatedSlabs);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: promotion?.id || 0,
            title,
            startDate,
            endDate,
            discountType,
            slabs,
            enabled: promotion?.enabled || true,
        });
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>{promotion ? 'Edit Promotion' : 'Create Promotion'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="discountType">Discount Type</label>
                        <select
                            id="discountType"
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                            <option value="weighted">Weighted</option>
                        </select>
                    </div>
                    {discountType === 'weighted' && (
                        <div className={styles.slabs}>
                            <h3>Slabs</h3>
                            {slabs.map((slab, index) => (
                                <div key={index} className={styles.slab}>
                                    <input
                                        type="number"
                                        placeholder="Min Weight"
                                        value={slab.minWeight}
                                        onChange={(e) =>
                                            handleSlabChange(index, 'minWeight', parseFloat(e.target.value))
                                        }
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Weight"
                                        value={slab.maxWeight}
                                        onChange={(e) =>
                                            handleSlabChange(index, 'maxWeight', parseFloat(e.target.value))
                                        }
                                    />
                                    <input
                                        type="number"
                                        placeholder="Discount"
                                        value={slab.discount}
                                        onChange={(e) =>
                                            handleSlabChange(index, 'discount', parseFloat(e.target.value))
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSlab(index)}
                                        className={styles.removeSlabButton}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSlab}
                                className={styles.addSlabButton}
                            >
                                Add Slab
                            </button>
                        </div>
                    )}
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.button}>
                            Save
                        </button>
                        <button type="button" className={styles.button} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromotionManagement;