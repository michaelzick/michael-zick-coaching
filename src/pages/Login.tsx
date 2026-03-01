import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

const passwordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

export default function Login() {
  const { signIn, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const from = (location.state as { from?: string })?.from || "/";

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Sign in failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate(from, { replace: true });
    }
  };

  const onMagicLinkSubmit = async (data: MagicLinkFormData) => {
    setIsSubmitting(true);
    const { error } = await signInWithMagicLink(data.email);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to send link", description: error, variant: "destructive" });
    } else {
      setMagicLinkSent(true);
      toast({ title: "Check your email", description: "We sent you a magic link to sign in." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 bg-muted">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                MICHAEL ZICK
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your programs</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Choose your preferred sign-in method</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="password">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="password" className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    Password
                  </TabsTrigger>
                  <TabsTrigger value="magic-link" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Magic Link
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="password">
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...passwordForm.register("email")}
                      />
                      {passwordForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...passwordForm.register("password")}
                      />
                      {passwordForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="magic-link">
                  {magicLinkSent ? (
                    <div className="text-center py-6">
                      <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
                      <p className="text-muted-foreground mb-4">
                        We sent a magic link to your email. Click the link to sign in.
                      </p>
                      <Button variant="ghost" onClick={() => setMagicLinkSent(false)}>
                        Send another link
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="magic-email">Email</Label>
                        <Input
                          id="magic-email"
                          type="email"
                          placeholder="Enter your email"
                          {...magicLinkForm.register("email")}
                        />
                        {magicLinkForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{magicLinkForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Magic Link
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              <div className="text-center text-sm mt-6">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
