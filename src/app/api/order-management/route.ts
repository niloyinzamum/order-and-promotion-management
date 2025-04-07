import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Order from '@/models/order'; // Import the Order model

// Load environment variables
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

// Connect to MongoDB
async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, {
            dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
    }
}

// GET: Fetch all orders
export async function GET() {
    try {
        await connectToDatabase();
        const orders = await Order.find(); // Use the Order model to fetch all orders
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// POST: Create a new order
// POST: Create a new order
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, products, subTotal, totalDiscount, grandTotal } = body;

        // Validate required fields
        if (!customerName || !products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields or products array is invalid' },
                { status: 400 }
            );
        }

        // Ensure each product has an `id` field
        for (const product of products) {
            if (!product.id) {
                return NextResponse.json(
                    { success: false, error: 'Each product must have an `id` field' },
                    { status: 400 }
                );
            }
        }

        // Log the payload for debugging
        console.log('Creating Order with Payload:', {
            customerName,
            products,
            subTotal,
            totalDiscount,
            grandTotal,
        });

        await connectToDatabase();

        // Create a new order using the Order model
        const newOrder = new Order({
            customerName,
            products,
            subTotal,
            totalDiscount,
            grandTotal,
        });

        const savedOrder = await newOrder.save(); // Save the order to the database
        return NextResponse.json({ success: true, data: savedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }
}