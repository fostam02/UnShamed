import React from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SecuritySettings = () => {
  return (
    <AdminPageLayout title="Security Settings">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Authentication</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa">Two-Factor Authentication</Label>
              <Switch id="2fa" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sso">Single Sign-On (SSO)</Label>
              <Switch id="sso" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password Policy</h3>
          <div className="space-y-2">
            <Label htmlFor="minLength">Minimum Password Length</Label>
            <Input id="minLength" type="number" defaultValue={8} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiration">Password Expiration (days)</Label>
            <Input id="expiration" type="number" defaultValue={90} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complexity">Password Complexity</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Session Management</h3>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input id="sessionTimeout" type="number" defaultValue={30} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="forceLogout">Force Logout on Password Change</Label>
            <Switch id="forceLogout" defaultChecked />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </AdminPageLayout>
  );
};