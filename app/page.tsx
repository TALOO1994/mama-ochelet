'use client';

import { useState, useRef, useEffect } from 'react';
import { searchFood, findBestMatch, FoodItem, getStatusLabel, getStatusEmoji } from '@/lib/foodDatabase';
// findBestMatch used in MenuList popup
import Tesseract from 'tesseract.js';

type Mode = 'search' | 'photo' | 'url';

const TIPS = [
  { emoji: '🥦', text: 'ברוקולי עשיר בחומצה פולית - מומלץ מאוד!' },
  { emoji: '💧', text: 'שתי 8-10 כוסות מים ביום' },
  { emoji: '🐟', text: 'סלמון מבושל - מקור מצוין לאומגה 3' },
  { emoji: '🥑', text: 'אבוקדו עשיר בחומצה פולית ואשלגן' },
  { emoji: '🥛', text: '3 מנות חלב ביום לסידן חיוני' },
];

export default function Home() {
  const [week, setWeek] = useState<number | null>(null);
  const [weekInput, setWeekInput] = useState('');
  const [mode, setMode] = useState<Mode>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [menuItems, setMenuItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * TIPS.length));
  }, []);

  const trimester = week ? (week <= 13 ? 1 : week <= 26 ? 2 : 3) : null;
  const trimesterLabel = trimester === 1 ? 'שליש ראשון' : trimester === 2 ? 'שליש שני' : 'שליש שלישי';
  const weekProgress = week ? Math.min(Math.round((week / 40) * 100), 100) : 0;

  function handleWeekSubmit() {
    const w = parseInt(weekInput);
    if (w >= 4 && w <= 42) { setWeek(w); }
    else { setError('נא להזין שבוע בין 4 ל-42'); }
  }

  function handleSearch(q: string) {
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); return; }
    setResults(searchFood(q));
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true); setError(''); setMenuItems([]);
    try {
      const { data } = await Tesseract.recognize(file, 'heb+eng', {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100));
        }
      });
      const lines = data.text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 2);
      analyzeMenuItems(lines);
    } catch { setError('שגיאה בקריאת התמונה. נסי שוב עם תמונה ברורה יותר.'); }
    setLoading(false); setOcrProgress(0);
  }

  async function handleUrl() {
    if (!urlInput.trim()) return;
    setLoading(true); setError(''); setMenuItems([]);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      analyzeMenuItems(data.items);
    } catch (err: unknown) {
      setError('שגיאה בטעינת האתר: ' + (err instanceof Error ? err.message : 'שגיאה'));
    }
    setLoading(false);
  }

  function analyzeMenuItems(items: string[]) {
    setMenuItems(items);
  }

  // ─── Welcome Screen ────────────────────────────────────────────────────────
  if (!week) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #052e16 0%, #14532d 40%, #831843 100%)' }}>

        {/* Floating food background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {[
            { e: '🥑', t: '8%', l: '6%', d: '0s', s: '2.8s' },
            { e: '🍓', t: '15%', l: '82%', d: '0.5s', s: '3.2s' },
            { e: '🥕', t: '35%', l: '91%', d: '1s', s: '2.5s' },
            { e: '🍌', t: '60%', l: '4%', d: '0.3s', s: '3.5s' },
            { e: '🥦', t: '75%', l: '78%', d: '0.8s', s: '2.9s' },
            { e: '🍳', t: '85%', l: '18%', d: '1.5s', s: '3.1s' },
            { e: '🥗', t: '22%', l: '45%', d: '2s', s: '4s' },
            { e: '🐟', t: '50%', l: '55%', d: '0.7s', s: '3.3s' },
          ].map((f, i) => (
            <span key={i} className="absolute text-4xl opacity-20 animate-float"
              style={{ top: f.t, left: f.l, animationDelay: f.d, animationDuration: f.s }}>
              {f.e}
            </span>
          ))}
        </div>

        {/* Card */}
        <div className="relative w-full max-w-sm animate-fadein" dir="rtl">
          {/* Glass card */}
          <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>

            {/* Rainbow top border */}
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #f59e0b 33%, #ec4899 66%, #8b5cf6 100%)' }} />

            <div className="p-7">
              {/* Logo */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl pulse-green"
                  style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #fce7f3 100%)', boxShadow: '0 8px 30px rgba(34,197,94,0.2)' }}>
                  🤰
                </div>
                <h1 className="text-4xl font-black tracking-tight"
                  style={{ background: 'linear-gradient(135deg, #15803d, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  אמא אוכלת
                </h1>
                <p className="text-gray-400 text-sm mt-1">מדריך תזונה חכם לאמהות בהריון</p>
              </div>

              {/* Week input */}
              <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg, #f0fdf4, #fdf2f8)' }}>
                <p className="text-center text-gray-700 font-bold mb-1">באיזה שבוע הריון את?</p>
                <p className="text-center text-gray-400 text-xs mb-4">ניתאים את ההמלצות עבורך</p>

                <div className="relative mb-4">
                  <input
                    type="number" min={4} max={42} value={weekInput}
                    onChange={e => { setWeekInput(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleWeekSubmit()}
                    placeholder="0"
                    className="w-full text-center font-black rounded-2xl px-4 py-4 transition-all"
                    style={{
                      fontSize: 48, border: '3px solid', lineHeight: 1.2,
                      borderColor: weekInput ? '#22c55e' : '#d1d5db',
                      color: weekInput ? '#15803d' : '#9ca3af',
                      background: 'white',
                    }}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">שבוע</span>
                </div>

                {/* Week slider hints */}
                <div className="flex justify-between text-xs text-gray-300 px-1 mb-4">
                  <span>שבוע 4</span>
                  <span>שבוע 20</span>
                  <span>שבוע 40</span>
                </div>

                {error && (
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-2.5 mb-3 text-center">
                    <p className="text-pink-600 text-xs font-medium">{error}</p>
                  </div>
                )}

                <button onClick={handleWeekSubmit}
                  className="w-full text-white font-black py-4 rounded-2xl text-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', boxShadow: '0 6px 20px rgba(34,197,94,0.35)' }}>
                  בואי נתחיל 🌿
                </button>
              </div>

              {/* Tip */}
              <div className="rounded-xl p-3 flex gap-3 items-center" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <span className="text-2xl">{TIPS[tipIndex].emoji}</span>
                <p className="text-xs text-amber-700 leading-relaxed">{TIPS[tipIndex].text}</p>
              </div>
            </div>

            {/* Features strip */}
            <div className="border-t border-gray-100 px-5 py-3 flex justify-around">
              {[['🔍', 'חיפוש'], ['📷', 'צילום תפריט'], ['🌐', 'אתר מסעדה']].map(([icon, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl mb-0.5">{icon}</div>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-white text-xs opacity-40 mt-4">המידע אינו מחליף ייעוץ רפואי</p>
        </div>
      </div>
    );
  }

  // ─── Main App ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" dir="rtl" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #fdf2f8 100%)' }}>

      {/* Header */}
      <header className="sticky top-0 z-20" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
              style={{ background: 'linear-gradient(135deg, #dcfce7, #fce7f3)' }}>🤰</div>
            <div>
              <h1 className="font-black text-lg leading-none"
                style={{ background: 'linear-gradient(135deg, #15803d, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                אמא אוכלת
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-medium text-gray-400">{trimesterLabel}</span>
                <span className="text-gray-200">•</span>
                <span className="text-xs font-bold text-green-600">שבוע {week}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress */}
            <div className="hidden sm:block text-left">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">התקדמות הריון</span>
                <span className="text-xs font-bold text-green-600">{weekProgress}%</span>
              </div>
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${weekProgress}%`, background: 'linear-gradient(90deg, #22c55e, #ec4899)' }} />
              </div>
            </div>
            <button onClick={() => { setWeek(null); setWeekInput(''); }}
              className="text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
              ✏️ שנה
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 pt-5 pb-12 space-y-4">

        {/* Tip banner */}
        <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef9c3)', border: '1px solid #fde68a' }}>
          <span className="text-2xl">{TIPS[tipIndex].emoji}</span>
          <div>
            <p className="text-xs font-bold text-amber-700 mb-0.5">טיפ לשבוע {week}</p>
            <p className="text-xs text-amber-600">{TIPS[tipIndex].text}</p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="rounded-2xl p-1.5 flex gap-1.5" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
          {([
            { id: 'search', icon: '🔍', label: 'חיפוש' },
            { id: 'photo', icon: '📷', label: 'צילום' },
            { id: 'url', icon: '🌐', label: 'מסעדה' },
          ] as { id: Mode; icon: string; label: string }[]).map(m => (
            <button key={m.id}
              onClick={() => { setMode(m.id); setResults([]); setMenuItems([]); setError(''); }}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5"
              style={mode === m.id
                ? { background: 'linear-gradient(135deg, #22c55e, #15803d)', color: 'white', boxShadow: '0 3px 12px rgba(34,197,94,0.35)' }
                : { color: '#9ca3af' }}>
              <span>{m.icon}</span><span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* ── Search Mode ── */}
        {mode === 'search' && (
          <div className="space-y-3 animate-slideup">
            <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">🔍</span>
                <input type="text" value={query} onChange={e => handleSearch(e.target.value)}
                  placeholder="חפשי מאכל... סושי, עוף, קפה..."
                  className="w-full rounded-xl pr-11 pl-4 py-3.5 text-right text-gray-700 font-medium transition-all"
                  style={{ border: '2px solid', borderColor: query ? '#86efac' : '#f3f4f6', background: query ? '#f0fdf4' : '#fafafa', fontSize: 15 }}
                  autoFocus
                />
              </div>
            </div>

            {results.length === 0 && query.length >= 2 && (
              <div className="rounded-2xl p-8 text-center animate-fadein" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="text-5xl mb-3">🤔</div>
                <p className="text-gray-600 font-bold">לא נמצאו תוצאות</p>
                <p className="text-sm text-gray-400 mt-1">עבור &ldquo;{query}&rdquo; — נסי מילה אחרת</p>
              </div>
            )}

            {results.length === 0 && query.length < 2 && (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">⭐</span>
                  <p className="font-bold text-gray-700">חיפושים נפוצים</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'סושי', e: '🍣' }, { name: 'קפה', e: '☕' }, { name: 'עוף', e: '🍗' },
                    { name: 'טונה', e: '🐟' }, { name: 'גבינה', e: '🧀' }, { name: 'בננה', e: '🍌' },
                    { name: 'אלכוהול', e: '🍷' }, { name: 'ביצה', e: '🥚' }, { name: 'אבוקדו', e: '🥑' },
                    { name: 'סלמון', e: '🐠' }, { name: 'חומוס', e: '🫘' }, { name: 'שוקולד', e: '🍫' },
                  ].map(s => (
                    <button key={s.name} onClick={() => handleSearch(s.name)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: '#4b5563' }}>
                      <span>{s.e}</span><span>{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.map((item, i) => <FoodCard key={i} item={item} delay={i * 60} />)}
          </div>
        )}

        {/* ── Photo Mode ── */}
        {mode === 'photo' && (
          <div className="space-y-3 animate-slideup">
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="p-6 text-center">
                <div className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center text-5xl"
                  style={{ background: 'linear-gradient(135deg, #dcfce7, #d1fae5)', boxShadow: '0 4px 20px rgba(34,197,94,0.15)' }}>📷</div>
                <h3 className="font-black text-gray-800 text-xl mb-1">צלמי תפריט</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">צלמי תפריט של מסעדה<br />ונגיד לך מה מותר לאכול בהריון</p>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
                <button onClick={() => fileRef.current?.click()} disabled={loading}
                  className="w-full text-white font-black py-4 rounded-2xl text-base transition-all"
                  style={{ background: loading ? '#d1d5db' : 'linear-gradient(135deg, #22c55e, #15803d)', boxShadow: loading ? 'none' : '0 5px 18px rgba(34,197,94,0.35)' }}>
                  {loading ? `מנתחת תמונה... ${ocrProgress}%` : '📸 בחרי תמונה של תפריט'}
                </button>
                {loading && (
                  <div className="mt-4">
                    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${ocrProgress}%`, background: 'linear-gradient(90deg, #22c55e, #15803d)' }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">קוראת טקסט מהתמונה...</p>
                  </div>
                )}
              </div>
              <div className="px-5 pb-5 flex gap-2">
                {[['📸', 'צלמי תפריט ברור'], ['🔍', 'נזהה את המנות'], ['✅', 'נסמן מה מותר']].map(([icon, text], i) => (
                  <div key={i} className="flex-1 text-center p-2 rounded-xl" style={{ background: '#f9fafb' }}>
                    <div className="text-lg mb-1">{icon}</div>
                    <p className="text-xs text-gray-400 leading-tight">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            {error && <ErrorCard message={error} />}
            {menuItems.length > 0 && <MenuList items={menuItems} onSelect={setSelectedMenuItem} />}
          </div>
        )}

        {/* ── URL Mode ── */}
        {mode === 'url' && (
          <div className="space-y-3 animate-slideup">
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="p-6">
                <div className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center text-5xl"
                  style={{ background: 'linear-gradient(135deg, #dbeafe, #ede9fe)', boxShadow: '0 4px 20px rgba(99,102,241,0.15)' }}>🌐</div>
                <h3 className="font-black text-gray-800 text-xl mb-1 text-center">אתר מסעדה</h3>
                <p className="text-gray-400 text-sm mb-5 text-center leading-relaxed">
                  הדביקי קישור לאתר מסעדה<br />לחצי על כל מנה לראות אם מותר
                </p>
                <div className="relative mb-3">
                  <input type="url" value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUrl()}
                    placeholder="https://www.restaurant.co.il"
                    className="w-full rounded-xl px-4 py-3.5 transition-all text-sm font-medium"
                    style={{ border: '2px solid', borderColor: urlInput ? '#93c5fd' : '#e5e7eb', background: urlInput ? '#eff6ff' : '#fafafa', direction: 'ltr' }}
                  />
                </div>
                <button onClick={handleUrl} disabled={loading || !urlInput.trim()}
                  className="w-full text-white font-black py-4 rounded-2xl text-base transition-all"
                  style={{ background: (loading || !urlInput.trim()) ? '#d1d5db' : 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: (loading || !urlInput.trim()) ? 'none' : '0 5px 18px rgba(99,102,241,0.35)' }}>
                  {loading ? '⟳ טוען תפריט...' : '🔍 טעני תפריט'}
                </button>
              </div>
            </div>
            {error && <ErrorCard message={error} />}
            {menuItems.length > 0 && <MenuList items={menuItems} onSelect={setSelectedMenuItem} />}
          </div>
        )}

        <p className="text-center text-xs text-gray-300 pt-2">המידע הוא לצרכי מידע בלבד ואינו מחליף ייעוץ רפואי</p>
      </div>
      {selectedMenuItem && <ItemPopup itemName={selectedMenuItem} onClose={() => setSelectedMenuItem(null)} />}
    </div>
  );
}

// ─── Food Card ─────────────────────────────────────────────────────────────
function FoodCard({ item, delay = 0 }: { item: FoodItem; delay?: number }) {
  const [open, setOpen] = useState(false);

  const styles = {
    allowed:  { border: '#86efac', bg: '#f0fdf4', badge: '#dcfce7', badgeText: '#15803d', accent: 'linear-gradient(180deg,#22c55e,#16a34a)', icon: '✅' },
    forbidden:{ border: '#f9a8d4', bg: '#fdf2f8', badge: '#fce7f3', badgeText: '#be185d', accent: 'linear-gradient(180deg,#ec4899,#db2777)', icon: '❌' },
    caution:  { border: '#fed7aa', bg: '#fff7ed', badge: '#ffedd5', badgeText: '#c2410c', accent: 'linear-gradient(180deg,#f97316,#ea580c)', icon: '⚠️' },
  }[item.status];

  return (
    <div className="food-card rounded-2xl overflow-hidden shadow-sm animate-fadein transition-all"
      style={{ border: `2px solid ${open ? styles.border : 'transparent'}`, background: open ? styles.bg : 'rgba(255,255,255,0.95)', animationDelay: `${delay}ms`, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

      <button className="w-full p-4 flex items-center gap-3 text-right" onClick={() => setOpen(!open)}>
        {/* Accent bar */}
        <div className="w-1 h-14 rounded-full flex-shrink-0" style={{ background: styles.accent }} />

        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: styles.badge }}>
              {getStatusEmoji(item.status)}
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-800 text-base truncate">{item.name}</p>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5"
                style={{ background: styles.badge, color: styles.badgeText }}>
                {getStatusLabel(item.status)}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ml-1"
            style={{ background: open ? styles.badge : '#f9fafb', color: styles.badgeText }}>
            <span className="text-xs">{open ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 space-y-3 animate-fadein" style={{ borderTop: `1.5px solid ${styles.border}` }}>
          <div className="pt-3 flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: styles.badge }}>💡</div>
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-1">למה?</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: styles.badge }}>✨</div>
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-1">המלצה</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Menu List (click to see verdict) ─────────────────────────────────────
function MenuList({ items, onSelect }: { items: string[]; onSelect: (item: string) => void }) {
  return (
    <div className="space-y-3 animate-slideup">
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <p className="font-black text-gray-700 mb-1 flex items-center gap-2">
          <span>🍽️</span> נמצאו {items.length} פריטים בתפריט
        </p>
        <p className="text-xs text-gray-400 mb-4">לחצי על כל מנה לראות אם מותר בהריון</p>
        <div className="space-y-2">
          {items.map((item, i) => {
            const match = findBestMatch(item);
            const dotColor = match?.status === 'allowed' ? '#22c55e' : match?.status === 'forbidden' ? '#ec4899' : match?.status === 'caution' ? '#f97316' : '#d1d5db';
            return (
              <button key={i} onClick={() => onSelect(item)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-right transition-all"
                style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                  <span className="text-sm font-medium text-gray-700 truncate">{item}</span>
                </div>
                <span className="text-gray-300 text-xs flex-shrink-0 mr-2">
                  {match ? getStatusEmoji(match.status) : '❓'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Item Verdict Popup ────────────────────────────────────────────────────
function ItemPopup({ itemName, onClose }: { itemName: string; onClose: () => void }) {
  const food = findBestMatch(itemName);
  const styles = food ? {
    allowed:  { border: '#86efac', bg: '#f0fdf4', badge: '#dcfce7', badgeText: '#15803d', accent: 'linear-gradient(135deg,#22c55e,#16a34a)' },
    forbidden:{ border: '#f9a8d4', bg: '#fdf2f8', badge: '#fce7f3', badgeText: '#be185d', accent: 'linear-gradient(135deg,#ec4899,#db2777)' },
    caution:  { border: '#fed7aa', bg: '#fff7ed', badge: '#ffedd5', badgeText: '#c2410c', accent: 'linear-gradient(135deg,#f97316,#ea580c)' },
  }[food.status] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl overflow-hidden animate-slideup" style={{ background: 'white' }} onClick={e => e.stopPropagation()}>
        {food && styles ? (
          <>
            <div className="p-6 text-center" style={{ background: styles.bg }}>
              <div className="text-5xl mb-3">{getStatusEmoji(food.status)}</div>
              <p className="text-xs text-gray-400 mb-1">שאלת על: <span className="font-bold text-gray-600">{itemName}</span></p>
              <h3 className="font-black text-2xl text-gray-800 mb-2">{food.name}</h3>
              <span className="text-sm font-black px-4 py-1.5 rounded-full" style={{ background: styles.badge, color: styles.badgeText }}>
                {getStatusLabel(food.status)}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-3 p-3 rounded-xl" style={{ background: styles.bg }}>
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-xs font-black text-gray-500 mb-0.5">למה?</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{food.reason}</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-xl" style={{ background: '#f9fafb' }}>
                <span className="text-lg">✨</span>
                <div>
                  <p className="text-xs font-black text-gray-500 mb-0.5">המלצה</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{food.recommendation}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">🤔</div>
            <p className="font-black text-gray-700 text-lg mb-1">&ldquo;{itemName}&rdquo;</p>
            <p className="text-gray-400 text-sm">לא נמצא מידע על מאכל זה במאגר שלנו</p>
          </div>
        )}
        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-3.5 rounded-2xl font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-2xl p-4 flex gap-3 items-start animate-fadein"
      style={{ background: '#fdf2f8', border: '2px solid #f9a8d4' }}>
      <span className="text-xl flex-shrink-0">⚠️</span>
      <p className="text-sm font-medium" style={{ color: '#be185d' }}>{message}</p>
    </div>
  );
}
