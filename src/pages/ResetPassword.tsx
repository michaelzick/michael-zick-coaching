import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Lock } from "@/lib/icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { session, isLoading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const hasRecoveryParams = window.location.hash.includes("access_token")
    || window.location.hash.includes("type=recovery")
    || window.location.search.includes("token_hash")
    || window.location.search.includes("type=recovery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isWaitingForRecoverySession, setIsWaitingForRecoverySession] = useState(hasRecoveryParams);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    const { error } = await updatePassword(data.newPassword);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to reset password", description: error, variant: "destructive" });
      return;
    }

    setIsPasswordUpdated(true);
    form.reset();
    toast({ title: "Password updated", description: "Your password has been reset successfully." });
  };

  useEffect(() => {
    if (session) {
      setIsWaitingForRecoverySession(false);
      return;
    }

    if (!hasRecoveryParams) {
      setIsWaitingForRecoverySession(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsWaitingForRecoverySession(false);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [hasRecoveryParams, session]);

  if (isLoading || isWaitingForRecoverySession) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow pt-32 pb-16 px-4 bg-muted">
          <div className="container mx-auto max-w-md">
            <Card>
              <CardContent className="py-12 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-center text-muted-foreground">
                  Verifying your password reset link.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Reset Password" description="Reset your password" noIndex />
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 bg-muted">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                MICHAEL ZICK
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">Choose a new password for your account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create a New Password</CardTitle>
              <CardDescription>The reset link signed you in securely. Enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
              {isPasswordUpdated ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-foreground mb-2">Password updated</h2>
                  <p className="text-muted-foreground mb-4">
                    Your password has been reset. You can continue into the app now.
                  </p>
                  <Button onClick={() => navigate("/my-programs", { replace: true })}>
                    Go to My Programs
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter a new password"
                      {...form.register("newPassword")}
                    />
                    {form.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      {...form.register("confirmPassword")}
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    Update Password
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
