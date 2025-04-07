import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/products';

// Ensure MongoDB connection
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
}

// // GET: Fetch a single product by ID
// export async function GET({ params }: { params: { id: string } }) {
//     try {
//         const product = await Product.findById(params.id);
//         if (!product) {
//             return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//         }
//         return NextResponse.json(product);
//     } catch (error) {
//         console.error('Error fetching product:', error);
//         return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
//     }
// }


export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const product = await Product.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE: Delete a product by ID
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Product deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}