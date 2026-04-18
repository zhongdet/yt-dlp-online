import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandingActionCardProps {
  iconSize?: number;
  expandedWidth?: number;
  expandedHeight?: number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  position?: string;
}

export const ExpandingActionCard = ({
  iconSize = 56,
  expandedWidth = 320,
  expandedHeight = 480,
  icon = <Plus className="h-6 w-6 stroke-[2.5]" />,
  children,
  position = "bottom-8 right-8",
}: ExpandingActionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const radiusValue = iconSize / 2;

  return (
    <div className={cn("fixed z-50", position)}>
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? expandedWidth : iconSize,
          height: isOpen ? expandedHeight : iconSize,
          borderRadius: isOpen ? 28 : radiusValue,
          backgroundColor: isOpen ? "rgba(24, 24, 27, 0.7)" : "rgb(24, 24, 27)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className={cn(
          "relative border border-zinc-700 shadow-2xl flex flex-col backdrop-blur-md",
          // 關鍵：在動畫進行中強制隱藏溢出，只有展開完成後才允許滾動（若需要）
          isOpen ? "overflow-hidden" : "overflow-hidden cursor-pointer hover:scale-105"
        )}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="w-full h-full flex items-center justify-center text-zinc-100"
            >
              {icon}
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.15, duration: 0.3 }} // 延遲內容進場，等容器擴張一點
              className="w-full h-full flex flex-col relative"
            >
              <div className="absolute top-4 right-4 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="rounded-full h-8 w-8 hover:bg-white/10 text-zinc-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 內容容器：隱藏滾動條但保持滾動功能 */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden pt-12 scrollbar-none">
                <style dangerouslySetInnerHTML={{ __html: `
                  .scrollbar-none::-webkit-scrollbar { display: none; }
                  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
                `}} />
                
                <div className="px-6 pb-6 text-zinc-100">
                  {children || (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold">Quick Actions</h3>
                      <p className="text-zinc-400 text-sm">
                        This content fades in slightly after the expansion starts to prevent layout shifting.
                      </p>
                      <div className="h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                        Content Area
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};