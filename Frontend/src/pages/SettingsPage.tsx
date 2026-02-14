import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useBriefData } from '@/hooks/useBriefData';
import {
    Settings as SettingsIcon,
    Moon,
    Sun,
    Monitor,
    Bell,
    Mail,
    Save,
    Globe,
    Key,
    Trash2,
    Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
    const { settings, updateSettings, clearHistory } = useBriefData();
    const [apiKey, setApiKey] = useState(settings.apiKey || '');
    const [showApiKey, setShowApiKey] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        updateSettings({ theme });
    };

    const handleDefaultAudienceChange = (audience: string) => {
        updateSettings({ defaultAudience: audience });
    };

    const handleAutoSaveToggle = (autoSave: boolean) => {
        updateSettings({ autoSave });
    };

    const handleEmailNotificationsToggle = (email: boolean) => {
        updateSettings({
            notifications: { ...settings.notifications, email }
        });
    };

    const handlePushNotificationsToggle = (push: boolean) => {
        updateSettings({
            notifications: { ...settings.notifications, push }
        });
    };

    const handleLanguageChange = (language: string) => {
        updateSettings({ language });
    };

    const handleMaxHistoryChange = (value: string) => {
        const maxHistoryItems = parseInt(value);
        if (!isNaN(maxHistoryItems) && maxHistoryItems > 0) {
            updateSettings({ maxHistoryItems });
        }
    };

    const handleApiKeySave = () => {
        updateSettings({ apiKey });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const audiences = [
        { value: 'executives', label: 'Executives' },
        { value: 'managers', label: 'Managers' },
        { value: 'technical', label: 'Technical Team' },
        { value: 'general', label: 'General Audience' },
    ];

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'zh', label: 'Chinese' },
    ];

    return (
        <div className="flex min-h-screen bg-background w-full">
            <DashboardSidebar />
            <main className="flex-1 min-w-0">
                <header className="h-16 border-b border-border flex items-center px-6">
                    <h1 className="font-display font-semibold text-lg">Settings</h1>
                </header>

                <div className="p-6 max-w-4xl mx-auto space-y-6">
                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                            <CardDescription>
                                Customize how BrieflyAI looks on your device
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleThemeChange('light')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                                            settings.theme === 'light'
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <Sun className="h-5 w-5" />
                                        <span className="text-sm font-medium">Light</span>
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('dark')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                                            settings.theme === 'dark'
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <Moon className="h-5 w-5" />
                                        <span className="text-sm font-medium">Dark</span>
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('system')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                                            settings.theme === 'system'
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <Monitor className="h-5 w-5" />
                                        <span className="text-sm font-medium">System</span>
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Default Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SettingsIcon className="h-5 w-5" />
                                Default Settings
                            </CardTitle>
                            <CardDescription>
                                Set your preferred defaults for new briefs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="default-audience">Default Audience</Label>
                                <Select
                                    value={settings.defaultAudience}
                                    onValueChange={handleDefaultAudienceChange}
                                >
                                    <SelectTrigger id="default-audience">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {audiences.map((audience) => (
                                            <SelectItem key={audience.value} value={audience.value}>
                                                {audience.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select
                                    value={settings.language}
                                    onValueChange={handleLanguageChange}
                                >
                                    <SelectTrigger id="language">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto-save briefs</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically save all generated briefs
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.autoSave}
                                    onCheckedChange={handleAutoSaveToggle}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>
                                Manage how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive updates via email
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.email}
                                    onCheckedChange={handleEmailNotificationsToggle}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        Push notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications in your browser
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notifications.push}
                                    onCheckedChange={handlePushNotificationsToggle}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                API Configuration
                            </CardTitle>
                            <CardDescription>
                                Configure your FastAPI backend connection
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="api-key">API Key (Optional)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="api-key"
                                        type={showApiKey ? 'text' : 'password'}
                                        placeholder="Enter your API key"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                    >
                                        {showApiKey ? 'Hide' : 'Show'}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Your API key will be used to authenticate with the FastAPI backend for NLP processing
                                </p>
                            </div>
                            <Button onClick={handleApiKeySave} className="w-full">
                                {saved ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save API Key
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5" />
                                Data Management
                            </CardTitle>
                            <CardDescription>
                                Manage your stored data and history
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="max-history">Maximum history items</Label>
                                <Input
                                    id="max-history"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={settings.maxHistoryItems}
                                    onChange={(e) => handleMaxHistoryChange(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Older items will be automatically removed when this limit is reached
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear All History
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete all your brief history.
                                                Saved briefs will not be affected. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={clearHistory}>
                                                Clear History
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>

                    {/* About */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-sm text-muted-foreground">
                                <p>BrieflyAI v1.0.0</p>
                                <p className="mt-1">
                                    Ready for FastAPI backend integration with NLP processing
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
