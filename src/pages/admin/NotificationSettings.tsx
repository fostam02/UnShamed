import React from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export const NotificationSettings = () => {
  return (
    <AdminPageLayout title="Notification Settings">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="userRegistration">User Registration</Label>
              <Switch id="userRegistration" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="passwordReset">Password Reset</Label>
              <Switch id="passwordReset" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="securityAlerts">Security Alerts</Label>
              <Switch id="securityAlerts" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">SMTP Configuration</h3>
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" placeholder="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input id="smtpPort" type="number" defaultValue={587} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUser">SMTP Username</Label>
            <Input id="smtpUser" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPass">SMTP Password</Label>
            <Input id="smtpPass" type="password" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Template Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="welcomeEmail">Welcome Email Template</Label>
            <Textarea
              id="welcomeEmail"
              placeholder="Enter welcome email template..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Test Email</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </AdminPageLayout>
  );
};