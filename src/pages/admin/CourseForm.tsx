import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Trash2, GripVertical } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  createCourse,
  fetchAllCoachesAdmin,
  updateCourse,
  createChapter,
  updateChapter,
  deleteChapter,
  createLesson,
  updateLesson,
  deleteLesson,
} from '@/lib/api/admin';
import { fetchCourseChapters } from '@/lib/api/courses';
import { supabase } from '@/lib/supabase';
import { DbCourse } from '@/types/database';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  coach_id: z.string().uuid().nullable().optional(),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  price: z.coerce.number().min(0),
  sale_price: z.coerce.number().nullable().optional(),
  duration: z.string().min(1),
  lecture_count: z.coerce.number().min(0),
  description: z.string().min(1),
  short_description: z.string().min(1),
  thumbnail_url: z.string().min(1),
  language: z.string().default('English'),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  published: z.boolean().default(false),
});

type CourseFormData = z.infer<typeof courseSchema>;

type ChapterFormItem = {
  id?: string;
  title: string;
  description: string;
  sort_order: number;
  lessons: LessonFormItem[];
};

type LessonFormItem = {
  id?: string;
  title: string;
  description: string;
  sort_order: number;
  duration_seconds: number;
  video_source_type: string;
  video_url: string;
  scorm_package_url: string;
  xapi_endpoint: string;
  xapi_activity_id: string;
  content: string;
  journal_prompts: string[];
  is_preview: boolean;
};

