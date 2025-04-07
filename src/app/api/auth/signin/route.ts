import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '@/models/user'; // Import the User model

// Load environment variables
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;
const jwtSecret = process.env.JWT_SECRET!; // Add JWT_SECRET to your .env file

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

// POST: Authenticate user and return JWT
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate a JWT
        const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '1h' });

        return NextResponse.json({ success: true, token });
    } catch (error) {
        console.error('Error during sign-in:', error);
        return NextResponse.json({ success: false, error: 'Failed to authenticate user' }, { status: 500 });
    }
}