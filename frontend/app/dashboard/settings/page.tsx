"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Mail, Shield, Bell, Moon, LogOut, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, checkSession } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await authClient.updateUser({
        name: name,
      });
      await checkSession(); // Refresh local session
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage your account preferences and profile.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="space-y-4">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Personal Information</span>
           </h3>
           <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden bg-white/60 backdrop-blur-md">
              <CardContent className="p-8 space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="pl-11 py-6 rounded-2xl border-slate-200 focus-visible:ring-primary" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input defaultValue={user?.email || ""} className="pl-11 py-6 rounded-2xl border-slate-200 bg-slate-50" readOnly />
                       </div>
                    </div>
                 </div>
                 <div className="pt-4">
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={isUpdating}
                      className="rounded-xl px-8 py-6 font-bold shadow-lg hover:shadow-xl" 
                      variant="secondary"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                    <p className="text-xs text-slate-400 mt-4 font-medium italic">Some information is synced from your primary account.</p>
                 </div>
              </CardContent>
           </Card>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              <span>Preferences</span>
           </h3>
           <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden bg-white/60 backdrop-blur-md">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Moon className="w-5 h-5 text-slate-600" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">Dark Mode (Coming Soon)</p>
                          <p className="text-sm text-slate-500 font-medium">Auto-switch based on system settings.</p>
                       </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                       <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                    </div>
                 </div>

                
              </CardContent>
           </Card>
        </section>

        {/* Dangerous Area */}
        <section className="space-y-4">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Account Security</span>
           </h3>
           <Card className="rounded-[32px] border-red-50 shadow-sm overflow-hidden bg-red-50/10 border-dashed">
              <CardContent className="p-8 flex items-center justify-between">
                 <div>
                    <h4 className="font-bold text-slate-900">Session Management</h4>
                    <p className="text-sm text-slate-500 font-medium mt-1">Sign out of your current session on this device.</p>
                 </div>
                 <Button onClick={handleSignOut} variant="destructive" className="rounded-xl px-8 py-6 font-bold bg-white  shadow-lg ">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                 </Button>
              </CardContent>
           </Card>
        </section>
      </div>
    </div>
  );
}
