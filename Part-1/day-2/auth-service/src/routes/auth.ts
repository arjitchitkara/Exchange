import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

interface User {
    id: string;
    email: string;
    password: string;
}

interface UserResponse {
    message?: string;
    id?: string;
    email?: string;
}

interface ErrorResponse {
    message: string;
    [key: string]: any;
}

// Basic authentication endpoints
router.post('/register', async (req, res) => {
    try {
        const { email, password } = registerSchema.parse(req.body);
        
        // Hash password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const PRISMA_URL = process.env.PRISMA_URL || 'http://localhost:3002';
        console.log(`Attempting to register user with Prisma at ${PRISMA_URL}`);
        
        // Store hashed password
        const response = await fetch(`${PRISMA_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password: hashedPassword  // Send hashed password to Prisma
            }),
        });

        if (!response.ok) {
            const error = await response.json() as ErrorResponse;
            console.error('Prisma service error:', {
                status: response.status,
                statusText: response.statusText,
                error,
                email // log email but never password
            });
            return res.status(response.status).json(error);
        }

        const userData = await response.json() as User;
        console.log('User registered successfully:', { email: userData.email, id: userData.id });
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: userData.id, email: userData.email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input data',
                errors: error.errors
            });
        }
        
        // More specific error handling
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return res.status(503).json({ 
                message: 'Unable to reach database service',
                error: error.message
            });
        }
        
        res.status(500).json({ 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const PRISMA_URL = process.env.PRISMA_URL || 'http://localhost:3002';
        
        // Get user
        const response = await fetch(`${PRISMA_URL}/api/users/${email}`);
        const user = await response.json() as UserResponse;

        if (!user || user.message === 'User not found') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Simple JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'super-secret',
            { expiresIn: '7d' }
        );

        res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/me', async (req, res) => {
    try {
        // TODO: Implement get current user logic
        res.status(200).json({ message: 'Current user details' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router as authRouter }; 