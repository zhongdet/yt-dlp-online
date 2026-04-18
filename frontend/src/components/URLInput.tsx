import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { HoverIconButton } from "@/components/hoverIconBtn"
import { ChevronRight } from 'lucide-react'

interface URLInputProps {
  onSubmit: (url: string) => void;
}

export function URLInput({ onSubmit }: URLInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
    setUrl("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full relative shadow-2xl flex items-center bg-neutral-900/10 rounded-2xl p-2 border-2 border-neutral-800 backdrop-blur-md transition-all focus-within:ring-2  focus-within:ring-zinc-100/50 hover:shadow-[0_0_50px_5px_rgba(255,255,255,0.5)]"
    >
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        className="flex-1 bg-5transparent border-none focus-visible:ring-0 text-lg placeholder:text-neutral-600 h-14"
      />
      <HoverIconButton
        type="submit"
        size="lg"
        hoverIcon={<ChevronRight/>}
        className="primary h-14 px-8 rounded-xl font-semibold shadow-lg shadow-zinc-600/20 ml-2 transition-all hover:scale-105 active:scale-95"
      >
        Extract
      </HoverIconButton>
    </form>
  );
}
