function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

type VimeoEmbedProps = {
  url: string;
  title?: string;
};

export default function VimeoEmbed({ url, title }: VimeoEmbedProps) {
  const videoId = extractVimeoId(url);

  if (!videoId) {
    return <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">Invalid Vimeo URL</div>;
  }

  return (
    <div className="aspect-video w-full">
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?byline=0&portrait=0`}
        title={title ?? 'Video'}
        className="w-full h-full rounded-lg"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
