import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Trash2 } from "lucide-react";

interface VideoCardErrorProps {
  url: string;
  errorMessage?: string;
  onDelete: () => void;
}

export function VideoCardError({ url, errorMessage, onDelete }: VideoCardErrorProps) {
  return (
    <Card className="bg-neutral-900/80 border-neutral-800/50 opacity-75 grayscale hover:grayscale-0 transition-all duration-300 backdrop-blur-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <AlertCircle className="w-5 h-5 text-neutral-500 flex-shrink-0" />
          <span className="text-neutral-500 truncate text-sm">
            網址: {url}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" size="sm" className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs">
                View Error
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-50">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  Extraction Failed
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-neutral-400 font-mono bg-black/50 p-4 rounded-md">
                {errorMessage}
              </p>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-neutral-500 hover:text-red-400 hover:bg-neutral-800"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
