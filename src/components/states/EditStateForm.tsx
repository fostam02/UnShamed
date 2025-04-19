
import React, { useState } from 'react';
import { StateProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditStateFormProps {
  state: StateProfile;
  onSave: (data: Partial<StateProfile>) => void;
  onCancel: () => void;
}

const stateFormSchema = z.object({
  name: z.string().min(2, { message: "State name must be at least 2 characters." }),
  abbreviation: z.string().min(1, { message: "Abbreviation is required." }).max(2, { message: "Abbreviation should be 1-2 characters." }),
  description: z.string().optional(),
  investigator: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  }).optional(),
  supervisingProvider: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  }).optional(),
  complianceMonitor: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
    monitorName: z.string().optional(),
    monitorEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
    frequency: z.string().optional(),
    startDate: z.string().optional(),
  }).optional(),
});

type StateFormValues = z.infer<typeof stateFormSchema>;

const EditStateForm: React.FC<EditStateFormProps> = ({ state, onSave, onCancel }) => {
  const form = useForm<StateFormValues>({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      name: state.name,
      abbreviation: state.abbreviation,
      description: state.description,
      investigator: state.investigator || { name: '', phone: '', email: '' },
      supervisingProvider: state.supervisingProvider || { name: '', phone: '', email: '' },
      complianceMonitor: state.complianceMonitor || { 
        name: '', 
        phone: '', 
        email: '',
        monitorName: state.complianceMonitor?.monitorName || '',
        monitorEmail: state.complianceMonitor?.monitorEmail || '',
        frequency: state.complianceMonitor?.frequency || 'monthly',
        startDate: state.complianceMonitor?.startDate || '',
      },
    },
  });

  const handleSubmit = (data: StateFormValues) => {
    // Fix for the type error: ensure investigator has a name property if provided
    const investigator = data.investigator ? {
      name: data.investigator.name || '', // Provide a default empty string
      phone: data.investigator.phone || '',
      email: data.investigator.email || ''
    } : undefined;

    // Prepare compliance monitor data to match the expected format
    const complianceMonitor = data.complianceMonitor ? {
      name: data.complianceMonitor.name || '',
      phone: data.complianceMonitor.phone || '',
      email: data.complianceMonitor.email || '',
      monitorName: data.complianceMonitor.monitorName || data.complianceMonitor.name || '',
      monitorEmail: data.complianceMonitor.monitorEmail || data.complianceMonitor.email || '',
      frequency: data.complianceMonitor.frequency || 'monthly',
      startDate: data.complianceMonitor.startDate || new Date().toISOString(),
    } : null;

    // Ensure supervisingProvider has proper structure if provided
    const supervisingProvider = data.supervisingProvider ? {
      name: data.supervisingProvider.name || '',
      phone: data.supervisingProvider.phone || '',
      email: data.supervisingProvider.email || ''
    } : undefined;

    onSave({
      ...data,
      investigator,
      supervisingProvider,
      complianceMonitor
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Name</FormLabel>
                  <FormControl>
                    <Input placeholder="State name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abbreviation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CA" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description for this state" 
                      className="resize-none" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-6">
            <div className="border p-4 rounded-md">
              <h3 className="font-medium text-lg mb-3">Investigator Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="investigator.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Investigator name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investigator.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Investigator phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investigator.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Investigator email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium text-lg mb-3">Supervising Provider Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="supervisingProvider.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Provider name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supervisingProvider.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Provider phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supervisingProvider.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Provider email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium text-lg mb-3">Compliance Monitor Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="complianceMonitor.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Monitor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complianceMonitor.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Monitor phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complianceMonitor.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Monitor email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complianceMonitor.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Frequency</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complianceMonitor.startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditStateForm;
