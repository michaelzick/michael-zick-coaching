import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Trash2, Upload, User } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { coachIconOptions } from '@/lib/coach-content';
import {
  createCoach,
  fetchCoachByIdAdmin,
  updateCoach,
  uploadCoachImage,
} from '@/lib/api/admin';
import type { CoachIcon } from '@/types/coach';
import type { DbCoach } from '@/types/database';

const philosophySchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  icon: z.enum(['Target', 'Shield', 'Heart', 'Mountain', 'Users', 'Star']),
});

const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  text: z.string().trim().min(1, 'Testimonial is required'),
});

const urlField = z.string().trim().url('Enter a valid URL').or(z.literal(''));

const coachSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  slug: z.string().trim().min(1, 'Slug is required'),
  email: z.string().trim().email('Enter a valid email').or(z.literal('')),
  title: z.string().trim().min(1, 'Title is required'),
  short_bio: z.string().trim().min(1, 'Short bio is required'),
  bio: z.string().trim().min(1, 'Full bio is required'),
  image_url: urlField.optional(),
  booking_url: urlField.optional(),
  website_url: urlField.optional(),
  social_x: urlField.optional(),
  social_instagram: urlField.optional(),
  social_youtube: urlField.optional(),
  social_linkedin: urlField.optional(),
  philosophy: z.array(philosophySchema).min(1, 'Add at least one philosophy item'),
  testimonials: z.array(testimonialSchema),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

type CoachFormData = z.infer<typeof coachSchema>;

async function readImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      URL.revokeObjectURL(objectUrl);
      resolve({ width, height });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load the selected image.'));
    };

    image.src = objectUrl;
  });
}

