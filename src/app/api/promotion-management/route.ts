import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Promotion from '@/models/promotions';

// Connect to MongoDB
const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
};

// GET: Fetch all promotions
export async function GET() {
    try {
        await connectToDatabase();
        const promotions = await Promotion.find();
        return NextResponse.json({ success: true, data: promotions });
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch promotions' }, { status: 500 });
    }
}

// POST: Create a new promotion
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();
        const newPromotion = new Promotion(body);
        const savedPromotion = await newPromotion.save();
        return NextResponse.json({ success: true, data: savedPromotion });
    } catch (error) {
        console.error('Error creating promotion:', error);
        return NextResponse.json({ success: false, error: 'Failed to create promotion' }, { status: 500 });
    }
}

// PUT: Update an existing promotion
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        await connectToDatabase();
        const updatedPromotion = await Promotion.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ success: true, data: updatedPromotion });
    } catch (error) {
        console.error('Error updating promotion:', error);
        return NextResponse.json({ success: false, error: 'Failed to update promotion' }, { status: 500 });
    }
}

// DELETE: Delete a promotion
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await connectToDatabase();
        await Promotion.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting promotion:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete promotion' }, { status: 500 });
    }
}

// PATCH: Toggle enable/disable status
export async function PATCH(request: Request) {
    try {
        const { id } = await request.json();
        await connectToDatabase();
        const promotion = await Promotion.findById(id);
        if (!promotion) {
            return NextResponse.json({ success: false, error: 'Promotion not found' }, { status: 404 });
        }
        promotion.enabled = !promotion.enabled;
        const updatedPromotion = await promotion.save();
        return NextResponse.json({ success: true, data: updatedPromotion });
    } catch (error) {
        console.error('Error toggling promotion status:', error);
        return NextResponse.json({ success: false, error: 'Failed to toggle promotion status' }, { status: 500 });
    }
}