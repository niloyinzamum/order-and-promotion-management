import { NextResponse } from 'next/server';
import Product from '@/models/products';
import mongoose from 'mongoose';

// Ensure MongoDB connection
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI || '', {
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
}

// GET: Fetch all products
export async function GET() {
    try {
        const products = await Product.find({});
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Validate required fields
        if (!body.name || !body.price || !body.weight) {
            return NextResponse.json(
                { error: 'Name, price, and weight are required' },
                { status: 400 }
            );
        }

        const product = await Product.create({
            name: body.name,
            price: body.price,
            weight: body.weight,
            disabled: false // Set default value
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        
        // Handle mongoose validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    details: error.message 
                },
                { status: 400 }
            );
        }

        // Handle all other errors
        return NextResponse.json(
            { 
                error: 'Failed to create product',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Removed duplicate dbConnect function
// async function dbConnect() {
//     if (mongoose.connection.readyState === 0) {
//         try {
//             await mongoose.connect(process.env.MONGODB_URI || '');
//             console.log('Database connected successfully');
//         } catch (error) {
//             console.error('Error connecting to the database:', error);
//             throw new Error('Database connection failed');
//         }
//     }
// }