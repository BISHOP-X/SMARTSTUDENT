import { useState } from "react";
import { Camera, Save, ShieldCheck, Upload, User as UserIcon, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { userRole } = useAuth();
  const [displayName, setDisplayName] = useState("Alex Morgan");
  const [email] = useState("alex@student.edu");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      console.log("Avatar uploaded", file.name);
    }
  };

  const handleSave = () => {
    console.log("Saving profile", { displayName, avatarPreview });
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-md px-3 py-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{email}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-md px-3 py-2">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{userRole === "lecturer" ? "Lecturer" : "Student"}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
