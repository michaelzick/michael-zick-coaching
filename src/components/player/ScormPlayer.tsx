import { useEffect, useRef, useCallback } from 'react';
import { updateLessonProgress } from '@/lib/api/progress';

type ScormPlayerProps = {
  packageUrl: string;
  lessonId: string;
};

export default function ScormPlayer({ packageUrl, lessonId }: ScormPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scormDataRef = useRef<Record<string, string>>({});

  const saveProgress = useCallback(async () => {
    const completed = scormDataRef.current['cmi.core.lesson_status'] === 'completed' ||
                      scormDataRef.current['cmi.core.lesson_status'] === 'passed';

    await updateLessonProgress(lessonId, {
      completed,
      scormData: { ...scormDataRef.current },
    });
  }, [lessonId]);

  useEffect(() => {
    // SCORM 1.2 API adapter
    const api = {
      LMSInitialize: () => 'true',
      LMSFinish: () => {
        saveProgress();
        return 'true';
      },
      LMSGetValue: (key: string) => scormDataRef.current[key] ?? '',
      LMSSetValue: (key: string, value: string) => {
        scormDataRef.current[key] = value;
        return 'true';
      },
      LMSCommit: () => {
        saveProgress();
        return 'true';
      },
      LMSGetLastError: () => '0',
      LMSGetErrorString: () => '',
      LMSGetDiagnostic: () => '',
    };

    // Expose API on window for SCORM content to find
    (window as Record<string, unknown>).API = api;

    return () => {
      delete (window as Record<string, unknown>).API;
      saveProgress();
    };
  }, [saveProgress]);

  return (
    <div className="aspect-video w-full">
      <iframe
        ref={iframeRef}
        src={packageUrl}
        title="SCORM Content"
        className="w-full h-full rounded-lg border border-border"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
