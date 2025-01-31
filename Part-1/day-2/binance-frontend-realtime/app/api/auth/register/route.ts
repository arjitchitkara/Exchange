import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = registerSchema.parse(body);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Send to backend service
    const response = await fetch('http://localhost:3002/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: hashedPassword,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 
