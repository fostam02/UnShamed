import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

export default function NotificationSettings() {
  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Notification Settings</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure system-wide email notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-new-user">New user registrations</Label>
                <p className="text-sm text-muted-foreground">
                  Send email when a new user registers
                </p>
              </div>
              <Switch id="email-new-user" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-compliance">Compliance updates</Label>
                <p className="text-sm text-muted-foreground">
                  Send email for compliance status changes
                </p>
              </div>
              <Switch id="email-compliance" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-security">Security alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send email for security-related events
                </p>
              </div>
              <Switch id="email-security" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-from">From email address</Label>
              <Input
                id="email-from"
                placeholder="notifications@unshamed.com"
                defaultValue="notifications@unshamed.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-reply-to">Reply-to email address</Label>
              <Input
                id="email-reply-to"
                placeholder="support@unshamed.com"
                defaultValue="support@unshamed.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>SMS Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure system-wide SMS notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-enabled">Enable SMS notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Allow the system to send SMS notifications
                </p>
              </div>
              <Switch id="sms-enabled" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-compliance">Compliance alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send SMS for critical compliance issues
                </p>
              </div>
              <Switch id="sms-compliance" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-security">Security alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send SMS for critical security events
                </p>
              </div>
              <Switch id="sms-security" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sms-provider">SMS Provider</Label>
              <Input
                id="sms-provider"
                placeholder="Twilio"
                defaultValue="Twilio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sms-api-key">API Key</Label>
              <Input
                id="sms-api-key"
                placeholder="Enter API key"
                type="password"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Notification Templates</CardTitle>
            </div>
            <CardDescription>
              Customize notification message templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcome-email">Welcome Email Template</Label>
                <Textarea
                  id="welcome-email"
                  rows={4}
                  defaultValue="Welcome to UnShamed! We're excited to have you join our platform. Your account has been successfully created and you can now start using our compliance tracking tools."
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {'{user_name}'}, {'{company_name}'}, {'{login_url}'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="compliance-alert">Compliance Alert Template</Label>
                <Textarea
                  id="compliance-alert"
                  rows={4}
                  defaultValue="ALERT: A compliance issue has been detected for {state_name}. Please log in to your dashboard to review and address this issue as soon as possible."
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {'{user_name}'}, {'{state_name}'}, {'{issue_type}'}, {'{dashboard_url}'}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Templates</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

