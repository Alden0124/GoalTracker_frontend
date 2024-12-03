import { useState, useEffect, useCallback } from 'react';

export const useCountdown = () => {
  const [countdown, setCountdown] = useState<number>(() => {
    const endTime = localStorage.getItem('countdownEndTime');
    if (endTime) {
      const remaining = Math.ceil((parseInt(endTime) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });
  
  const [isActive, setIsActive] = useState<boolean>(() => {
    const endTime = localStorage.getItem('countdownEndTime');
    return endTime ? parseInt(endTime) > Date.now() : false;
  });

  const tick = useCallback(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        setIsActive(false);
        localStorage.removeItem('countdownEndTime');
        return 0;
      }
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isActive && countdown > 0) {
      intervalId = window.setInterval(tick, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, countdown, tick]);

  const startCountdown = useCallback((seconds: number) => {
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem('countdownEndTime', endTime.toString());
    setCountdown(seconds);
    setIsActive(true);
  }, []);

  return { countdown, startCountdown, isActive };
}; 