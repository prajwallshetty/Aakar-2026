'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
      } else {
        router.push('/AdminPortal');
        router.refresh();
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-muted px-4 sm:px-8">
      <div className="bg-background w-full max-w-md rounded-lg border border-border p-8 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-primary p-3 rounded-full">
            <LockKeyhole className="w-6 h-6 text-white" />
          </div>
          <h2 className="ml-3 text-2xl font-bold text-foreground">Admin Portal</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Admin Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In to Admin'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <Link href="/">
            <Button variant="outline" className="cursor-pointer">Back to Main Site</Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 hidden lg:block h-96 w-64">
        <div
          className="absolute inset-0 bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: "url('/admin-illustration.png')" }}
        />
      </div>
    </div>
  );
};

export default AdminLogin;