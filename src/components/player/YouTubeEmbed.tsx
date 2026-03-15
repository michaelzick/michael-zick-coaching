function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/);
  return match?.[1] ?? null;
}

type YouTubeEmbedProps = {
  url: string;
  title?: string;
};

export default function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">Invalid YouTube URL</div>;
  }

  return (
    <div className="aspect-video w-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
        title={title ?? 'Video'}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
