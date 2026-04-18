import React, { useEffect, useRef } from "react";

// 將 Hex 色碼轉換為 RGB，方便我們注入透明度 (Alpha)
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 }; // 預設白色
};

export const Starfield: React.FC<{
  starCount?: number;
  speed?: number;
  glowColor?: string;
  glowRadius?: number;    // ⭐ 發光半徑 (倍率)
  glowIntensity?: number; // ⭐ 發光亮度 (0.0 ~ 1.0+)
  starSize?: number;
}> = ({
  starCount = 100,
  speed = 0.7,
  glowColor = "#ffffff", 
  glowRadius = 5.0,       // 預設為星星本體的 5 倍大
  glowIntensity = 0.5,    // 預設亮度 (Alpha 值)
  starSize = 2.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const MAX_DEPTH = 1000;
    const FOV = 300;
    const rgb = hexToRgb(glowColor);

    const stars: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * MAX_DEPTH,
      });
    }

    let animationId: number;

    const render = () => {
      // 1. 畫背景 (使用 source-over 覆蓋上一幀)
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 2. ⭐ 開啟「疊加混合模式」，這是一切發光真實感的來源
      // 星星交疊時顏色會相加，產生過曝的高光效果
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < starCount; i++) {
        const star = stars[i];

        star.z -= speed;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = MAX_DEPTH;
        }

        const x = (star.x / star.z) * FOV + cx;
        const y = (star.y / star.z) * FOV + cy;

        if (x < 0 || x > width || y < 0 || y > height) continue;

        // 星星本體的大小
        const currentSize = (1 - star.z / MAX_DEPTH) * starSize;
        
        // 實際渲染的半徑 (本體大小 * 使用者設定的發光半徑)
        const renderRadius = currentSize * glowRadius;

        // 避免尺寸過小導致 Canvas 漸層報錯
        if (renderRadius < 0.1) continue;

        // 3. ⭐ 繪製帶有參數控制的徑向漸層
        const gradient = ctx.createRadialGradient(x, y, currentSize * 0.1, x, y, renderRadius);
        
        // 中心點：純白，代表星星核心
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        
        // 光暈過渡帶：由你傳入的 glowColor 和 glowIntensity 控制
        // Math.min 確保透明度最高就是 1
        gradient.addColorStop(0.2, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(glowIntensity, 1)})`);
        
        // 邊緣：漸淡至完全透明
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, renderRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [starCount, speed, glowColor, glowRadius, glowIntensity, starSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        zIndex: -1,
      }}
    />
  );
};