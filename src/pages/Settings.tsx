import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Sun, Moon, Bell, Globe, Save } from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [language] = useState("English (US)");

  const handleSave = () => {
    console.log("Saving settings", {
      darkMode,
      emailNotifications,
      pushNotifications,
      assignmentReminders,
      language,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation activeTab="settings" onTabChange={() => {}} onLogout={() => {}} />
      <main className="flex-1 overflow-auto p-8 pb-20 space-y-6 md:pb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Control your preferences and notifications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Appearance
            </CardTitle>
            <CardDescription>Choose your theme preference</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Use a dark theme for low-light environments</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Email notifications</Label>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Push notifications</Label>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Assignment reminders</Label>
              <Switch checked={assignmentReminders} onCheckedChange={setAssignmentReminders} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </CardTitle>
            <CardDescription>Select your language preference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-foreground">{language}</p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />
        <div className="flex justify-end">
          <Button className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