export default function AdminCoachForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditing = !!id;
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: existingCoach, isLoading } = useQuery({
    queryKey: ['admin', 'coach', id],
    queryFn: () => fetchCoachByIdAdmin(id!),
    enabled: isEditing,
  });

  const form = useForm<CoachFormData>({
    resolver: zodResolver(coachSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      slug: '',
      email: '',
      title: '',
      short_bio: '',
      bio: '',
      image_url: '',
      booking_url: '',
      website_url: '',
      social_x: '',
      social_instagram: '',
      social_youtube: '',
      social_linkedin: '',
      philosophy: [{ title: '', description: '', icon: 'Target' }],
      testimonials: [],
      featured: false,
      published: false,
    },
  });

  const philosophyFields = useFieldArray({
    control: form.control,
    name: 'philosophy',
  });

  const testimonialFields = useFieldArray({
    control: form.control,
    name: 'testimonials',
  });

  useEffect(() => {
    if (!existingCoach) return;

    form.reset({
      first_name: existingCoach.firstName,
      last_name: existingCoach.lastName,
      slug: existingCoach.slug,
      email: existingCoach.email ?? '',
      title: existingCoach.title,
      short_bio: existingCoach.shortBio,
      bio: existingCoach.bio,
      image_url: existingCoach.imageUrl ?? '',
      booking_url: existingCoach.bookingUrl ?? '',
      website_url: existingCoach.websiteUrl ?? '',
      social_x: existingCoach.socialLinks.x ?? '',
      social_instagram: existingCoach.socialLinks.instagram ?? '',
      social_youtube: existingCoach.socialLinks.youtube ?? '',
      social_linkedin: existingCoach.socialLinks.linkedin ?? '',
      philosophy: existingCoach.philosophy.length > 0
        ? existingCoach.philosophy
        : [{ title: '', description: '', icon: 'Target' }],
      testimonials: existingCoach.testimonials,
      featured: existingCoach.featured,
      published: existingCoach.published,
    });
  }, [existingCoach, form]);

  const watchFirstName = form.watch('first_name');
  const watchLastName = form.watch('last_name');

  useEffect(() => {
    if (isEditing) return;

    const fullName = `${watchFirstName} ${watchLastName}`.trim();
    if (!fullName) return;

    const slug = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    form.setValue('slug', slug);
  }, [form, isEditing, watchFirstName, watchLastName]);

  const saveCoachMutation = useMutation({
    mutationFn: async (data: CoachFormData) => {
      const socialLinks = Object.fromEntries(
        [
          ['x', data.social_x],
          ['instagram', data.social_instagram],
          ['youtube', data.social_youtube],
          ['linkedin', data.social_linkedin],
        ].filter((entry): entry is [string, string] => Boolean(entry[1]?.trim())),
      );

      const payload: Partial<DbCoach> = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        slug: data.slug.trim(),
        email: data.email.trim() || null,
        title: data.title.trim(),
        short_bio: data.short_bio.trim(),
        bio: data.bio.trim(),
        image_url: data.image_url?.trim() || null,
        booking_url: data.booking_url?.trim() || null,
        website_url: data.website_url?.trim() || null,
        social_links: socialLinks,
        philosophy: data.philosophy.map((item) => ({
          ...item,
          title: item.title.trim(),
          description: item.description.trim(),
        })),
        testimonials: data.testimonials.map((item) => ({
          name: item.name.trim(),
          text: item.text.trim(),
        })),
        featured: data.featured,
        published: data.published,
      };

      if (isEditing) {
        return updateCoach(id!, payload);
      }

      return createCoach(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coaches'] });
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      toast({ title: isEditing ? 'Coach updated' : 'Coach created' });
      navigate('/admin/coaches');
    },
    onError: (error) => {
      toast({
        title: 'Failed to save coach',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      });
    },
  });

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Unsupported file type',
        description: 'Upload a JPG, PNG, or WEBP image.',
        variant: 'destructive',
      });
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Image too large',
        description: 'Coach images must be 10MB or smaller.',
        variant: 'destructive',
      });
      event.target.value = '';
      return;
    }

    try {
      const { width, height } = await readImageDimensions(file);
      if (width !== height) {
        toast({
          title: 'Square image required',
          description: 'Coach profile images must be perfectly square.',
          variant: 'destructive',
        });
        event.target.value = '';
        return;
      }

      setIsUploadingImage(true);
      const slug = form.getValues('slug') || `${form.getValues('first_name')}-${form.getValues('last_name')}`.trim();
      const publicUrl = await uploadCoachImage(file, slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      form.setValue('image_url', publicUrl, { shouldDirty: true, shouldValidate: true });
      toast({ title: 'Coach image uploaded' });
    } catch (error) {
      toast({
        title: 'Image upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isEditing ? 'Edit Coach' : 'Create New Coach'}
      </h1>

      <form onSubmit={form.handleSubmit((data) => saveCoachMutation.mutate(data))} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...form.register('first_name')} placeholder="Michael" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...form.register('last_name')} placeholder="Zick" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input {...form.register('slug')} placeholder="michael-zick" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...form.register('email')} type="email" placeholder="coach@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...form.register('title')} placeholder="Founder and Nice Guy Recovery Coach" />
            </div>

            <div className="space-y-2">
              <Label>Short Bio</Label>
              <Textarea
                {...form.register('short_bio')}
                rows={3}
                placeholder="One strong paragraph for listing cards and hero sections."
              />
            </div>

            <div className="space-y-2">
              <Label>Full Bio</Label>
              <Textarea
                {...form.register('bio')}
                rows={8}
                placeholder="Use separate paragraphs to break up the coach story."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="w-40 aspect-square bg-muted overflow-hidden flex items-center justify-center">
                {form.watch('image_url') ? (
                  <img
                    src={form.watch('image_url')}
                    alt="Coach preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <Label htmlFor="coach-image">Upload Square Image</Label>
                <Input
                  id="coach-image"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, or WEBP. Max 10MB. Image must be perfectly square.
                </p>
                {isUploadingImage && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading image...
                  </div>
                )}
                {form.watch('image_url') && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.setValue('image_url', '', { shouldDirty: true })}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Booking URL</Label>
                <Input {...form.register('booking_url')} placeholder="https://calendly.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Website URL</Label>
                <Input {...form.register('website_url')} placeholder="https://..." />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>X URL</Label>
                <Input {...form.register('social_x')} placeholder="https://x.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input {...form.register('social_instagram')} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input {...form.register('social_youtube')} placeholder="https://youtube.com/..." />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input {...form.register('social_linkedin')} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Philosophy Pillars</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => philosophyFields.append({ title: '', description: '', icon: 'Target' })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pillar
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {philosophyFields.fields.map((field, index) => (
              <div key={field.id} className="bg-muted p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Pillar {index + 1}</h3>
                  {philosophyFields.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => philosophyFields.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input {...form.register(`philosophy.${index}.title`)} placeholder="Radical Honesty" />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={form.watch(`philosophy.${index}.icon`)}
                      onValueChange={(value) => form.setValue(`philosophy.${index}.icon`, value as CoachIcon)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {coachIconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...form.register(`philosophy.${index}.description`)}
                    rows={3}
                    placeholder="Explain how this principle shapes the work."
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Testimonials</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => testimonialFields.append({ name: '', text: '' })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {testimonialFields.fields.length === 0 && (
              <p className="text-sm text-muted-foreground">No testimonials added yet.</p>
            )}
            {testimonialFields.fields.map((field, index) => (
              <div key={field.id} className="bg-muted p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Testimonial {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => testimonialFields.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...form.register(`testimonials.${index}.name`)} placeholder="Ryan I." />
                </div>
                <div className="space-y-2">
                  <Label>Testimonial</Label>
                  <Textarea
                    {...form.register(`testimonials.${index}.text`)}
                    rows={4}
                    placeholder="What changed after the work started landing?"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Published</Label>
                <p className="text-sm text-muted-foreground">Show this coach on the public site.</p>
              </div>
              <Switch
                checked={form.watch('published')}
                onCheckedChange={(value) => form.setValue('published', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Featured</Label>
                <p className="text-sm text-muted-foreground">Prioritize this coach in featured sections.</p>
              </div>
              <Switch
                checked={form.watch('featured')}
                onCheckedChange={(value) => form.setValue('featured', value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/coaches')}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={saveCoachMutation.isPending || isUploadingImage}
          >
            {(saveCoachMutation.isPending || isUploadingImage) && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {isEditing ? 'Save Changes' : 'Create Coach'}
          </Button>
        </div>
      </form>
    </div>
  );
}
