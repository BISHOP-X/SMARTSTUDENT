import { useState, useEffect } from "react";
import { Camera, Save, ShieldCheck, User as UserIcon, Mail, Phone, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { userRole, isDemo, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (isDemo) {
        // Set demo data
        setDisplayName(userRole === "student" ? "Alex Morgan" : "Dr. Morgan");
        setPhone("+1 (555) 123-4567");
        setParentPhone("+1 (555) 987-6543");
        return;
      }

      if (!user?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, parent_phone')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
        }

        if (data) {
          const profile = data as { full_name?: string; phone?: string; parent_phone?: string };
          setDisplayName(profile.full_name || user.email?.split('@')[0] || '');
          setPhone(profile.phone || '');
          setParentPhone(profile.parent_phone || '');
        } else {
          // No profile yet, use email
          setDisplayName(user.email?.split('@')[0] || '');
        }
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, isDemo, userRole]);

  const getEmail = () => {
    if (isDemo) return "alex@student.edu";
    return user?.email || "user@example.com";
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = async () => {
    if (isDemo) {
      toast({
        title: "Demo Mode",
        description: "Changes aren't saved in demo mode. Create an account to save your profile!",
      });
      return;
    }

    if (!user?.id) return;

    setIsSaving(true);
    try {
      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: displayName,
        phone: phone || null,
        parent_phone: parentPhone || null,
        role: userRole || 'student',
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('profiles') as any).upsert(profileData);

      if (error) throw error;

      toast({
        title: "Profile saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      const err = error as Error;
      console.error('Save error:', err);
      toast({
        title: "Save failed",
        description: err.message || "Could not save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation activeTab="profile" onTabChange={() => {}} onLogout={() => {}} />
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account details</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {userRole === "lecturer" ? "Lecturer" : "Student"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback>
                    <UserIcon className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="secondary" className="gap-2" onClick={() => document.getElementById("avatar-upload")?.click()}>
                  <Camera className="w-4 h-4" />
                  Upload
                </Button>
                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>These details identify you in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-md px-3 py-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{getEmail()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    {userRole === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="parentPhone" 
                            type="tel"
                            placeholder="+1 (555) 987-6543"
                            value={parentPhone} 
                            onChange={(e) => setParentPhone(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-md px-3 py-2">
                      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{userRole === "lecturer" ? "Lecturer" : "Student"}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
