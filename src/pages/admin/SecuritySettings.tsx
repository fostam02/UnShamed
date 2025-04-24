import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Shield, Lock, Key } from 'lucide-react';

export default function SecuritySettings() {
  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Security Settings</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Authentication</CardTitle>
            </div>
            <CardDescription>
              Configure authentication methods and security policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Two-factor authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all admin users
                </p>
              </div>
              <Switch id="two-factor" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="password-expiry">Password expiry</Label>
                <p className="text-sm text-muted-foreground">
                  Force password reset every 90 days
                </p>
              </div>
              <Switch id="password-expiry" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="account-lockout">Account lockout</Label>
                <p className="text-sm text-muted-foreground">
                  Lock account after 5 failed login attempts
                </p>
              </div>
              <Switch id="account-lockout" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Password Policy</CardTitle>
            </div>
            <CardDescription>
              Configure password requirements and complexity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-length">Minimum password length</Label>
              <Select defaultValue="8">
                <SelectTrigger id="min-length">
                  <SelectValue placeholder="Select minimum length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 characters</SelectItem>
                  <SelectItem value="8">8 characters</SelectItem>
                  <SelectItem value="10">10 characters</SelectItem>
                  <SelectItem value="12">12 characters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-uppercase">Require uppercase letters</Label>
                <p className="text-sm text-muted-foreground">
                  At least one uppercase letter
                </p>
              </div>
              <Switch id="require-uppercase" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-numbers">Require numbers</Label>
                <p className="text-sm text-muted-foreground">
                  At least one number
                </p>
              </div>
              <Switch id="require-numbers" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-special">Require special characters</Label>
                <p className="text-sm text-muted-foreground">
                  At least one special character
                </p>
              </div>
              <Switch id="require-special" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>API Security</CardTitle>
            </div>
            <CardDescription>
              Manage API keys and access tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    value="sk_live_51NzUBtGj8ZRMj1T9OZRmOr6J5XyQqZR"
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline">Regenerate</Button>
                  <Button variant="outline">Copy</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This key provides full access to your account. Keep it secure.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Secret</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-secret"
                    value="whsec_8ZRMj1T9OZRmOr6J5XyQqZRMj1T9OZRm"
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline">Regenerate</Button>
                  <Button variant="outline">Copy</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Used to verify webhook requests from our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
