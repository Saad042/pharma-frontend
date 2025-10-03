import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: (user: { username: string; email: string; role: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });

      const data = await res.json();

      // Store tokens
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Get user info
      const userRes = await apiRequest("GET", "/api/auth/me");
      const userData = await userRes.json();

      onLogin(userData);

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/auth/register", {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });

      toast({
        title: "Registration successful",
        description: "You can now login with your credentials",
      });

      // Switch to login form
      setIsLogin(true);
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
            <Pill className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">PharmaCare</h1>
            <p className="text-muted-foreground">Management System</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access the system"
                : "Register a new account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  data-testid="input-username"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    data-testid="input-confirm-password"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid={isLogin ? "button-login" : "button-register"}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword("");
                  setConfirmPassword("");
                  setEmail("");
                }}
                className="text-primary hover:underline"
                data-testid="button-toggle-form"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
