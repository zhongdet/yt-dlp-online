import { useState, useEffect } from 'react';
// 這裡多引入了 CredentialResponse 型別，用來解決 onSuccess 的 TS 檢查
import { GoogleOAuthProvider, GoogleLogin, googleLogout, type CredentialResponse } from '@react-oauth/google';

// 1. 環境變數處理：加上 || '' 確保它一定是字串，避免 TS 抱怨「可能是 undefined」
// (如果用 Create React App，請換成 process.env.REACT_APP_GOOGLE_CLIENT_ID)
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "582066234204-819rjoqqbeotprh764qkl98n4b7kgijv.apps.googleusercontent.com"; 

// 2. 定義天氣資料的「形狀 (Type)」
interface WeatherData {
  city?: string;
  temp?: number;
  error?: string;
}

export default function QuickWeatherAuth() {
  // 這兩個初始值是 boolean，TS 會自動推斷，不用特別寫型別
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // 3. 修復重點：告訴 TS 這個 state 可以是 WeatherData 物件，或者是 null
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchWeatherByIp = async () => {
        setLoading(true);
        try {
          // 抓取 IP 資訊
          const ipRes = await fetch('https://ipapi.co/json/');
          const ipData = await ipRes.json();

          // 抓取天氣資訊
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();

          // 這裡因為前面有定義 WeatherData 型別，TS 就不會再報錯了
          setWeather({
            city: ipData.city || '未知城市',
            temp: weatherData.current_weather.temperature
          });
        } catch (error) {
          console.error("Fetch error:", error);
          setWeather({ error: '無法取得天氣資訊' });
        }
        setLoading(false);
      };

      fetchWeatherByIp();
    } else {
      setWeather(null); // 登出時清空
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ padding: '20px', borderRadius: '8px', maxWidth: '300px', textAlign: 'center', margin: '20px auto' }}>
        <h3 className='my-2'>VERY COOL Weather</h3>
        <p className='text-xs text-zinc-400 my-2'>學長說要用很酷的api和登入功能，但我不知道要做什麼</p>
        {!isLoggedIn ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                // 4. 修復：幫回傳值加上 CredentialResponse 型別
                onSuccess={(credentialResponse: CredentialResponse) => {
                  console.log("登入成功!", credentialResponse);
                  setIsLoggedIn(true);
                }}
                onError={() => {
                  console.log('登入失敗');
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            {loading ? (
              <p>正在掃描您的 IP 並獲取天氣...</p>
            ) : weather?.error ? (
              <p style={{ color: 'red' }}>{weather.error}</p>
            ) : weather ? (
              <div style={{ marginBottom: '15px' }}>
                <p><strong>位置：</strong> {weather.city}</p>
                <p><strong>氣溫：</strong> {weather.temp} °C</p>
              </div>
            ) : null}
            
            <button 
              onClick={handleLogout}
              style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #777' }}
            >
              登出
            </button>
          </div>
        )}
        
      </div>
    </GoogleOAuthProvider>
  );
}