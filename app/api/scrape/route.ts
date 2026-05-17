import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Food-like name keys in JSON structures
const NAME_KEYS = new Set(['name', 'title', 'itemname', 'dishname', 'productname', 'label', 'displayname', 'item_name', 'dish_name', 'product_name', 'שם', 'כותרת']);

// Extract food names from embedded JSON (Next.js __NEXT_DATA__, Wolt, etc.)
function extractNamesFromJson(obj: unknown, results: string[], seen: Set<string>, depth = 0): void {
  if (depth > 12 || results.length > 200) return;
  if (typeof obj === 'string') return; // only via named keys
  if (Array.isArray(obj)) {
    for (const item of obj) extractNamesFromJson(item, results, seen, depth + 1);
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      if (NAME_KEYS.has(key.toLowerCase()) && typeof val === 'string') {
        const clean = val.replace(/\s+/g, ' ').trim();
        const lower = clean.toLowerCase();
        if (clean.length >= 3 && clean.length <= 55 && /[\u0590-\u05FFa-zA-Z]/.test(clean) && !seen.has(lower)) {
          seen.add(lower);
          results.push(clean);
        }
      } else {
        extractNamesFromJson(val, results, seen, depth + 1);
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL חסר' }, { status: 400 });

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`לא ניתן לטעון את האתר (${res.status})`);

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove all noise elements aggressively
    $('script, style, noscript, iframe, svg, img, button, input, form, nav, footer, header').remove();
    $('[class*="cookie"], [class*="popup"], [class*="modal"], [class*="banner"], [class*="cart"], [class*="basket"], [class*="checkout"], [class*="login"], [class*="signup"]').remove();
    $('[class*="breadcrumb"], [class*="pagination"], [class*="social"], [class*="share"], [class*="sidebar"]').remove();

    const seen = new Set<string>();
    const menuItems: string[] = [];

    // Exact phrases to ignore - UI, navigation, category headers (NOT food names)
    const ignoreExact = new Set([
      'תפריט', 'עמוד הבית', 'הבית', 'צור קשר', 'אודות', 'משלוחים', 'סניפים', 'שעות פתיחה',
      'כניסה', 'הרשמה', 'חיפוש', 'קטגוריות', 'הכל', 'ראשי', 'חזור', 'לחץ', 'לחצי', 'שלח',
      'אישור', 'ביטול', 'שמור', 'מחיקה', 'עדכון', 'loading', 'menu', 'home', 'back',
      'search', 'close', 'open', 'more', 'less', 'next', 'prev', 'submit', 'cancel',
      'הוסף לסל', 'הוסף', 'הזמן עכשיו', 'הזמנה', 'בחר', 'להזמנה', 'פרטים', 'ראה עוד',
      // Category headers - must not appear as menu items
      'מנות ראשונות', 'מנות עיקריות', 'מנות צד', 'מנות שף', 'מנות מיוחדות', 'מנות ילדים',
      'קינוחים', 'משקאות', 'שתייה', 'שתייה חמה', 'שתייה קרה', 'שתייה קלה',
      'אלכוהוליות', 'לא אלכוהוליות', 'יינות', 'בירות', 'קוקטיילים',
      'תוספות', 'תוספת', 'ממרחים', 'רטבים', 'סלטים', 'מרקים', 'לחמים', 'פיתות',
      'ארוחות בוקר', 'ארוחות צהריים', 'ארוחות ערב', 'ארוחות', 'מבצעים', 'חדש',
      'פופולרי', 'מומלץ', 'מיוחד', 'ספיישל', 'היום', 'שף',
      'גריל', 'מנגל', 'מאפיות', 'פיצות', 'פסטות', 'בשרים', 'עופות', 'דגים',
      'צמחוני', 'טבעוני', 'ללא גלוטן', 'כשר', 'חלבי', 'בשרי',
      'קטן', 'בינוני', 'גדול', 'מנה', 'חצי מנה', 'יחידה', 'מחיר', 'כמות', 'גודל',
    ]);

    function isGoodItem(clean: string): boolean {
      if (clean.length < 3 || clean.length > 55) return false;
      if (!(/[\u0590-\u05FFa-zA-Z]/.test(clean))) return false;
      if (ignoreExact.has(clean)) return false;
      if (/^\d+(\.\d+)?₪?$/.test(clean)) return false; // just a price
      if (/^\d+$/.test(clean)) return false; // just a number
      if (clean.includes('₪') || clean.includes('$')) return false;
      if (/^[א-ת]{1,2}$/.test(clean)) return false; // 1-2 Hebrew chars
      if (clean.split(/\s+/).length > 7) return false; // too many words = description
      return true;
    }

    function addItem(text: string) {
      const clean = text.replace(/\s+/g, ' ').trim();
      const lower = clean.toLowerCase();
      if (!seen.has(lower) && isGoodItem(clean)) {
        seen.add(lower);
        menuItems.push(clean);
      }
    }

    // 0. Try embedded JSON first (Next.js __NEXT_DATA__, Nuxt, etc.)
    const nextDataText = $('#__NEXT_DATA__').text() || $('script[type="application/json"]').first().text();
    if (nextDataText) {
      try {
        const parsed = JSON.parse(nextDataText);
        const jsonItems: string[] = [];
        extractNamesFromJson(parsed, jsonItems, seen);
        for (const item of jsonItems) {
          if (isGoodItem(item)) menuItems.push(item);
        }
      } catch { /* not valid JSON, skip */ }
    }

    // If JSON extraction gave enough results, skip HTML parsing
    if (menuItems.length >= 5) {
      return NextResponse.json({ items: menuItems.slice(0, 100), total: menuItems.length });
    }

    // 1. Priority: elements clearly marked as menu items
    const prioritySelectors = [
      '[class*="menu-item"]', '[class*="dish"]', '[class*="meal"]',
      '[class*="product-name"]', '[class*="item-name"]', '[class*="food-name"]',
      '[class*="menu_item"]', '[class*="dish_name"]', '[class*="product_title"]',
      '[class*="ItemCard"]', '[class*="menuItem"]', '[class*="DishCard"]',
      '[class*="item-title"]', '[class*="dish-title"]', '[class*="item_title"]',
      '[data-testid*="item"]', '[data-testid*="dish"]', '[data-testid*="product"]',
      '.dish', '.meal', '.menu-item', '.food-item', '.product-item',
    ];

    for (const selector of prioritySelectors) {
      $(selector).each((_, el) => {
        // Prefer name/title child to avoid grabbing description text
        const nameChild = $(el).children('[class*="name"],[class*="title"],[class*="Name"],[class*="Title"],h2,h3,h4,h5').first();
        if (nameChild.length) { addItem(nameChild.text()); return; }
        // Strip price/description children before reading text
        const txt = $(el).clone()
          .children('[class*="desc"],[class*="price"],[class*="weight"],[class*="calor"],[class*="info"]')
          .remove().end().text();
        if (txt.trim().length <= 55) addItem(txt);
      });
    }

    // 2. h2-h5 (skip h1 = restaurant name)
    $('h2, h3, h4, h5').each((_, el) => {
      addItem($(el).text());
    });

    // 3. Simple list items (not containers)
    $('li').each((_, el) => {
      if ($(el).children().length <= 2) {
        const txt = $(el).clone().children('[class*="price"],[class*="desc"]').remove().end().text();
        addItem(txt);
      }
    });

    // 4. Leaf spans (no children, short = likely a name not description)
    $('span').each((_, el) => {
      const text = $(el).text().trim();
      if ($(el).children().length === 0 && text.length >= 3 && text.length <= 45) {
        addItem(text);
      }
    });

    // 5. Fallback if almost nothing found
    if (menuItems.length < 3) {
      $('p, td').each((_, el) => {
        if ($(el).children().length === 0) addItem($(el).text());
      });
    }

    return NextResponse.json({
      items: menuItems.slice(0, 100),
      total: menuItems.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
