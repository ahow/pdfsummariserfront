import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, Mail, FolderOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    google_drive_folder_id: '',
    notification_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updateSettings } = useAuth();

  useEffect(() => {
    if (user) {
      setSettings({
        google_drive_folder_id: user.google_drive_folder_id || '',
        notification_email: user.notification_email || user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateSettings(settings);

    if (result.success) {
      setSuccess('Settings saved successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError(result.error || 'Failed to save settings');
    }

    setLoading(false);
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Google Drive integration and notification preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="google-drive" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="google-drive" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Google Drive Configuration
                  </CardTitle>
                  <CardDescription>
                    Specify which Google Drive folder to monitor for new PDF files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="google_drive_folder_id">Google Drive Folder ID</Label>
                    <Input
                      id="google_drive_folder_id"
                      name="google_drive_folder_id"
                      type="text"
                      placeholder="Enter folder ID (optional - leave blank to scan entire drive)"
                      value={settings.google_drive_folder_id}
                      onChange={handleChange}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      To find the folder ID, open the folder in Google Drive and copy the ID from the URL. 
                      For example, in https://drive.google.com/drive/folders/1ABC123xyz, the ID is "1ABC123xyz".
                      Leave blank to scan your entire Google Drive.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">How to set up Google Drive access:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Go to the Google Cloud Console</li>
                      <li>Create a new project or select an existing one</li>
                      <li>Enable the Google Drive API</li>
                      <li>Create credentials (OAuth 2.0 client ID)</li>
                      <li>Download the credentials file and place it in the application directory</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure where to send weekly summary emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification_email">Notification Email</Label>
                    <Input
                      id="notification_email"
                      name="notification_email"
                      type="email"
                      placeholder="Enter email address for weekly summaries"
                      value={settings.notification_email}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500">
                      Weekly summary emails will be sent to this address every Monday morning.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Email Summary Features:</h4>
                    <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                      <li>Summaries of all PDFs added in the past week</li>
                      <li>Key messages and important points highlighted</li>
                      <li>Direct links to view documents in Google Drive</li>
                      <li>Clean, professional email format</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

