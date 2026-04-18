import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function VideoCardSkeleton() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800 p-6 flex flex-col items-center justify-center space-y-4 h-[200px] backdrop-blur-sm">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-100" />
      <p className="text-neutral-400 text-sm animate-pulse">Extracting metadata...</p>
    </Card>
  );
}
