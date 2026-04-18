export function Header() {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-4" />
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-300">
        YouTube Downloader
      </h1>
      <p className="text-neutral-400 max-w-md mx-auto">
        Paste any YouTube URL below to extract formats and download media natively in your browser.
      </p>
    </div>
  );
}