export default function AdminCourseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [chapters, setChapters] = useState<ChapterFormItem[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [learnInput, setLearnInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data: coaches = [] } = useQuery({
    queryKey: ['admin', 'coaches'],
    queryFn: fetchAllCoachesAdmin,
  });

  // Fetch existing course data when editing
  const { data: existingCourse, isLoading: loadingCourse } = useQuery({
    queryKey: ['admin', 'course', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as DbCourse;
    },
    enabled: isEditing,
  });

  const { data: existingChapters } = useQuery({
    queryKey: ['admin', 'chapters', id],
    queryFn: () => fetchCourseChapters(id!),
    enabled: isEditing,
  });

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      coach_id: null,
      language: 'English',
      featured: false,
      bestseller: false,
      published: false,
      price: 0,
      lecture_count: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingCourse) {
      form.reset({
        title: existingCourse.title,
        slug: existingCourse.slug,
        coach_id: existingCourse.coach_id ?? null,
        category: existingCourse.category,
        level: existingCourse.level,
        price: Number(existingCourse.price),
        sale_price: existingCourse.sale_price ? Number(existingCourse.sale_price) : null,
        duration: existingCourse.duration,
        lecture_count: existingCourse.lecture_count,
        description: existingCourse.description,
        short_description: existingCourse.short_description,
        thumbnail_url: existingCourse.thumbnail_url,
        language: existingCourse.language,
        featured: existingCourse.featured,
        bestseller: existingCourse.bestseller,
        published: existingCourse.published,
      });
      setTopics(existingCourse.topics);
      setWhatYouWillLearn(existingCourse.what_you_will_learn);
    }
  }, [existingCourse]);

  useEffect(() => {
    if (existingChapters) {
      setChapters(existingChapters.map(ch => ({
        id: ch.id,
        title: ch.title,
        description: ch.description ?? '',
        sort_order: ch.sortOrder,
        lessons: ch.lessons.map(l => ({
          id: l.id,
          title: l.title,
          description: l.description ?? '',
          sort_order: l.sortOrder,
          duration_seconds: l.durationSeconds,
          video_source_type: l.videoSourceType,
          video_url: l.videoUrl ?? '',
          scorm_package_url: l.scormPackageUrl ?? '',
          xapi_endpoint: l.xapiEndpoint ?? '',
          xapi_activity_id: l.xapiActivityId ?? '',
          content: l.content ?? '',
          journal_prompts: l.journalPrompts ?? [],
          is_preview: l.isPreview,
        })),
      })));
    }
  }, [existingChapters]);

  // Auto-generate slug from title
  const watchTitle = form.watch('title');
  useEffect(() => {
    if (!isEditing && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      form.setValue('slug', slug);
    }
  }, [watchTitle, isEditing]);

  const addChapter = () => {
    setChapters(prev => [...prev, {
      title: `Chapter ${prev.length + 1}`,
      description: '',
      sort_order: prev.length,
      lessons: [],
    }]);
  };

  const removeChapter = async (index: number) => {
    const chapter = chapters[index];
    if (chapter.id) {
      await deleteChapter(chapter.id);
    }
    setChapters(prev => prev.filter((_, i) => i !== index));
  };

  const addLesson = (chapterIndex: number) => {
    setChapters(prev => {
      const updated = [...prev];
      updated[chapterIndex] = {
        ...updated[chapterIndex],
        lessons: [...updated[chapterIndex].lessons, {
          title: `Lesson ${updated[chapterIndex].lessons.length + 1}`,
          description: '',
          sort_order: updated[chapterIndex].lessons.length,
          duration_seconds: 0,
          video_source_type: 'youtube',
          video_url: '',
          scorm_package_url: '',
          xapi_endpoint: '',
          xapi_activity_id: '',
          content: '',
          journal_prompts: [],
          is_preview: false,
        }],
      };
      return updated;
    });
  };

  const removeLesson = async (chapterIndex: number, lessonIndex: number) => {
    const lesson = chapters[chapterIndex].lessons[lessonIndex];
    if (lesson.id) {
      await deleteLesson(lesson.id);
    }
    setChapters(prev => {
      const updated = [...prev];
      updated[chapterIndex] = {
        ...updated[chapterIndex],
        lessons: updated[chapterIndex].lessons.filter((_, i) => i !== lessonIndex),
      };
      return updated;
    });
  };

  const updateChapterField = (index: number, field: string, value: string) => {
    setChapters(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateLessonField = (chapterIndex: number, lessonIndex: number, field: string, value: string | number | boolean) => {
    setChapters(prev => {
      const updated = [...prev];
      updated[chapterIndex] = {
        ...updated[chapterIndex],
        lessons: updated[chapterIndex].lessons.map((l, i) =>
          i === lessonIndex ? { ...l, [field]: value } : l
        ),
      };
      return updated;
    });
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsSaving(true);
    try {
      const selectedCoach = coaches.find((coach) => coach.id === data.coach_id);
      const courseData = {
        ...data,
        instructor: selectedCoach?.name ?? existingCourse?.instructor ?? 'Nice Guy University',
        coach_id: data.coach_id ?? null,
        sale_price: data.sale_price || null,
        topics,
        what_you_will_learn: whatYouWillLearn,
        last_updated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };

      let courseId = id;

      if (isEditing) {
        await updateCourse(id!, courseData);
      } else {
        const created = await createCourse(courseData);
        courseId = created.id;
      }

      // Save chapters and lessons
      for (let i = 0; i < chapters.length; i++) {
        const ch = chapters[i];
        let chapterId = ch.id;

        if (chapterId) {
          await updateChapter(chapterId, {
            title: ch.title,
            description: ch.description || undefined,
            sort_order: i,
          });
        } else {
          const created = await createChapter({
            course_id: courseId!,
            title: ch.title,
            description: ch.description || undefined,
            sort_order: i,
          });
          chapterId = created.id;
        }

        for (let j = 0; j < ch.lessons.length; j++) {
          const l = ch.lessons[j];
          const lessonData = {
            chapter_id: chapterId,
            title: l.title,
            description: l.description || undefined,
            sort_order: j,
            duration_seconds: Number(l.duration_seconds) || 0,
            video_source_type: l.video_source_type,
            video_url: l.video_url || undefined,
            scorm_package_url: l.scorm_package_url || undefined,
            xapi_endpoint: l.xapi_endpoint || undefined,
            xapi_activity_id: l.xapi_activity_id || undefined,
            content: l.content || undefined,
            journal_prompts: l.journal_prompts.length > 0 ? l.journal_prompts : undefined,
            is_preview: l.is_preview,
          };

          if (l.id) {
            await updateLesson(l.id, lessonData);
          } else {
            await createLesson(lessonData);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast({ title: isEditing ? 'Course updated' : 'Course created' });
      navigate('/admin/courses');
    } catch (err) {
      toast({ title: 'Failed to save course', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  if (isEditing && loadingCourse) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isEditing ? 'Edit Course' : 'Create New Course'}
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Chapters & Lessons</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input {...form.register('title')} placeholder="Course title" />
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input {...form.register('slug')} placeholder="course-slug" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Coach</Label>
                    <Select
                      value={form.watch('coach_id') ?? 'unassigned'}
                      onValueChange={(value) => form.setValue('coach_id', value === 'unassigned' ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coach" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {coaches.map((coach) => (
                          <SelectItem key={coach.id} value={coach.id}>
                            {coach.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.watch('category')} onValueChange={(v) => form.setValue('category', v)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nice-guy-recovery">Nice Guy Recovery</SelectItem>
                        <SelectItem value="relationship-skills">Relationship Skills</SelectItem>
                        <SelectItem value="boundaries-communication">Boundaries & Communication</SelectItem>
                        <SelectItem value="self-worth-identity">Self-Worth & Identity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label>Level</Label>
                    <Select value={form.watch('level')} onValueChange={(v) => form.setValue('level', v)}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="All Levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input {...form.register('short_description')} placeholder="Brief course description" />
                </div>

                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <Textarea {...form.register('description')} placeholder="Detailed course description" rows={5} />
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input {...form.register('thumbnail_url')} placeholder="https://..." />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input type="number" step="0.01" {...form.register('price')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sale Price ($)</Label>
                    <Input type="number" step="0.01" {...form.register('sale_price')} placeholder="Optional" />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input {...form.register('duration')} placeholder="e.g. 8h 30m" />
                  </div>
                </div>

                <Separator />

                {/* Topics */}
                <div className="space-y-2">
                  <Label>Topics</Label>
                  <div className="flex gap-2">
                    <Input
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="Add a topic"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (topicInput.trim()) {
                            setTopics(prev => [...prev, topicInput.trim()]);
                            setTopicInput('');
                          }
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={() => {
                      if (topicInput.trim()) {
                        setTopics(prev => [...prev, topicInput.trim()]);
                        setTopicInput('');
                      }
                    }}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {topics.map((topic, i) => (
                      <span key={i} className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1">
                        {topic}
                        <button type="button" onClick={() => setTopics(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-destructive">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="space-y-2">
                  <Label>What You'll Learn</Label>
                  <div className="flex gap-2">
                    <Input
                      value={learnInput}
                      onChange={(e) => setLearnInput(e.target.value)}
                      placeholder="Add a learning outcome"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (learnInput.trim()) {
                            setWhatYouWillLearn(prev => [...prev, learnInput.trim()]);
                            setLearnInput('');
                          }
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={() => {
                      if (learnInput.trim()) {
                        setWhatYouWillLearn(prev => [...prev, learnInput.trim()]);
                        setLearnInput('');
                      }
                    }}>
                      Add
                    </Button>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {whatYouWillLearn.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex-grow">{item}</span>
                        <button type="button" onClick={() => setWhatYouWillLearn(prev => prev.filter((_, idx) => idx !== i))} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              {chapters.map((chapter, chIdx) => (
                <Card key={chIdx}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">Chapter {chIdx + 1}</CardTitle>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => removeChapter(chIdx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Chapter Title</Label>
                        <Input
                          value={chapter.title}
                          onChange={(e) => updateChapterField(chIdx, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={chapter.description}
                          onChange={(e) => updateChapterField(chIdx, 'description', e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">Lessons</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => addLesson(chIdx)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Lesson
                        </Button>
                      </div>

                      {chapter.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="border border-border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Lesson {lIdx + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive h-6"
                              onClick={() => removeLesson(chIdx, lIdx)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Title</Label>
                              <Input
                                value={lesson.title}
                                onChange={(e) => updateLessonField(chIdx, lIdx, 'title', e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Video Source</Label>
                              <Select
                                value={lesson.video_source_type}
                                onValueChange={(v) => updateLessonField(chIdx, lIdx, 'video_source_type', v)}
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="youtube">YouTube</SelectItem>
                                  <SelectItem value="vimeo">Vimeo</SelectItem>
                                  <SelectItem value="self_hosted">Self-Hosted</SelectItem>
                                  <SelectItem value="s3">S3</SelectItem>
                                  <SelectItem value="scorm">SCORM</SelectItem>
                                  <SelectItem value="xapi">xAPI</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            {['youtube', 'vimeo', 'self_hosted', 's3', 'xapi'].includes(lesson.video_source_type) && (
                              <div className="space-y-1">
                                <Label className="text-xs">Video URL</Label>
                                <Input
                                  value={lesson.video_url}
                                  onChange={(e) => updateLessonField(chIdx, lIdx, 'video_url', e.target.value)}
                                  className="h-8 text-sm"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                            {lesson.video_source_type === 'scorm' && (
                              <div className="space-y-1">
                                <Label className="text-xs">SCORM Package URL</Label>
                                <Input
                                  value={lesson.scorm_package_url}
                                  onChange={(e) => updateLessonField(chIdx, lIdx, 'scorm_package_url', e.target.value)}
                                  className="h-8 text-sm"
                                  placeholder="URL to SCORM package"
                                />
                              </div>
                            )}
                            {lesson.video_source_type === 'xapi' && (
                              <>
                                <div className="space-y-1">
                                  <Label className="text-xs">xAPI Endpoint</Label>
                                  <Input
                                    value={lesson.xapi_endpoint}
                                    onChange={(e) => updateLessonField(chIdx, lIdx, 'xapi_endpoint', e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="LRS endpoint URL"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">xAPI Activity ID</Label>
                                  <Input
                                    value={lesson.xapi_activity_id}
                                    onChange={(e) => updateLessonField(chIdx, lIdx, 'xapi_activity_id', e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="Activity IRI"
                                  />
                                </div>
                              </>
                            )}
                            <div className="space-y-1">
                              <Label className="text-xs">Duration (seconds)</Label>
                              <Input
                                type="number"
                                value={lesson.duration_seconds}
                                onChange={(e) => updateLessonField(chIdx, lIdx, 'duration_seconds', Number(e.target.value))}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Lesson Script / Content (Markdown)</Label>
                            <Textarea
                              value={lesson.content}
                              onChange={(e) => updateLessonField(chIdx, lIdx, 'content', e.target.value)}
                              className="text-sm min-h-[120px]"
                              placeholder="Full lesson script in markdown format..."
                              rows={8}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Journal Prompts</Label>
                            <div className="flex gap-2">
                              <Input
                                className="h-8 text-sm"
                                placeholder="Add a journal prompt"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val) {
                                      setChapters(prev => {
                                        const updated = [...prev];
                                        updated[chIdx] = {
                                          ...updated[chIdx],
                                          lessons: updated[chIdx].lessons.map((l, i) =>
                                            i === lIdx ? { ...l, journal_prompts: [...l.journal_prompts, val] } : l
                                          ),
                                        };
                                        return updated;
                                      });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  const input = (e.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement;
                                  const val = input.value.trim();
                                  if (val) {
                                    setChapters(prev => {
                                      const updated = [...prev];
                                      updated[chIdx] = {
                                        ...updated[chIdx],
                                        lessons: updated[chIdx].lessons.map((l, i) =>
                                          i === lIdx ? { ...l, journal_prompts: [...l.journal_prompts, val] } : l
                                        ),
                                      };
                                      return updated;
                                    });
                                    input.value = '';
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                            {lesson.journal_prompts.length > 0 && (
                              <ul className="space-y-1 mt-1">
                                {lesson.journal_prompts.map((prompt, pIdx) => (
                                  <li key={pIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="flex-grow">{pIdx + 1}. {prompt}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setChapters(prev => {
                                          const updated = [...prev];
                                          updated[chIdx] = {
                                            ...updated[chIdx],
                                            lessons: updated[chIdx].lessons.map((l, i) =>
                                              i === lIdx ? { ...l, journal_prompts: l.journal_prompts.filter((_, pi) => pi !== pIdx) } : l
                                            ),
                                          };
                                          return updated;
                                        });
                                      }}
                                      className="text-destructive hover:text-destructive/80"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={lesson.is_preview}
                              onCheckedChange={(v) => updateLessonField(chIdx, lIdx, 'is_preview', v)}
                            />
                            <Label className="text-xs">Free Preview</Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" variant="outline" className="w-full" onClick={addChapter}>
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Published</Label>
                    <p className="text-sm text-muted-foreground">Make this course visible to students</p>
                  </div>
                  <Switch
                    checked={form.watch('published')}
                    onCheckedChange={(v) => form.setValue('published', v)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Featured</Label>
                    <p className="text-sm text-muted-foreground">Show on the homepage</p>
                  </div>
                  <Switch
                    checked={form.watch('featured')}
                    onCheckedChange={(v) => form.setValue('featured', v)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bestseller</Label>
                    <p className="text-sm text-muted-foreground">Show bestseller badge</p>
                  </div>
                  <Switch
                    checked={form.watch('bestseller')}
                    onCheckedChange={(v) => form.setValue('bestseller', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/courses')}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
}
