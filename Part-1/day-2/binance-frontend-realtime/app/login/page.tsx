import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Login - Backpack Exchange",
  description: "Sign in to your Backpack Exchange account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
} 