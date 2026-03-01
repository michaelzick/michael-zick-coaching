import { useRef, useEffect, useCallback } from 'react';
import { LessonItem } from '@/lib/api/courses';
import YouTubeEmbed from './YouTubeEmbed';
import VimeoEmbed from './VimeoEmbed';
import ScormPlayer from './ScormPlayer';
import { XapiTracker } from './XapiTracker';
import { updateLessonProgress } from '@/lib/api/progress';
import { useAuth } from '@/hooks/use-auth';

type VideoPlayerProps = {
  lesson: LessonItem;
};

export default function VideoPlayer({ lesson }: VideoPlayerProps) {
  const { user, profile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackerRef = useRef<XapiTracker | null>(null);

  // Set up xAPI tracker for xAPI lessons
  useEffect(() => {
    if (lesson.videoSourceType === 'xapi' && lesson.xapiEndpoint && lesson.xapiActivityId && user) {
      trackerRef.current = new XapiTracker({
        endpoint: lesson.xapiEndpoint,
        activityId: lesson.xapiActivityId,
        lessonId: lesson.id,
        actorEmail: user.email ?? '',
        actorName: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim(),
      });
      trackerRef.current.initialized();
    }
  }, [lesson, user, profile]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.duration === 0) return;

    const percent = (video.currentTime / video.duration) * 100;

    if (lesson.videoSourceType === 'xapi' && trackerRef.current) {
      trackerRef.current.progressed(percent, Math.floor(video.currentTime));
    } else {
      updateLessonProgress(lesson.id, {
        progressPercent: percent,
        lastPositionSeconds: Math.floor(video.currentTime),
      });
    }
  }, [lesson]);

  const handleEnded = useCallback(() => {
    if (lesson.videoSourceType === 'xapi' && trackerRef.current) {
      trackerRef.current.completed();
    } else {
      updateLessonProgress(lesson.id, {
        completed: true,
        progressPercent: 100,
      });
    }
  }, [lesson]);

  switch (lesson.videoSourceType) {
    case 'youtube':
      return <YouTubeEmbed url={lesson.videoUrl ?? ''} title={lesson.title} />;

    case 'vimeo':
      return <VimeoEmbed url={lesson.videoUrl ?? ''} title={lesson.title} />;

    case 'scorm':
      return <ScormPlayer packageUrl={lesson.scormPackageUrl ?? ''} lessonId={lesson.id} />;

    case 'self_hosted':
    case 's3':
    case 'xapi':
      return (
        <div className="aspect-video w-full">
          <video
            ref={videoRef}
            src={lesson.videoUrl ?? ''}
            controls
            className="w-full h-full rounded-lg bg-black"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );

    default:
      return (
        <div className="aspect-video w-full bg-muted flex items-center justify-center rounded-lg">
          <p className="text-muted-foreground">Unsupported video format</p>
        </div>
      );
  }
}
