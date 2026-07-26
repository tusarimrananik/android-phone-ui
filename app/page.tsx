"use client";

import {
  AppWindow, BatteryFull, Bell, Bluetooth, Calculator, CalendarDays, Camera,
  ChevronDown, ChevronLeft, Chrome, Clock3, Flashlight, Globe2, Grid3X3,
  Home, Image, LockKeyhole, MessageCircle, Mic, Moon, Music2, NotebookPen,
  Phone, Search, Settings, Signal, Smartphone, Sun, UserRound, Volume2,
  Wifi, X, Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AppId = "phone" | "messages" | "browser" | "camera" | "photos" | "clock" | "calculator" | "notes" | "settings" | "calendar" | "music";
type AppInfo = { id: AppId; name: string; icon: LucideIcon; color: string; foreground?: string };

const apps: AppInfo[] = [
  { id: "phone", name: "Phone", icon: Phone, color: "#8bd6a7", foreground: "#103e23" },
  { id: "messages", name: "Messages", icon: MessageCircle, color: "#9ecaff", foreground: "#123d69" },
  { id: "browser", name: "Browser", icon: Chrome, color: "#fff1a6", foreground: "#473900" },
  { id: "camera", name: "Camera", icon: Camera, color: "#d6c3ff", foreground: "#3c226b" },
  { id: "photos", name: "Photos", icon: Image, color: "#ffc5d2", foreground: "#691c35" },
  { id: "clock", name: "Clock", icon: Clock3, color: "#b9d4ff", foreground: "#173c70" },
  { id: "calculator", name: "Calculator", icon: Calculator, color: "#c4e7df", foreground: "#164a40" },
  { id: "notes", name: "Notes", icon: NotebookPen, color: "#ffe08a", foreground: "#5b4300" },
  { id: "settings", name: "Settings", icon: Settings, color: "#d4d8df", foreground: "#30343b" },
  { id: "calendar", name: "Calendar", icon: CalendarDays, color: "#ffb7ad", foreground: "#6c251d" },
  { id: "music", name: "Music", icon: Music2, color: "#d4bbff", foreground: "#482178" },
];

const wallpapers = ["aurora", "ember", "ocean"] as const;
type Wallpaper = typeof wallpapers[number];

function useCurrentTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

function AppIcon({ app, onOpen }: { app: AppInfo; onOpen: (id: AppId) => void }) {
  const Icon = app.icon;
  return (
    <button className="app-icon" onClick={() => onOpen(app.id)} aria-label={`Open ${app.name}`}>
      <span className="app-icon__tile" style={{ background: app.color, color: app.foreground }}>
        <Icon size={25} strokeWidth={1.9} />
      </span>
      <span>{app.name}</span>
    </button>
  );
}

function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const press = (value: string) => {
    if (value === "C") return setDisplay("0");
    if (value === "⌫") return setDisplay((v) => v.length <= 1 ? "0" : v.slice(0, -1));
    if (value === "=") {
      try {
        const safe = display.replace(/×/g, "*").replace(/÷/g, "/");
        if (!/^[0-9+\-*/.() ]+$/.test(safe)) throw new Error("Invalid");
        const result = Function(`"use strict"; return (${safe})`)();
        setDisplay(Number.isFinite(result) ? String(Number(result.toFixed(8))) : "Error");
      } catch { setDisplay("Error"); }
      return;
    }
    setDisplay((v) => (v === "0" || v === "Error") && /\d/.test(value) ? value : v + value);
  };
  const keys = ["C", "(", ")", "⌫", "7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"];
  return <div className="calculator-app"><div className="calculator-display">{display}</div><div className="calculator-keys">{keys.map((key) => <button key={key} className={/[÷×−+=]/.test(key) ? "operator" : ""} onClick={() => press(key === "−" ? "-" : key)}>{key}</button>)}</div></div>;
}

