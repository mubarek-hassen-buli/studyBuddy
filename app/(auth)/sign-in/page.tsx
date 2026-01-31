"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { BrainCircuit, Mail, Lock, CheckCircle2, BookOpen, Star } from "lucide-react";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("[SignIn] Login failed:", error);
        setError(error.message || "Invalid credentials");
      } else {
        console.log("[SignIn] Login success! User:", data.user.email);
        setUser(data.user);
        console.log("[SignIn] Hard redirecting to /dashboard...");
        window.location.href = "/dashboard";
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-transparent selection:bg-primary/20 relative overflow-hidden">
      
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 z-10 bg-white/80 backdrop-blur-xl border-r border-white/20">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-12">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <span className="text-primary" style={{ fontFamily: 'var(--font-grezia)' }}>MyBuddy</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Sign in</h1>
            <p className="text-slate-500">Master your subjects with AI by your side.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel className="text-slate-700 font-semibold mb-2">Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="pl-11 py-6 border-slate-200 focus:border-primary focus:ring-primary/5 transition-all rounded-xl shadow-sm"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </Field>

              <Field>
                <div className="flex items-center justify-between mb-2">
                  <FieldLabel className="text-slate-700 font-semibold">Password</FieldLabel>
                  <Link href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-11 py-6 border-slate-200 focus:border-primary focus:ring-primary/5 transition-all rounded-xl shadow-sm"
                    {...register("password")}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </Field>

              <div className="flex items-center gap-2 py-2">
                 <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" {...register("rememberMe")} />
                 <span className="text-sm text-slate-600">Remember me</span>
              </div>
            </FieldGroup>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <Button 
                type="submit" 
                className="w-full py-7 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual/Brand Panel */}
      <div className="hidden lg:flex flex-col justify-center p-8 bg-slate-900/10 backdrop-blur-md border-l border-white/10 relative overflow-hidden">
        {/* Decorative elements */}
         <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            <BrainCircuit className="w-96 h-96 text-primary" />
         </div>
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

         <div className="relative z-10 max-w-lg mx-auto">
            <div className="aspect-[4/5] relative rounded-[40px] shadow-2xl overflow-hidden p-10 flex flex-col justify-between text-white border border-slate-800">
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0" 
                  style={{ backgroundImage: 'url("/images/Study-date.jpg")' }}
                />
                <div className="absolute inset-0 bg-slate-900/60 z-10" />

                <div className="relative z-20">
                   <BrainCircuit className="w-16 h-16 text-primary mb-8" />
                   <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome to <br/>MyBuddy</h2>
                   <p className="text-slate-200 text-lg">Your AI-powered study companion that stays within your materials.</p>
                </div>
                
                <div className="relative z-20 bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                     <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                     </div>
                     <p className="text-sm italic text-slate-100 font-medium">"This app transformed how I study for my medical exams. The isolated buddies are a game changer."</p>
                     <div className="mt-6 flex items-center gap-3">
                        <div className="flex -space-x-2 mr-2">
                           {['rody', 'goy', 'hss', 'doe'].map((name) => (
                             <img 
                               key={name}
                               src={`/images/${name}.jpg`} 
                               alt={name}
                               className="h-8 w-8 rounded-full border-2 border-slate-900 object-cover"
                             />
                           ))}
                        </div>
                        <div>
                            <p className="text-sm font-bold">Emma J.</p>
                            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Pre-med Student</p>
                        </div>
                     </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
