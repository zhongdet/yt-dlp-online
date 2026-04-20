import { useState } from "react";
import { Starfield } from "@/components/StarField";
import { Header } from "@/components/Header";
import { URLInput } from "@/components/URLInput";
import { VideoList } from "@/components/video";
import { SettingInput } from "@/components/SettingInput";
import { useVideoList, useVideoFetch, useDownload } from "@/hooks";
import { ExpandingActionCard } from "@/components/ExpandingActionCard";
import { SlidersHorizontal, Cloudy } from "lucide-react";
import { Toaster } from "sonner";
import QuickWeatherAuth from "@/components/Weather";
import "./App.css";

function App() {
  const {
    items,
    addItem,
    removeItem,
    setItemSuccess,
    setItemError,
    setItemDownloadStatus,
    addTaskId,
    updateSelectedFormat,
  } = useVideoList();

  const { fetchVideoInfo } = useVideoFetch({ setItemSuccess, setItemError });

  const { handleDownload } = useDownload({
    setItemDownloadStatus,
    addTaskId,
  });

  const handleSubmit = (url: string) => {
    const uuid = addItem(url);
    fetchVideoInfo(uuid, url);
  };

  const handleFormatChange = (uuid: string, formatId: string) => {
    updateSelectedFormat(uuid, formatId);
  };

  const handleDownloadClick = (uuid: string) => {
    const item = items.find((i) => i.uuid === uuid);
    if (item) {
      handleDownload(uuid, item.url, item.selectedFormatId, item.info?.title);
    }
  };

  interface Settings {
    speed: number;
    starCount: number;
    starSize: number;
    glowRadius: number;
    glowIntensity: number;
    enableStar: boolean;
  }

  const [settings, setSettings] = useState<Settings>({
    speed: 0.9,
    starCount: 200,
    starSize: 2.5,
    glowRadius: 5.0,
    glowIntensity: 0.5,
    enableStar: true,
  });

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 flex flex-col items-center relative overflow-hidden backdrop-blur-3xl">
      <Toaster
        duration={Infinity}
        closeButton
        theme="dark"
        position="top-right"
      />
      {settings.enableStar && (
        <Starfield
          key={Date.now()}
          starCount={settings.starCount}
          speed={settings.speed}
          starSize={settings.starSize}
          glowRadius={settings.glowRadius}
          glowIntensity={settings.glowIntensity}
        />
      )}

      <div className="w-full max-w-3xl z-10 space-y-8 flex flex-col items-center mt-12">
        <Header />

        <URLInput onSubmit={handleSubmit} />

        <VideoList
          items={items}
          onFormatChange={handleFormatChange}
          onDownload={handleDownloadClick}
          onDelete={removeItem}
        />
      </div>
      <ExpandingActionCard icon={<SlidersHorizontal />}>
        <div className="m-5 flex flex-col gap-4 max-w-xs">
          <SettingInput
            label={"Star Speed"}
            value={settings.speed}
            step={0.1}
            min={0}
            max={10}
            onChange={(v) => handleSettingChange("speed", v)}
            onReset={() => handleSettingChange("speed", 0.9)}
          />

          <SettingInput
            label={"Star Count"}
            value={settings.starCount}
            step={1}
            min={0}
            max={1000}
            onChange={(v) => handleSettingChange("starCount", v)}
            onReset={() => handleSettingChange("starCount", 200)}
          />
          <span className="text-xs text-zinc-600">
            [ ! ] : reduce star count DO NOT reduce GPU usage
          </span>
          <SettingInput
            label={"Star size"}
            value={settings.starSize}
            step={0.1}
            min={0.2}
            max={5}
            onChange={(v) => handleSettingChange("starSize", v)}
            onReset={() => handleSettingChange("starSize", 2.5)}
          />

          <SettingInput
            label={"Star glow radius"}
            value={settings.glowRadius}
            step={0.1}
            min={0}
            max={50}
            onChange={(v) => handleSettingChange("glowRadius", v)}
            onReset={() => handleSettingChange("glowRadius", 5.0)}
          />

          <SettingInput
            label={"Star glow Intensity"}
            value={settings.glowIntensity}
            step={0.1}
            min={0}
            max={10}
            onChange={(v) => handleSettingChange("glowIntensity", v)}
            onReset={() => handleSettingChange("glowIntensity", 0.5)}
          />
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={settings.enableStar}
              className="w-[10%]"
              onChange={(e) =>
                handleSettingChange("enableStar", e.target.checked)
              }
            />
            <span className="pl-4 text text-zinc-400 ">Enable StarField</span>
          </div>
        </div>
      </ExpandingActionCard>
      <ExpandingActionCard position="bottom-8 left-8" icon={<Cloudy />}>
        <div className="max-w-xs">
          <QuickWeatherAuth></QuickWeatherAuth>
        </div>
      </ExpandingActionCard>
    </div>
  );
}

export default App;
