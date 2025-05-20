
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Globe } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  
  // Redirect if authenticated
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-mdpc-brown-darkest">
      <Card className="w-full max-w-md p-4 bg-white dark:bg-mdpc-brown-darkest shadow-md rounded-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-mdpc-brown-dark dark:text-mdpc-gold">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-mdpc-brown-dark dark:text-mdpc-brown-light">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="block text-mdpc-brown-dark dark:text-mdpc-brown-light">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button disabled={loading} className="w-full bg-mdpc-gold text-white hover:bg-mdpc-gold-dark">
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border-mdpc-brown/30 dark:border-mdpc-gold/20"
              onClick={handleGoogleSignIn}
            >
              <Globe className="h-5 w-5" />
              Sign In with Google
            </Button>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-mdpc-blue dark:text-mdpc-gold hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-mdpc-blue dark:text-mdpc-gold hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
