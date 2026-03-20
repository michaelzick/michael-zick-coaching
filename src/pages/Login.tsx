import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, KeyRound, Loader2, Lock } from '@/lib/icons';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

const passwordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type EmailFormData = z.infer<typeof emailSchema>;

export default function Login() {
  const { signIn, signInWithMagicLink, requestPasswordReset, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const from = (location.state as { from?: string })?.from || "/";
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
  const localMailInboxUrl = import.meta.env.VITE_SUPABASE_INBUCKET_URL;
  const showLocalMailInbox = import.meta.env.DEV
    && /^(http:\/\/)(127\.0\.0\.1|localhost):\d+$/.test(supabaseUrl)
    && Boolean(localMailInboxUrl);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const magicLinkForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const resetPasswordForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    if (!isLoading && user) {
      navigate(from, { replace: true });
    }
  }, [from, isLoading, navigate, user]);

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

  const onMagicLinkSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    const { error } = await signInWithMagicLink(data.email);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to send link", description: error, variant: "destructive" });
    } else {
      setMagicLinkSent(true);
      toast({ title: "Check Your Email", description: "We sent you a magic link to sign in." });
    }
  };

  const onResetPasswordSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    const { error } = await requestPasswordReset(data.email);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to send reset link", description: error, variant: "destructive" });
    } else {
      setResetLinkSent(true);
      toast({ title: "Check Your Email", description: "We sent you a password reset link." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Sign In" description="Sign in to Nice Guy University" noIndex />
      <Navbar />

      <main className="flex-grow mobile-shell bg-muted pb-16 pt-32">
        <div className="container mx-auto max-w-md content-stack">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                MICHAEL ZICK
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your courses</p>
          </div>

          <Card className="content-stack">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Choose a password, magic link, or reset email.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="password">
                <TabsList className="mb-6 grid w-full grid-cols-1 gap-2 border-0 bg-transparent p-0 sm:grid-cols-3 sm:gap-0 sm:border sm:border-border sm:bg-muted sm:p-1">
                  <TabsTrigger value="password" className="justify-start gap-2 whitespace-normal px-3 text-left text-[11px] leading-tight sm:justify-center sm:text-center sm:text-xs">
                    <KeyRound className="hidden h-4 w-4 sm:block" />
                    Password
                  </TabsTrigger>
                  <TabsTrigger value="magic-link" className="justify-start gap-2 whitespace-normal px-3 text-left text-[11px] leading-tight sm:justify-center sm:text-center sm:text-xs">
                    <Mail className="hidden h-4 w-4 sm:block" />
                    Magic Link
                  </TabsTrigger>
                  <TabsTrigger value="reset-password" className="justify-start gap-2 whitespace-normal px-3 text-left text-[11px] leading-tight sm:justify-center sm:text-center sm:text-xs">
                    <Lock className="hidden h-4 w-4 sm:block" />
                    Reset
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
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
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
                      <Mail className="h-12 w-12 text-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Check Your Email</h3>
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
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Magic Link
                      </Button>
                    </form>
                  )}
                </TabsContent>

                <TabsContent value="reset-password">
                  {resetLinkSent ? (
                    <div className="text-center py-6">
                      <Mail className="h-12 w-12 text-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Check Your Email</h3>
                      <p className="text-muted-foreground mb-4">
                        We sent you a password reset link. Open it to choose a new password.
                      </p>
                      <Button variant="ghost" onClick={() => setResetLinkSent(false)}>
                        Send another reset link
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your email"
                          {...resetPasswordForm.register("email")}
                        />
                        {resetPasswordForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{resetPasswordForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll send you a password reset link that returns to this app.
                      </p>
                      <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              {showLocalMailInbox && (
                <Alert className="mt-6 border-foreground/20 bg-foreground/5">
                  <AlertTitle>Local email inbox</AlertTitle>
                  <AlertDescription>
                    Local Supabase auth emails are captured at{" "}
                    <a
                      href={localMailInboxUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-foreground underline underline-offset-4"
                    >
                      {localMailInboxUrl}
                    </a>
                    .
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center text-sm mt-6">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-foreground underline hover:text-foreground/70">
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
