import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import logo from "@/assets/logo.svg";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "convex/react";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const updateName = useMutation(api.users.updateName);
  const ensureRole = useMutation(api.users.ensureRole);

  type Step =
    | { type: "signUpOrIn" }
    | { type: "signIn" }
    | { type: "otp"; email: string; isSignUp: boolean; name?: string };

  const [step, setStep] = useState<Step>({ type: "signUpOrIn" });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign-up fields
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  // Sign-in field
  const [signInEmail, setSignInEmail] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleSignUpEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", signUpEmail);
      await signIn("email-otp", formData);
      setStep({ type: "otp", email: signUpEmail, isSignUp: true, name: signUpName });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", signInEmail);
      await signIn("email-otp", formData);
      setStep({ type: "otp", email: signInEmail, isSignUp: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step.type !== "otp") return;
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", step.email);
      formData.set("code", otp);
      await signIn("email-otp", formData);

      // If sign-up, set name and assign role
      if (step.isSignUp && step.name) {
        try { await updateName({ name: step.name }); } catch {}
      }
      try { await ensureRole(); } catch {}

      navigate(redirect);
    } catch {
      setError("Incorrect verification code. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      try { await ensureRole(); } catch {}
      navigate(redirect);
    } catch {
      setError("Failed to continue as guest.");
    } finally {
      setIsLoading(false);
    }
  };

  const Logo = () => (
    <div className="flex justify-center">
      <img
        src={logo}
        alt="Dealiofind"
        width={56}
        height={56}
        className="rounded-lg mb-3 mt-3 cursor-pointer"
        onClick={() => navigate("/")}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-[400px] pb-0 border shadow-md">
          {/* ── Sign Up / Sign In Chooser ── */}
          {step.type === "signUpOrIn" && (
            <>
              <CardHeader className="text-center">
                <Logo />
                <CardTitle className="text-xl">Welcome to Dealiofind</CardTitle>
                <CardDescription>
                  Create an account or sign in to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUpEmail} className="space-y-3">
                  <Input
                    placeholder="Full name"
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Email address"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-9"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      disabled={isLoading || !signUpName || !signUpEmail}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    Create Account
                  </Button>
                </form>

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => setStep({ type: "signIn" })} disabled={isLoading}>
                    Sign In Instead
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleGuestLogin} disabled={isLoading}>
                    <UserX className="mr-2 h-4 w-4" />
                    Continue as Guest
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* ── Sign-In Email Entry ── */}
          {typeof step === "object" && step.type === "signIn" && (
            <>
              <CardHeader className="text-center">
                <Logo />
                <CardTitle className="text-xl">Sign In</CardTitle>
                <CardDescription>Enter your email to receive a code</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignInEmail}>
                <CardContent>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Email address"
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-9"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button type="submit" variant="outline" size="icon" disabled={isLoading || !signInEmail}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                  <div className="mt-4">
                    <Button type="button" variant="outline" className="w-full"                        onClick={() => setStep({ type: "signUpOrIn" })} disabled={isLoading}>
                      Back to Sign Up
                    </Button>
                  </div>
                </CardContent>
              </form>
            </>
          )}

          {/* ── OTP Verification ── */}
          {typeof step === "object" && step.type === "otp" && (
            <>
              <CardHeader className="text-center mt-4">
                <CardTitle>Check your email</CardTitle>
                <CardDescription>
                  We've sent a 6-digit code to {step.email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          (e.target as HTMLElement).closest("form")?.requestSubmit();
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Didn't receive a code?{" "}
                    <Button variant="link" className="p-0 h-auto"                        onClick={() => setStep({ type: "signUpOrIn" })}>
                      Try again
                    </Button>
                  </p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                    ) : (
                      <>Verify Code<ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                  <Button type="button" variant="ghost"                        onClick={() => setStep({ type: "signUpOrIn" })} disabled={isLoading} className="w-full">
                    Use different email
                  </Button>
                </CardFooter>
              </form>
            </>
          )}

          <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
            Secured by{" "}
            <a href="https://freebuff.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
              freebuff.com
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
