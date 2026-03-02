import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, User, Lock, Upload } from '@/lib/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AdminSettings() {
  const { user, profile, updatePassword, updateProfile } = useAuth();
  const { toast } = useToast();
  const [avatarUploading, setAvatarUploading] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    const { error } = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (error) {
      toast({ title: 'Failed to update profile', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated successfully' });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    const { error } = await updatePassword(data.newPassword);

    if (error) {
      toast({ title: 'Failed to update password', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated successfully' });
      passwordForm.reset();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setAvatarUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error } = await updateProfile({ avatarUrl: publicUrl });
      if (error) throw new Error(error);

      toast({ title: 'Avatar updated successfully' });
    } catch (err: any) {
      toast({ title: 'Failed to upload avatar', description: err.message, variant: 'destructive' });
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="h-4 w-4" />
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your name and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-20 w-20 bg-muted border-2 border-foreground flex items-center justify-center overflow-hidden">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild disabled={avatarUploading}>
                      <span>
                        {avatarUploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Avatar
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Name fields */}
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register('firstName')}
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register('lastName')}
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email ?? ''} disabled />
                  <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>

                <Button
                  type="submit"
                  disabled={profileForm.formState.isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {profileForm.formState.isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {passwordForm.formState.isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
