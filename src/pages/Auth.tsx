
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { updateProfile } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signIn, signUp, signInWithGoogle, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
    
    document.title = "Sign In | Midas Touch";
  }, [user, isAdmin, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast({
        title: "Signed in successfully",
        description: "Welcome back to Midas Touch!",
      });
      // Navigation will happen via useEffect
    } catch (error: any) {
      console.error(error);
      // More descriptive error messages
      if (error.code === "auth/user-not-found") {
        toast({
          title: "No account found",
          description: "Please sign up first or check your email address",
          variant: "destructive",
        });
      } else if (error.code === "auth/wrong-password") {
        toast({
          title: "Incorrect password",
          description: "Please check your password and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name to continue",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await signUp(email, password);
      
      // Update profile with the full name
      if (result && result.user) {
        await updateProfile(result.user, {
          displayName: fullName
        });
      }
      
      toast({
        title: "Account created!",
        description: `Welcome to Midas Touch, ${fullName}!`,
      });
      // Navigation will happen via useEffect
    } catch (error: any) {
      console.error(error);
      
      if (error.code === "auth/email-already-in-use") {
        toast({
          title: "Email already in use",
          description: "This email already has an account. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      // Navigation will happen via useEffect
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error signing in with Google",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-mdpc-brown-darkest/90 dark:to-mdpc-brown-darkest">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border shadow-xl dark:bg-mdpc-brown-darkest/70 dark:backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-mdpc-gold to-mdpc-gold-dark rounded-full flex items-center justify-center shadow-gold-glow mb-2">
                <User className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl text-mdpc-blue dark:text-mdpc-gold font-heading">Welcome to Midas Touch</CardTitle>
              <CardDescription className="dark:text-mdpc-brown-light">Access your account to manage project requests and consultations</CardDescription>
            </CardHeader>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium dark:text-mdpc-brown-light">
                        <Mail className="h-4 w-4 text-mdpc-gold" />
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium dark:text-mdpc-brown-light">
                        <Lock className="h-4 w-4 text-mdpc-gold" />
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="pr-10 dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-mdpc-brown-light dark:hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button 
                      type="submit" 
                      className="w-full bg-mdpc-gold hover:bg-mdpc-gold-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                    
                    <div className="my-4 flex items-center w-full">
                      <Separator className="flex-grow dark:bg-mdpc-brown-dark/30" />
                      <span className="mx-2 text-sm text-gray-500 dark:text-mdpc-brown-light">OR</span>
                      <Separator className="flex-grow dark:bg-mdpc-brown-dark/30" />
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmitting}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium dark:text-mdpc-brown-light">
                        <User className="h-4 w-4 text-mdpc-gold" />
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="flex items-center gap-2 text-sm font-medium dark:text-mdpc-brown-light">
                        <Mail className="h-4 w-4 text-mdpc-gold" />
                        Email
                      </label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="flex items-center gap-2 text-sm font-medium dark:text-mdpc-brown-light">
                        <Lock className="h-4 w-4 text-mdpc-gold" />
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="pr-10 dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-mdpc-brown-light dark:hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button 
                      type="submit" 
                      className="w-full bg-mdpc-gold hover:bg-mdpc-gold-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing up..." : "Sign Up"}
                    </Button>
                    
                    <div className="my-4 flex items-center w-full">
                      <Separator className="flex-grow dark:bg-mdpc-brown-dark/30" />
                      <span className="mx-2 text-sm text-gray-500 dark:text-mdpc-brown-light">OR</span>
                      <Separator className="flex-grow dark:bg-mdpc-brown-dark/30" />
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmitting}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign up with Google
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
            <div className="pb-6 px-6 text-center text-sm text-muted-foreground">
              <p>By signing in, you agree to our <a href="#" className="underline text-mdpc-blue dark:text-mdpc-gold">Terms of Service</a> and <a href="#" className="underline text-mdpc-blue dark:text-mdpc-gold">Privacy Policy</a>.</p>
            </div>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
