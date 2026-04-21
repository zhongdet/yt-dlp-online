import { useState, useCallback, useRef, useEffect } from "react";
import type { VideoItem, VideoInfo } from "@/types/video";

const API_BASE_URL = "/api";

export function useVideoList() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const taskIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleBeforeUnload = () => {
      const taskIds = Array.from(taskIdsRef.current);
      if (taskIds.length > 0) {
        // 使用 keepalive 确保在页面卸载时请求能完成
        fetch(`${API_BASE_URL}/cleanup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task_ids: taskIds }),
          keepalive: true,
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const addItem = useCallback((url: string): string => {
    const uuid = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const newItem: VideoItem = {
      uuid,
      url,
      status: "loading",
      downloadStatus: "idle",
    };
    setItems((prev) => [newItem, ...prev]);
    return uuid;
  }, []);

  const updateItem = useCallback((uuid: string, updates: Partial<VideoItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.uuid === uuid ? { ...item, ...updates } : item))
    );
  }, []);

  const removeItem = useCallback((uuid: string) => {
    setItems((prev) => prev.filter((item) => item.uuid !== uuid));
  }, []);

  const setItemSuccess = useCallback((uuid: string, info: VideoInfo) => {
    setItems((prev) =>
      prev.map((item) =>
        item.uuid === uuid ? { ...item, status: "success" as const, info } : item
      )
    );
  }, []);

  const setItemError = useCallback((uuid: string, errorMessage: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.uuid === uuid
          ? { ...item, status: "error" as const, errorMessage }
          : item
      )
    );
  }, []);

  const setItemDownloadStatus = useCallback(
    (
      uuid: string,
      downloadStatus: VideoItem["downloadStatus"],
      downloadProgress?: string,
      errorMessage?: string
    ) => {
      setItems((prev) =>
        prev.map((item) =>
          item.uuid === uuid
            ? { ...item, downloadStatus, downloadProgress, errorMessage }
            : item
        )
      );
    },
    []
  );

  const addTaskId = useCallback((uuid: string) => {
    taskIdsRef.current.add(uuid);
  }, []);

  const updateSelectedFormat = useCallback((uuid: string, formatId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.uuid === uuid ? { ...item, selectedFormatId: formatId } : item
      )
    );
  }, []);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    setItemSuccess,
    setItemError,
    setItemDownloadStatus,
    addTaskId,
    updateSelectedFormat,
  };
}