function ClockApp({ now }: { now: Date }) {
  return <div className="clock-app"><div className="analog-clock"><span className="hand hour" style={{ transform: `rotate(${now.getHours() * 30 + now.getMinutes() / 2}deg)` }} /><span className="hand minute" style={{ transform: `rotate(${now.getMinutes() * 6}deg)` }} /><span className="hand second" style={{ transform: `rotate(${now.getSeconds() * 6}deg)` }} /><i /></div><h2>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</h2><p>{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p><div className="alarm-row"><div><strong>07:00</strong><span>Weekdays</span></div><button aria-label="Toggle alarm"><span /></button></div><div className="alarm-row"><div><strong>09:30</strong><span>Saturday</span></div><button className="off" aria-label="Toggle alarm"><span /></button></div></div>;
}

function NotesApp() {
  const [notes, setNotes] = useState("Design ideas\n\n• Refine the home screen\n• Try a warmer wallpaper\n• Keep interactions simple");
  useEffect(() => { const saved = localStorage.getItem("android-ui-notes"); if (saved) setNotes(saved); }, []);
  const save = (value: string) => { setNotes(value); localStorage.setItem("android-ui-notes", value); };
  return <div className="notes-app"><textarea aria-label="Notes" value={notes} onChange={(e) => save(e.target.value)} /><span>Saved automatically</span></div>;
}

function BrowserApp() {
  const [query, setQuery] = useState("");
  return <div className="browser-app"><div className="browser-logo"><Globe2 size={46} /></div><h2>Explore the web</h2><form onSubmit={(e) => e.preventDefault()}><Search size={18} /><input aria-label="Search" placeholder="Search or type a URL" value={query} onChange={(e) => setQuery(e.target.value)} /><Mic size={17} /></form><div className="shortcuts"><button><span>G</span>Google</button><button><span>Y</span>YouTube</button><button><span>G</span>GitHub</button><button><span>V</span>Vercel</button></div>{query && <div className="search-result"><Globe2 size={18} /><div><strong>Search ready</strong><p>“{query}” would open in your browser.</p></div></div>}</div>;
}

function PhotosApp() {
  const colors = ["#ffb7ad", "#a8c7fa", "#c4e7df", "#ffe08a", "#d4bbff", "#ffc5d2", "#b4e6ff", "#d9e7a8", "#f6c4a5"];
  return <div className="photos-app"><div className="photo-heading"><h2>Photos</h2><UserRound size={22} /></div><div className="photo-grid">{colors.map((c, i) => <div key={i} style={{ background: c }}><Image size={28} /></div>)}</div></div>;
}

function SettingsApp({ dark, setDark, wallpaper, setWallpaper }: { dark: boolean; setDark: (v: boolean) => void; wallpaper: Wallpaper; setWallpaper: (v: Wallpaper) => void }) {
  return <div className="settings-app"><div className="profile-card"><div><UserRound size={25} /></div><span><strong>Android UI</strong><small>Local device</small></span><ChevronDown size={18} /></div><h3>Appearance</h3><button className="setting-row" onClick={() => setDark(!dark)}><span><Moon size={20} /><span><strong>Dark theme</strong><small>{dark ? "On" : "Off"}</small></span></span><i className={dark ? "switch on" : "switch"}><b /></i></button><div className="wallpaper-setting"><span><Image size={20} /><strong>Wallpaper</strong></span><div>{wallpapers.map((item) => <button key={item} className={`wallpaper-dot ${item} ${wallpaper === item ? "selected" : ""}`} onClick={() => setWallpaper(item)} aria-label={`${item} wallpaper`} />)}</div></div><h3>Device</h3><div className="setting-row static"><span><Wifi size={20} /><span><strong>Network & internet</strong><small>Connected</small></span></span><ChevronDown size={18} /></div><div className="setting-row static"><span><BatteryFull size={20} /><span><strong>Battery</strong><small>86% · About 1 day left</small></span></span><ChevronDown size={18} /></div></div>;
}

function CalendarApp({ now }: { now: Date }) {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  return <div className="calendar-app"><h2>{now.toLocaleDateString([], { month: "long", year: "numeric" })}</h2><div className="weekday-row">{"SMTWTFS".split("").map((d, i) => <span key={i}>{d}</span>)}</div><div className="month-grid">{days.map((day, i) => <span key={i} className={day === now.getDate() ? "today" : day < 1 || day > 31 ? "muted" : ""}>{day < 1 ? 30 + day : day > 31 ? day - 31 : day}</span>)}</div><div className="event-card"><span>10:00</span><div><strong>Design review</strong><small>Android phone prototype</small></div></div></div>;
}

function GenericApp({ id }: { id: AppId }) {
  if (id === "phone") return <div className="dialer"><h2>Phone</h2><div className="dial-number">+1 555 0100</div><div className="dial-pad">{"123456789*0#".split("").map((n) => <button key={n}>{n}</button>)}</div><button className="call-button"><Phone size={25} /></button></div>;
  if (id === "messages") return <div className="messages-app"><h2>Messages</h2>{["Alex", "Maya", "Design team"].map((name, i) => <div className="message-row" key={name}><span>{name[0]}</span><div><strong>{name}</strong><p>{["The prototype looks great!", "See you tomorrow.", "New feedback was added."][i]}</p></div><small>{["Now", "2h", "5h"][i]}</small></div>)}</div>;
  if (id === "camera") return <div className="camera-app"><div className="camera-view"><Camera size={70} strokeWidth={1} /><span>Camera preview</span></div><div className="camera-controls"><button /><button className="shutter" /><button /></div></div>;
  if (id === "music") return <div className="music-app"><div className="album-art"><Music2 size={64} /></div><h2>Night Drive</h2><p>Android UI Sessions</p><input aria-label="Track progress" type="range" defaultValue="42" /><div className="music-controls"><ChevronLeft /><button><Zap size={24} /></button><ChevronLeft className="next" /></div></div>;
  return null;
}

function AppContent({ id, now, dark, setDark, wallpaper, setWallpaper }: { id: AppId; now: Date; dark: boolean; setDark: (v: boolean) => void; wallpaper: Wallpaper; setWallpaper: (v: Wallpaper) => void }) {
  if (id === "calculator") return <CalculatorApp />;
  if (id === "clock") return <ClockApp now={now} />;
  if (id === "notes") return <NotesApp />;
  if (id === "browser") return <BrowserApp />;
  if (id === "photos") return <PhotosApp />;
  if (id === "settings") return <SettingsApp dark={dark} setDark={setDark} wallpaper={wallpaper} setWallpaper={setWallpaper} />;
  if (id === "calendar") return <CalendarApp now={now} />;
  return <GenericApp id={id} />;
}

export default function AndroidPhone() {
  const now = useCurrentTime();
  const [locked, setLocked] = useState(true);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [quickSettings, setQuickSettings] = useState(false);
  const [dark, setDark] = useState(true);
  const [wallpaper, setWallpaper] = useState<Wallpaper>("aurora");
  const [toggles, setToggles] = useState({ wifi: true, bluetooth: true, flashlight: false, sound: true });
  const currentApp = useMemo(() => apps.find((a) => a.id === activeApp), [activeApp]);
  const openApp = (id: AppId) => { setActiveApp(id); setDrawer(false); setQuickSettings(false); };
  const toggle = (key: keyof typeof toggles) => setToggles((v) => ({ ...v, [key]: !v[key] }));

  return (
    <main className={`stage ${dark ? "dark" : "light"}`}>
      <section className={`phone-shell wallpaper-${wallpaper}`} aria-label="Interactive Android phone">
        <div className="camera-cutout" />
        <button className="power-button" onClick={() => { setLocked(true); setActiveApp(null); setDrawer(false); }} aria-label="Lock phone" />
        <div className="screen">
          <button className="status-bar" onClick={() => !locked && setQuickSettings(true)} aria-label="Open quick settings">
                      <span>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="android-status-icons"><i className="android-signal" aria-label="Cellular signal"><b /><b /><b /><b /></i><i className="android-wifi" aria-label="Wi-Fi"><b /></i><i className="android-battery" aria-label="Battery 86%"><b /></i><em>86%</em></span>
                    </button>

          {locked ? (
            <button className="lock-screen" onClick={() => setLocked(false)} aria-label="Unlock phone">
                          <div className="lock-topline"><LockKeyhole size={18} /><span>Pixel UI</span><span className="lock-weather"><Sun size={15} /> 24°</span></div>
                          <div className="lock-time-wrap"><time>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time><p>{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p></div>
                          <div className="lock-notification"><Bell size={18} /><span><strong>Android UI is ready</strong><small>Tap to explore your phone</small></span><ChevronLeft size={17} className="notification-chevron" /></div>
                          <span className="unlock-hint">Swipe up to unlock</span>
                          <div className="lock-shortcuts"><i><Phone size={19} /></i><i><Camera size={19} /></i></div>
                        </button>
          ) : (
            <>
              <div className="home-screen">
                              <div className="pixel-header"><div className="pixel-date"><strong>{now.toLocaleDateString([], { weekday: "long" })}</strong><span>{now.toLocaleDateString([], { month: "short", day: "numeric" })}</span></div><button className="profile-chip" aria-label="Open profile"><UserRound size={18} /></button></div>
                              <div className="pixel-widget"><div><span className="widget-eyebrow">At a glance</span><strong>{now.toLocaleDateString([], { weekday: "long" })}</strong><span>{now.toLocaleDateString([], { month: "short", day: "numeric" })} · Clear skies</span></div><div className="widget-weather"><Sun size={27} /><strong>24°</strong><span>Feels like 23°</span></div></div>
                              <button className="search-pill" onClick={() => openApp("browser")}><span>G</span><span>Search your phone</span><Mic size={17} /><Camera size={17} /></button>
                              <div className="home-apps">{apps.slice(5, 9).map((app) => <AppIcon key={app.id} app={app} onOpen={openApp} />)}</div>
                              <div className="home-page-indicator"><i /><i className="active" /><i /></div>
                              <div className="dock">{apps.slice(0, 4).map((app) => <AppIcon key={app.id} app={app} onOpen={openApp} />)}</div>
                            </div>

              {drawer && <div className="app-drawer"><div className="drawer-handle" /><div className="drawer-search"><Search size={18} /><input aria-label="Search apps" placeholder="Search your apps" /></div><div className="all-apps">{apps.map((app) => <AppIcon key={app.id} app={app} onOpen={openApp} />)}</div></div>}

              {quickSettings && <div className="quick-settings"><div className="quick-header"><span>{now.toLocaleDateString([], { month: "short", day: "numeric" })}</span><button onClick={() => openApp("settings")}><Settings size={19} /></button><button onClick={() => setQuickSettings(false)}><X size={20} /></button></div><div className="brightness"><Sun size={17} /><input aria-label="Brightness" type="range" defaultValue="72" /></div><div className="toggle-grid"><button className={toggles.wifi ? "on" : ""} onClick={() => toggle("wifi")}><Wifi size={19} /><span><strong>Internet</strong><small>{toggles.wifi ? "Wi-Fi" : "Off"}</small></span></button><button className={toggles.bluetooth ? "on" : ""} onClick={() => toggle("bluetooth")}><Bluetooth size={19} /><span><strong>Bluetooth</strong><small>{toggles.bluetooth ? "On" : "Off"}</small></span></button><button className={toggles.flashlight ? "on" : ""} onClick={() => toggle("flashlight")}><Flashlight size={19} /><span><strong>Flashlight</strong><small>{toggles.flashlight ? "On" : "Off"}</small></span></button><button className={toggles.sound ? "on" : ""} onClick={() => toggle("sound")}><Volume2 size={19} /><span><strong>Sound</strong><small>{toggles.sound ? "On" : "Muted"}</small></span></button></div><div className="notification"><span><Bell size={19} /></span><div><strong>Android UI is ready</strong><p>Explore the interactive phone interface.</p></div><small>now</small></div></div>}

              {activeApp && currentApp && <div className="app-window"><header><button onClick={() => setActiveApp(null)} aria-label="Go back"><ChevronLeft size={22} /></button><strong>{currentApp.name}</strong><button onClick={() => setActiveApp(null)} aria-label="Close app"><X size={20} /></button></header><div className="app-content"><AppContent id={activeApp} now={now} dark={dark} setDark={setDark} wallpaper={wallpaper} setWallpaper={setWallpaper} /></div></div>}

              <nav className="navigation-bar" aria-label="Phone navigation"><button onClick={() => { setActiveApp(null); setDrawer(false); setQuickSettings(false); }} aria-label="Back"><ChevronLeft size={19} /></button><button onClick={() => { setActiveApp(null); setDrawer(false); setQuickSettings(false); }} aria-label="Home"><Home size={18} /></button><button onClick={() => setDrawer((v) => !v)} aria-label="App drawer"><Grid3X3 size={17} /></button></nav>
            </>
          )}
        </div>
      </section>
      <aside className="desktop-copy"><div><Smartphone size={22} /><span>ANDROID UI</span></div><h1>A phone that lives in your browser.</h1><p>Tap the device to unlock it. Open apps, change quick settings, write notes, calculate, and personalize the wallpaper.</p><ul><li>Interactive apps</li><li>Material-inspired motion</li><li>Mobile-first layout</li></ul></aside>
    </main>
  );
}
