import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/models/user'; // Import the User model

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

// POST: Create a new user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        return NextResponse.json({ success: true, data: savedUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
    }
}