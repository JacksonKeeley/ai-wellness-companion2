'use client';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function StudyTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [reminder, setReminder] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [role, setRole] = useState<'viewer' | 'admin'>('viewer');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (next % 10 === 0) {
            setReminder('🧠 Reminder: Take a short break and breathe!');
            setTimeout(() => setReminder(''), 3000);
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const clearTimer = () => {
    if (seconds > 0) {
      setLogs((prev) => [...prev, `Session: ${formatTime(seconds)}`]);
    }
    setSeconds(0);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const switchRole = () => setRole((prev) => (prev === 'admin' ? 'viewer' : 'admin'));

  const downloadLogs = () => {
    if (role !== 'admin') {
      alert('Access denied. Only admins can download logs.');
      return;
    }
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study_sessions.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1] p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#575C75]">⏱️ Study Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-slate-700">
        <div className="text-4xl font-mono">{formatTime(seconds)}</div>
        {reminder && <div className="text-lg text-green-600">{reminder}</div>}
        <div className="space-x-2">
          <Button onClick={startTimer} disabled={isRunning}>Start</Button>
          <Button onClick={stopTimer} disabled={!isRunning}>Stop</Button>
          <Button onClick={clearTimer} variant="destructive">End Timer</Button>
        </div>
        <div className="mt-6 text-sm">
          <strong>Current Role:</strong> {role}<br />
          <Button onClick={switchRole} className="mt-2">Switch Role</Button>
          <Button onClick={downloadLogs} disabled={role !== 'admin'} className="mt-2 ml-2">
            Download Logs
          </Button>
        </div>
        <div className="mt-6 text-left">
          <h2 className="text-lg font-semibold text-center">📋 Session Log</h2>
          <div className="mt-2 space-y-2 max-w-md mx-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="bg-slate-100 p-2 rounded font-mono">{log}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
