'use client';

import { useState, useRef } from 'react';
import { searchFood, findBestMatch, FoodItem, getStatusLabel, getStatusEmoji } from '@/lib/foodDatabase';
// findBestMatch used in MenuList popup
import Tesseract from 'tesseract.js';

type Mode = 'search' | 'photo' | 'url';

const WEEK_DATA: Record<number, { fruit: string; emoji: string; facts: string[] }> = {
  4:  { fruit: 'גרגיר פרג', emoji: '🌸', facts: ['העובר קטן כמו גרגיר פרג', 'הלב מתחיל להיווצר', 'מתפתחים הבסיסים למוח ולעמוד השדרה'] },
  5:  { fruit: 'שומשום', emoji: '🫚', facts: ['גודל גרגיר שומשום', 'הלב מתחיל לפעום!', 'מתפתחים איברים חיוניים'] },
  6:  { fruit: 'אפונה', emoji: '🫛', facts: ['גודל אפונה - כ-6 מ"מ', 'פניו מתחילים להיווצר', 'יש לו זנב קטנטן שנעלם בהמשך'] },
  7:  { fruit: 'אוכמנייה', emoji: '🫐', facts: ['גודל אוכמנייה - כ-1 ס"מ', 'המוח מתפתח מהר מאוד', 'הידיים והרגליים מתחילות לצמוח', 'הכליות מתחילות לפעול'] },
  8:  { fruit: 'פטל', emoji: '🍓', facts: ['גודל פטל - כ-1.6 ס"מ', 'האצבעות מתחילות להיווצר', 'העיניים נוצרות אבל עדיין עצומות'] },
  9:  { fruit: 'זית', emoji: '🫒', facts: ['גודל זית - כ-2.3 ס"מ', 'הלב כבר עם 4 תאים', 'כל האיברים הבסיסיים קיימים'] },
  10: { fruit: 'תות שדה', emoji: '🍓', facts: ['גודל תות - כ-3 ס"מ', 'העובר עובר רשמית לשלב "עובר"', 'האיברים ממשיכים להתבגר'] },
  11: { fruit: 'ליים', emoji: '🍋', facts: ['גודל ליים - כ-4 ס"מ', 'העובר יכול לבלוע ולבעוט!', 'השיניים מתחילות להיווצר'] },
  12: { fruit: 'שזיף', emoji: '🫐', facts: ['גודל שזיף - כ-5.4 ס"מ', 'הסיכון להפלה יורד משמעותית', 'ניתן לשמוע את פעימות הלב באולטרסאונד'] },
  13: { fruit: 'אפרסמון', emoji: '🍊', facts: ['גודל אפרסמון - כ-7 ס"מ', 'סוף השליש הראשון!', 'טביעות האצבע כבר נוצרות'] },
  14: { fruit: 'לימון', emoji: '🍋', facts: ['גודל לימון - כ-8.7 ס"מ', 'יכול להרים גבות ולכווץ פנים', 'שמרטפי מין ניתנים לזיהוי באולטרסאונד'] },
  15: { fruit: 'תפוח', emoji: '🍎', facts: ['גודל תפוח - כ-10 ס"מ', 'שומע קולות מבחוץ!', 'מתחיל לשאוב מי שפיר'] },
  16: { fruit: 'אבוקדו', emoji: '🥑', facts: ['גודל אבוקדו - כ-11.6 ס"מ', 'כ-100 גרם משקל', 'הגב מתחזק ועומד זקוף יותר'] },
  17: { fruit: 'אגס', emoji: '🍐', facts: ['גודל אגס - כ-13 ס"מ', 'שומן מתחיל להצטבר מתחת לעור', 'שומע ומגיב לקולות'] },
  18: { fruit: 'פלפל אדום', emoji: '🫑', facts: ['גודל פלפל - כ-14.2 ס"מ', 'ייתכן שתרגישי בעיטות בקרוב!', 'כיסוי לבן מגן מתחיל לכסות את העור'] },
  19: { fruit: 'עגבנייה', emoji: '🍅', facts: ['גודל עגבנייה - כ-15.3 ס"מ', 'חושי הריח מתפתחים', 'השיניים הקבועות מתחילות להיווצר'] },
  20: { fruit: 'בננה', emoji: '🍌', facts: ['גודל בננה - כ-16.5 ס"מ', 'אמצע ההריון! מזל טוב!', 'מבצע בעיטות ותנועות מורגשות'] },
  21: { fruit: 'גזר', emoji: '🥕', facts: ['גודל גזר - כ-26.7 ס"מ (מהראש לרגל)', 'מציץ אצבע!', 'מחזור שינה-ערות מתפתח'] },
  22: { fruit: 'פפאיה', emoji: '🍈', facts: ['כ-430 גרם', 'חוש הראייה מתפתח', 'שומע את קול אמא בצורה ברורה'] },
  23: { fruit: 'מנגו', emoji: '🥭', facts: ['כ-500 גרם', 'העור עדיין שקוף - רואים דרכו!', 'הריאות מתחילות להתכונן לנשימה'] },
  24: { fruit: 'תירס', emoji: '🌽', facts: ['כ-600 גרם', 'פניו מפותחות לגמרי', 'גבות ושיער על הראש מתפתחים'] },
  25: { fruit: 'כרובית', emoji: '🥦', facts: ['כ-660 גרם', 'יכול להגיב לכאב', 'המוח והריאות ממשיכים להתפתח'] },
  26: { fruit: 'חסה ראש', emoji: '🥬', facts: ['כ-760 גרם', 'עיניים נפתחות לראשונה!', 'מגיב לאור'] },
  27: { fruit: 'כרוב', emoji: '🥦', facts: ['כ-875 גרם', 'שלב קריטי לפיתוח הריאות', 'מחזורי שינה ברורים'] },
  28: { fruit: 'חציל', emoji: '🍆', facts: ['כ-1 ק"ג!', 'תחילת השליש השלישי!', 'יכול לחלום (שנת REM)'] },
  29: { fruit: 'דלורית', emoji: '🎃', facts: ['כ-1.15 ק"ג', 'שרירים ועצמות מתחזקים', 'הראש מתחיל לרדת כלפי מטה'] },
  30: { fruit: 'מלפפון גדול', emoji: '🥒', facts: ['כ-1.3 ק"ג', 'המוח מתפתח בקצב מהיר', 'יכול לאחוז ביד'] },
  31: { fruit: 'אננס', emoji: '🍍', facts: ['כ-1.5 ק"ג', 'כל החושים חדים', 'מסתובב - הראש לרוב כלפי מטה'] },
  32: { fruit: 'ירוק', emoji: '🥦', facts: ['כ-1.7 ק"ג', 'עצמות מתקשות', 'מקום בברטן הולך ומצטמצם'] },
  33: { fruit: 'אננס קטן', emoji: '🍍', facts: ['כ-1.9 ק"ג', 'הריאות כמעט בשלות', 'שומן מצטבר לחמם אותו'] },
  34: { fruit: 'מלון', emoji: '🍈', facts: ['כ-2.1 ק"ג', 'ציפורניים ושיער מלאים', 'מוכן כמעט לחיים בחוץ!'] },
  35: { fruit: 'מלון ירוק', emoji: '🍈', facts: ['כ-2.4 ק"ג', 'הכליות בשלות לגמרי', 'מערכת העיכול מוכנה'] },
  36: { fruit: 'פפאיה גדולה', emoji: '🥭', facts: ['כ-2.6 ק"ג', 'נחשב "כמעט לידה מלאה"', 'מוכן ללידה מוקדמת'] },
  37: { fruit: 'ירק עלים גדול', emoji: '🥬', facts: ['כ-2.85 ק"ג', 'לידה מלאה מבחינה רפואית!', 'המוח עדיין מתפתח'] },
  38: { fruit: 'כרישה', emoji: '🧅', facts: ['כ-3.1 ק"ג', 'מוכן לגמרי ללידה!', 'מייצר תחומין לחלב הראשון'] },
  39: { fruit: 'אבטיח קטן', emoji: '🍉', facts: ['כ-3.3 ק"ג', 'ציפורניים ארוכות', 'ממשיך לצבור שומן'] },
  40: { fruit: 'אבטיח', emoji: '🍉', facts: ['כ-3.5 ק"ג', 'מוכן לצאת לעולם!', 'מזל טוב - נס של חיים! 💕'] },
};

const SYMPTOMS_BY_WEEK: { range: [number,number]; items: { emoji: string; title: string; tip: string }[] }[] = [
  { range: [4,5], items: [
    { emoji: '😴', title: 'עייפות פתאומית', tip: 'גופך עכשיו בונה שליה - ישני כשאפשר' },
    { emoji: '🤢', title: 'בחילה ראשונה', tip: 'אכלי ביסקוויט יבש לפני שקמת מהמיטה' },
    { emoji: '💛', title: 'רגישות בחזה', tip: 'חזייה תומכת - גם בלילה' },
    { emoji: '🚽', title: 'ריצות לשירותים', tip: 'נורמלי לגמרי - ההורמונים גורמים לזה' },
    { emoji: '😢', title: 'שינויי מצב רוח', tip: 'הורמון HCG עולה מהר - מותר לבכות' },
    { emoji: '🌡️', title: 'חום גוף קל', tip: 'טמפרטורת גוף מעט גבוהה היא נורמלית' },
  ]},
  { range: [6,7], items: [
    { emoji: '🤢', title: 'בחילות בשיא', tip: 'ג׳ינג׳ר, לימון, ושיבולת שועל בבוקר עוזרים' },
    { emoji: '👃', title: 'רגישות קיצונית לריחות', tip: 'הימני מבישול - בקשי מישהו לבשל' },
    { emoji: '😴', title: 'עייפות קשה', tip: 'שינה של 9-10 שעות - בסדר גמור' },
    { emoji: '🫠', title: 'רוק מוגבר', tip: 'תופעה נפוצה - מציצת לימון יכולה להקל' },
    { emoji: '💛', title: 'כאב בחזה', tip: 'הנחת קרח בגד עוזר, שתי הרבה מים' },
    { emoji: '😰', title: 'חרדה ראשונית', tip: 'לגמרי נורמלי - דברי עם מישהי שאת סומכת עליה' },
  ]},
  { range: [8,9], items: [
    { emoji: '🤢', title: 'בחילות כל היום', tip: 'אכלי מעט כל שעתיים במקום ארוחות גדולות' },
    { emoji: '😴', title: 'עייפות מתמשכת', tip: 'שנת צהריים קצרה משנה את המצב' },
    { emoji: '🤯', title: 'ראש כבד', tip: 'שתי הרבה מים, הימני ממסכים' },
    { emoji: '🫀', title: 'דפיקות לב מהירות', tip: 'נפח הדם עולה - נורמלי, ציני לרופא' },
    { emoji: '🔙', title: 'כאב גב תחתון', tip: 'כרית בין הברכיים בשינה' },
    { emoji: '😵', title: 'סחרחורות', tip: 'קומי לאט תמיד, אכלי בקביעות' },
  ]},
  { range: [10,11], items: [
    { emoji: '🤢', title: 'בחילות מתחילות לרדת', tip: 'סוף המנהרה מתחיל להיראות!' },
    { emoji: '👗', title: 'בגדים מתחילים להדק', tip: 'הבטן מתחילה לצמוח - זמן לבגדי הריון' },
    { emoji: '😴', title: 'עייפות עדיין כבדה', tip: 'עוד שבועיים-שלושה ותרגישי טוב יותר' },
    { emoji: '🍔', title: 'תיאבון משתנה', tip: 'גם אם יש לך תשוקות מוזרות - בסדר' },
    { emoji: '💭', title: 'שכחה קלה', tip: '"ערפל הריון" - רשמי הכל' },
    { emoji: '🦷', title: 'חניכיים מדממות', tip: 'מברשת רכה וחוט דנטלי עדין' },
  ]},
  { range: [12,13], items: [
    { emoji: '🎉', title: 'סוף השליש הראשון!', tip: 'הסיכון יורד משמעותית - מזל טוב!' },
    { emoji: '⚡', title: 'אנרגיה חוזרת קצת', tip: 'תרגישי שיפור בשבועות הקרובים' },
    { emoji: '🤢', title: 'בחילות פוחתות', tip: 'לרוב נעלמות עד שבוע 14-16' },
    { emoji: '🤰', title: 'הבטן מתחילה להיראות', tip: 'עכשיו בטוח לספר לכולם!' },
    { emoji: '🌙', title: 'שינה יותר נוחה', tip: 'התחילי לישון על הצד - עדיף שמאלי' },
    { emoji: '💆', title: 'הקלה רגשית', tip: 'עברת את השלב הכי מאתגר - כל הכבוד!' },
  ]},
  { range: [14,15], items: [
    { emoji: '⚡', title: 'אנרגיה חוזרת', tip: 'ברוכה הבאה לשליש השני!' },
    { emoji: '🤰', title: 'הבטן גדלה', tip: 'משחת שמן לבטן תמנע סימני מתיחה' },
    { emoji: '😁', title: 'מצב רוח טוב יותר', tip: 'הורמונים מתאזנים - תהני מזה!' },
    { emoji: '🔥', title: 'צרבת מתחילה', tip: 'הימני ממאכלים חריפים וחמוצים' },
    { emoji: '🦵', title: 'כאבי רצועות', tip: 'כאב חד בבטן - נורמלי, הרחם גדל' },
    { emoji: '💄', title: 'עור זוהר', tip: 'הריון זוהר - תהני ממנו!' },
  ]},
  { range: [16,17], items: [
    { emoji: '⚡', title: 'תחושה מצוינת!', tip: 'שבועות 16-20 הם לרוב הכי נוחים' },
    { emoji: '🤰', title: 'הבטן ברורה', tip: 'הגיע הזמן לבגדי הריון מלאים' },
    { emoji: '🔥', title: 'צרבת', tip: 'ארוחות קטנות, אל תשכבי מיד אחרי אכילה' },
    { emoji: '👃', title: 'אף סתום', tip: 'נפיחות של הקרום הרירי - נורמלי' },
    { emoji: '💤', title: 'שינה משתפרת', tip: 'כרית בין הרגליים לנוחות מקסימלית' },
    { emoji: '🧠', title: 'ערפל הריון', tip: 'אפשר לשכוח - רשמי הכל ביומן' },
  ]},
  { range: [18,20], items: [
    { emoji: '🦋', title: 'תנועות ראשונות!', tip: 'כמו בועות או פרפרים - הנה היא!' },
    { emoji: '🤰', title: 'בטן עגולה ויפה', tip: 'תצלמי - תרצי לזכור את זה' },
    { emoji: '🔥', title: 'צרבת מוגברת', tip: 'אכלי לאט, לעסי טוב, קומי לאחר אכילה' },
    { emoji: '💙', title: 'בדיקת מורפולוגיה', tip: 'שבוע 20 - בדיקה חשובה, תתכנני' },
    { emoji: '🦵', title: 'עווית רגליים בלילה', tip: 'מגנזיום + מתיחות לפני השינה' },
    { emoji: '😰', title: 'קוצר נשימה קל', tip: 'הרחם גדל ולוחץ - קחי אוויר עמוק' },
  ]},
  { range: [21,23], items: [
    { emoji: '👊', title: 'בעיטות ברורות', tip: 'תעירי את בן הזוג - תנו לו לחוש!' },
    { emoji: '🔥', title: 'צרבת מטרידה', tip: 'שנו עם ראש מורם, אכלי ערב מוקדם' },
    { emoji: '🦶', title: 'נפיחות קלה ברגליים', tip: 'הרימי רגליים כשאפשר' },
    { emoji: '🌙', title: 'קשיי שינה', tip: 'כרית U גדולה לנוחות מקסימלית' },
    { emoji: '🔙', title: 'כאב גב', tip: 'שחייה ויוגה להריון עוזרים מאוד' },
    { emoji: '😅', title: 'הזעה מוגברת', tip: 'לבשי בגדים נושמים, שתי מים קרים' },
  ]},
  { range: [24,26], items: [
    { emoji: '👶', title: 'בעיטות חזקות', tip: 'ספרי 10 בעיטות ביום - סימן לתינוק בריא' },
    { emoji: '🦶', title: 'נפיחות ברגליים', tip: 'הפחיתי מלח, הרימי רגליים, שתי מים' },
    { emoji: '😴', title: 'עייפות חוזרת', tip: 'נורמלי - הגוף עובד קשה' },
    { emoji: '🔥', title: 'צרבת חזקה', tip: 'גלידה מקלה! גם חלב קר' },
    { emoji: '💉', title: 'בדיקת סוכר', tip: 'שבוע 24-28 - בדיקת OGTT חשובה' },
    { emoji: '🎵', title: 'העובר שומע', tip: 'שירי לו - הוא כבר שומע ומגיב!' },
  ]},
  { range: [27,29], items: [
    { emoji: '🎊', title: 'שליש שלישי!', tip: 'עוד רבע ותפגשי אותה/אותו!' },
    { emoji: '😤', title: 'קשיי נשימה', tip: 'הרחם לוחץ על הסרעפת - שבי זקופה' },
    { emoji: '🦶', title: 'נפיחות גוברת', tip: 'מקלחות קרות + גרביים תומכות' },
    { emoji: '💪', title: 'צירי ברקסטון היקס', tip: 'צירים לא סדירים - אימון הרחם, לא לידה' },
    { emoji: '🌙', title: 'שינה קשה', tip: 'כרית בין ברכיים + מתחת לבטן' },
    { emoji: '🔙', title: 'כאב גב חזק', tip: 'פיזיותרפיסטית להריון - ממליצה מאוד' },
  ]},
  { range: [30,32], items: [
    { emoji: '😤', title: 'נשימה קצרה', tip: 'נשמי עמוק, שבי זקופה, הימני ממאמץ' },
    { emoji: '🦶', title: 'נפיחות ברגליים וידיים', tip: 'אם הנפיחות חדה - פני לרופא' },
    { emoji: '💪', title: 'צירים מתכוננים', tip: 'צירי ברקסטון הופכים תכופים יותר' },
    { emoji: '🚽', title: 'לחץ על השלפוחית', tip: 'שתי מים אבל הגבילי לפני שינה' },
    { emoji: '🍔', title: 'צרבת חזקה מאוד', tip: 'ישני עם גב מורם, אכלי קטן ותכוף' },
    { emoji: '😰', title: 'חרדת לידה', tip: 'קורס לידה, נשימות, שיחה עם מיילדת' },
  ]},
  { range: [33,35], items: [
    { emoji: '🏋️', title: 'כובד וקושי בתנועה', tip: 'קחי את הזמן, אל תמהרי' },
    { emoji: '😴', title: 'עייפות כבדה', tip: 'נוחי כמה שיותר לפני הלידה' },
    { emoji: '💪', title: 'צירים תכופים יותר', tip: 'אם כל 5 דקות - לבית חולים' },
    { emoji: '🧠', title: 'עומס רגשי', tip: 'הכיני את התיק, תכנני - זה מרגיע' },
    { emoji: '🔙', title: 'כאבי אגן', tip: 'פיזיותרפיה + חגורת תמיכה לבטן' },
    { emoji: '👶', title: 'העובר יורד למטה', tip: 'תרגישי לחץ על האגן - שלב טבעי' },
  ]},
  { range: [36,38], items: [
    { emoji: '🏥', title: 'הכני תיק לבית חולים', tip: 'בגדים, תעודות, טעינות - הכי חשוב!' },
    { emoji: '💪', title: 'צירים סדירים יותר', tip: 'אם כל 5-7 דקות + 1 דקה - לצאת' },
    { emoji: '🚽', title: 'לחץ חזק על האגן', tip: 'הראש יורד - לידה מתקרבת' },
    { emoji: '😴', title: 'שינה כמעט בלתי אפשרית', tip: 'נוחי על הצד, כריות מכל הצדדים' },
    { emoji: '🫗', title: 'הדלפות קלות', tip: 'אם פקק ריר/דם - אותת לידה קרובה' },
    { emoji: '💆', title: 'חרדה ורגש', tip: 'נשמי, את מוכנה. גופך יודע מה לעשות!' },
  ]},
  { range: [39,42], items: [
    { emoji: '🎊', title: 'כמעט שם!', tip: 'כל יום שעובר הוא ניצחון!' },
    { emoji: '💪', title: 'צירים - מתי לצאת?', tip: 'כל 5 דקות, מנה דקה, שעה שלמה - לצאת!' },
    { emoji: '🌊', title: 'שבירת מים', tip: 'מים שוברים? לבית חולים מיד' },
    { emoji: '😌', title: 'שקט לפני הסערה', tip: 'נוחי, אכלי קל, שמרי אנרגיה' },
    { emoji: '💕', title: 'עוד קצת', tip: 'בקרוב תחזיקי אותה/אותו בידיים!' },
    { emoji: '🏥', title: 'תיק מוכן?', tip: 'בדקי שוב: ניירות, בגדים לתינוק, מטען' },
  ]},
];

function getSymptomsForWeek(week: number) {
  return SYMPTOMS_BY_WEEK.find(s => week >= s.range[0] && week <= s.range[1])?.items ?? SYMPTOMS_BY_WEEK[0].items;
}

const RECIPES = [
  { emoji: '🍌', name: 'שייק בננה וג׳ינג׳ר', time: '5 דק׳', trimester: ['first'],
    ingredients: ['בננה קפואה', 'כוס חלב', 'פיסת ג׳ינג׳ר טרי', 'כפית דבש'],
    steps: ['שימי הכל בבלנדר', 'טחני 30 שניות', 'שתי קר - מעולה לבחילות'] },
  { emoji: '🥚', name: 'ביצה מקושקשת עם גבינה', time: '7 דק׳', trimester: ['first','second','third'],
    ingredients: ['2 ביצים', 'כף גבינה צפתית', 'מעט חמאה', 'מלח ופלפל'],
    steps: ['חממי מחבת על אש נמוכה', 'טרפי ביצים עם גבינה', 'בשלי תוך ערבוב עדין'] },
  { emoji: '🥣', name: 'שיבולת שועל עם פירות', time: '5 דק׳', trimester: ['first'],
    ingredients: ['חצי כוס שיבולת שועל', 'כוס חלב', 'בננה', 'כפית דבש'],
    steps: ['בשלי שיבולת שועל בחלב 3 דקות', 'הוסיפי בננה חתוכה', 'טפטפי דבש'] },
  { emoji: '🥗', name: 'סלט עוף ואבוקדו', time: '15 דק׳', trimester: ['second','third'],
    ingredients: ['חזה עוף מבושל', 'אבוקדו', 'עגבנייה', 'לימון + שמן זית'],
    steps: ['בשלי עוף עד הכנה מלאה', 'חתכי לקוביות', 'ערבבי עם אבוקדו ועגבנייה', 'תבלי בלימון ושמן זית'] },
  { emoji: '🐟', name: 'סלמון אפוי עם ירקות', time: '25 דק׳', trimester: ['second','third'],
    ingredients: ['פילה סלמון', 'ברוקולי', 'גזר', 'שמן זית + לימון + שום'],
    steps: ['חממי תנור ל-180°', 'ערכי הכל בתבנית', 'אפי 20 דקות - הסלמון מוכן כשמתפורר'] },
  { emoji: '🍲', name: 'מרק עדשים עם ירקות', time: '30 דק׳', trimester: ['first','second','third'],
    ingredients: ['כוס עדשים כתומות', 'גזר + סלרי + בצל', 'כמון + כורכום', 'מלח'],
    steps: ['טגני בצל עד שקיפות', 'הוסיפי ירקות ועדשים', 'כסי במים ובשלי 25 דקות', 'תבל והגישי'] },
  { emoji: '🥙', name: 'פיתה עם חומוס וירקות', time: '5 דק׳', trimester: ['first','second','third'],
    ingredients: ['פיתה מלאה', 'חומוס', 'מלפפון + עגבנייה + פלפל', 'טחינה'],
    steps: ['פתחי פיתה', 'מרחי חומוס נדיב', 'מלאי בירקות טריים', 'טפטפי טחינה'] },
  { emoji: '🥦', name: 'עוף עם ברוקולי', time: '30 דק׳', trimester: ['third'],
    ingredients: ['חזה עוף', 'ברוקולי גדול', 'שן שום + ג׳ינג׳ר', 'רוטב סויה דל נתרן'],
    steps: ['חתכי עוף לקוביות ובשלי', 'הוסיפי ברוקולי 5 דקות לפני הסוף', 'תבל ברוטב סויה וג׳ינג׳ר'] },
  // More first trimester - anti-nausea, easy to digest
  { emoji: '🫚', name: 'טוסט אבוקדו ולימון', time: '5 דק׳', trimester: ['first','second'],
    ingredients: ['פרוסת לחם מלא', 'חצי אבוקדו', 'מיץ לימון', 'מלח גס + פלפל'],
    steps: ['קלי לחם', 'מעכי אבוקדו עם לימון', 'מרחי על הלחם', 'תבלי במלח ופלפל'] },
  { emoji: '🥛', name: 'פודינג צ׳יה עם בננה', time: '10 דק׳ + לילה', trimester: ['first','second','third'],
    ingredients: ['3 כפות זרעי צ׳יה', 'כוס חלב שקדים', 'בננה', 'כפית דבש'],
    steps: ['ערבבי צ׳יה עם חלב ודבש', 'שמי במקרר ללילה', 'בבוקר הוסיפי בננה פרוסה'] },
  { emoji: '🫐', name: 'יוגורט עם פירות יער', time: '3 דק׳', trimester: ['first','second','third'],
    ingredients: ['גביע יוגורט יווני', 'חופן פירות יער קפואים', 'גרנולה', 'כפית דבש'],
    steps: ['שימי יוגורט בקערה', 'הוסיפי פירות יער', 'פזרי גרנולה ודבש'] },
  // Second trimester - iron, calcium, protein
  { emoji: '🥩', name: 'בקר מוקפץ עם ירקות', time: '20 דק׳', trimester: ['second','third'],
    ingredients: ['200 גר׳ בשר בקר רזה', 'פלפלים + קישוא', 'שום + ג׳ינג׳ר', 'רוטב סויה'],
    steps: ['חתכי בשר לפסים דקים', 'הקפיצי על אש גבוהה', 'הוסיפי ירקות 3 דקות', 'תבל ברוטב סויה'] },
  { emoji: '🧆', name: 'חומוס ביתי עם שמן זית', time: '10 דק׳', trimester: ['first','second','third'],
    ingredients: ['קופסת חומוס מבושל', 'טחינה גולמית', 'לימון + שום', 'שמן זית + פפריקה'],
    steps: ['טחני חומוס עם טחינה ולימון', 'הוסיפי שום ומלח לפי טעם', 'הגישי עם שמן זית ופפריקה'] },
  { emoji: '🥕', name: 'מרק גזר וג׳ינג׳ר', time: '25 דק׳', trimester: ['first','second','third'],
    ingredients: ['5 גזרים גדולים', 'פיסת ג׳ינג׳ר טרי', 'בצל + שום', 'שמן זית + מלח'],
    steps: ['טגני בצל ושום', 'הוסיפי גזר חתוך וג׳ינג׳ר', 'כסי במים ובשלי 20 דקות', 'טחני עד חלק'] },
  // Third trimester - iron, fiber, light
  { emoji: '🫘', name: 'קדרת שעועית ועגבניות', time: '30 דק׳', trimester: ['second','third'],
    ingredients: ['קופסת שעועית לבנה', 'עגבניות מרוסקות', 'בצל + שום + כמון', 'פלפל אדום'],
    steps: ['טגני בצל ושום', 'הוסיפי עגבניות וכמון', 'הוסיפי שעועית ובשלי 15 דקות', 'הגישי עם לחם'] },
  { emoji: '🍠', name: 'בטטה אפויה עם גבינה', time: '45 דק׳', trimester: ['second','third'],
    ingredients: ['בטטה גדולה', 'גבינה צהובה מגוררת', 'שמנת חמוצה', 'ירוקים'],
    steps: ['אפי בטטה שלמה ב-200° כ-40 דקות', 'חצי ופרוסי מעט', 'מלאי בגבינה ושמנת', 'הגישי עם עשבי תיבול'] },
  { emoji: '🥜', name: 'כדורי שקדים ותמרים', time: '15 דק׳', trimester: ['first','second','third'],
    ingredients: ['10 תמרים מגולענים', 'כוס שקדים', 'כף קקאו', 'קוקוס טחון לציפוי'],
    steps: ['טחני שקדים ותמרים בפוד פרוססור', 'הוסיפי קקאו וערבבי', 'צרי כדורים', 'גלגלי בקוקוס'] },
];

const TIPS_BY_WEEK: Record<number, { emoji: string; text: string }> = {
  4:  { emoji: '💊', text: 'התחילי חומצה פולית אם עדיין לא - חיונית מאוד עכשיו!' },
  5:  { emoji: '🥦', text: 'ברוקולי ותרד עשירים בחומצה פולית - הוסיפי לכל ארוחה' },
  6:  { emoji: '🫚', text: 'ג׳ינג׳ר טרי בתה או בשייק - עוזר מאוד לבחילות' },
  7:  { emoji: '🍪', text: 'ביסקוויט יבש ליד המיטה - אכלי לפני שקמת בבוקר' },
  8:  { emoji: '💧', text: 'שתי לאט לאט - לגימות קטנות לאורך היום עוזרות לבחילה' },
  9:  { emoji: '🥛', text: 'סידן חשוב עכשיו - 3 מנות חלב ביום או תחליפים' },
  10: { emoji: '🥩', text: 'ברזל חיוני - בשר בקר, קטניות ועלים ירוקים' },
  11: { emoji: '🥜', text: 'שקדים ואגוזים - חטיף מושלם עשיר בחלבון ומגנזיום' },
  12: { emoji: '🎉', text: 'סוף שליש ראשון! הסיכון ירד - אפשר לספר לכולם' },
  13: { emoji: '🥑', text: 'אבוקדו עשיר בחומצה פולית ואשלגן - הוסיפי לכל מקום' },
  14: { emoji: '🐟', text: 'סלמון מבושל - אומגה 3 לפיתוח מוח התינוק' },
  15: { emoji: '🥕', text: 'גזר ובטטה - ויטמין A לעיניים ועור בריא לתינוק' },
  16: { emoji: '🫐', text: 'פירות יער - נוגדי חמצון מצוינים לך ולתינוק' },
  17: { emoji: '🥚', text: 'ביצים - חלבון שלם + כולין לפיתוח מוח התינוק' },
  18: { emoji: '🌰', text: 'אגוזי מלך - אומגה 3 צמחי מצוין, חופן ביום' },
  19: { emoji: '🧀', text: 'גבינות קשות מפוסטרות - מקור סידן בטוח ומצוין' },
  20: { emoji: '💧', text: 'חצי הדרך! שתי 2 ליטר מים ביום - חשוב מאוד' },
  21: { emoji: '🫘', text: 'קטניות - עדשים, חומוס, שעועית - ברזל + חלבון + סיבים' },
  22: { emoji: '🥦', text: 'ברוקולי - סידן, ברזל וחומצה פולית בירק אחד!' },
  23: { emoji: '🍌', text: 'בננה - אשלגן נגד עוויתות רגליים בלילה' },
  24: { emoji: '🌾', text: 'דגנים מלאים - אנרגיה יציבה לאורך היום' },
  25: { emoji: '🐟', text: 'דגים עשירי אומגה 3 - סלמון, סרדינים, מוסר ים' },
  26: { emoji: '🥛', text: 'הכפילי סידן עכשיו - העצמות של התינוק בונות בקצב מהיר' },
  27: { emoji: '🥩', text: 'ברזל חשוב מאוד עכשיו - בשר, קטניות + ויטמין C לספיגה' },
  28: { emoji: '💊', text: 'ויטמין D - שאלי רופא לגבי תוספים אם לא יוצאת לשמש' },
  29: { emoji: '🍠', text: 'בטטה - עשירה בוויטמין A ואשלגן, מתוקה וטעימה' },
  30: { emoji: '🥑', text: 'שומנים בריאים - אבוקדו, שמן זית, אגוזים - לפיתוח המוח' },
  31: { emoji: '🫐', text: 'פירות יער קפואים - נוחים, זולים ועשירים בנוגדי חמצון' },
  32: { emoji: '💧', text: 'שתיית מים מונעת צירי ברקסטון - לפחות 8 כוסות ביום' },
  33: { emoji: '🌰', text: 'שקדים - מגנזיום לשינה טובה יותר ולהפחתת עוויתות' },
  34: { emoji: '🥦', text: 'ירקות ירוקים - ברזל לך ולתינוק לקראת הלידה' },
  35: { emoji: '🍗', text: 'חלבון מלא - עוף, הודו, דגים - לבנייה אחרונה של השרירים' },
  36: { emoji: '🫚', text: 'שמן קשרי תמר - מחקרים מראים שעשוי לעזור בלידה' },
  37: { emoji: '🍵', text: 'תה עלי פטל אדום - מסורתית מומלץ לשבועות אחרונים' },
  38: { emoji: '💧', text: 'שתי הרבה מים - מכינה את הגוף ללידה' },
  39: { emoji: '🍫', text: 'שוקולד מריר קטן ביום - מגנזיום + אושר!' },
  40: { emoji: '🎊', text: 'בכל יום שעובר התינוק מוכן יותר - עוד קצת סבלנות!' },
};

function getTipForWeek(week: number) {
  return TIPS_BY_WEEK[week] ?? TIPS_BY_WEEK[Math.max(4, Math.min(40, week))];
}

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
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [photoFallback, setPhotoFallback] = useState(false);
  const [photoQuery, setPhotoQuery] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);


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
    setLoading(true); setError(''); setMenuItems([]); setPhotoFallback(false); setPhotoQuery('');
    try {
      const { data } = await Tesseract.recognize(file, 'heb+eng', {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100));
        }
      });
      const lines = data.text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 2);
      if (lines.length < 2) {
        setPhotoFallback(true);
      } else {
        analyzeMenuItems(lines);
      }
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
                <span className="text-2xl">{getTipForWeek(5).emoji}</span>
                <p className="text-xs text-amber-700 leading-relaxed">{getTipForWeek(5).text}</p>
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
          <span className="text-2xl">{getTipForWeek(week!).emoji}</span>
          <div>
            <p className="text-xs font-bold text-amber-700 mb-0.5">טיפ לשבוע {week}</p>
            <p className="text-xs text-amber-600">{getTipForWeek(week!).text}</p>
          </div>
        </div>

        {/* Week fruit card */}
        {week && WEEK_DATA[week] && (() => {
          const wd = WEEK_DATA[week];
          return (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}>
              <div className="h-1" style={{ background: 'linear-gradient(90deg, #22c55e, #ec4899)' }} />
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f0fdf4, #fdf2f8)' }}>
                    {wd.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium mb-0.5">שבוע {week} - גודל העובר</p>
                    <p className="font-black text-lg leading-tight"
                      style={{ background: 'linear-gradient(135deg, #15803d, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      כמו {wd.fruit}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {wd.facts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold text-sm mt-0.5">✦</span>
                      <p className="text-xs text-gray-600 leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Symptoms Card */}
        {week && (() => {
          const symptoms = getSymptomsForWeek(week);
          return (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <button className="w-full" onClick={() => setShowSymptoms(s => !s)}>
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }} />
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: 'linear-gradient(135deg, #ede9fe, #fce7f3)' }}>🩺</div>
                    <div className="text-right">
                      <p className="font-black text-gray-800 text-sm">תסמינים לשבוע {week}</p>
                      <p className="text-xs text-purple-400">{symptoms.length} תסמינים נפוצים לשבוע זה</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-lg transition-transform" style={{ transform: showSymptoms ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
              </button>
              {showSymptoms && (
                <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                  {symptoms.map((s: { emoji: string; title: string; tip: string }, i: number) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)', border: '1px solid rgba(139,92,246,0.1)' }}>
                      <div className="text-2xl mb-1.5">{s.emoji}</div>
                      <p className="font-bold text-gray-700 text-xs mb-1">{s.title}</p>
                      <p className="text-xs text-purple-500 leading-relaxed">{s.tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Recipes Card */}
        {week && (() => {
          const trimesterKey = week <= 13 ? 'first' : week <= 26 ? 'second' : 'third';
          const recipes = RECIPES.filter(r => r.trimester.includes(trimesterKey));
          return (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}>
              <button className="w-full" onClick={() => setShowRecipes(r => !r)}>
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b)' }} />
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: 'linear-gradient(135deg, #fff7ed, #fef9c3)' }}>👩‍🍳</div>
                    <div className="text-right">
                      <p className="font-black text-gray-800 text-sm">מתכונים בטוחים</p>
                      <p className="text-xs text-orange-400">{recipes.length} מתכונים מומלצים לשבוע {week}</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-lg transition-transform" style={{ transform: showRecipes ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
              </button>
              {showRecipes && (
                <div className="px-4 pb-4 space-y-2">
                  {recipes.map((r, i) => (
                    <div key={i}>
                      <button className="w-full rounded-xl p-3 text-right transition-all"
                        style={{ background: selectedRecipe === i ? 'linear-gradient(135deg, #fff7ed, #fef3c7)' : '#fafafa', border: `1.5px solid ${selectedRecipe === i ? '#fed7aa' : '#f3f4f6'}` }}
                        onClick={() => setSelectedRecipe(selectedRecipe === i ? null : i)}>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{r.emoji}</span>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                            <p className="text-xs text-orange-400">⏱ {r.time} • {r.ingredients.length} מרכיבים</p>
                          </div>
                          <span className="text-gray-300 text-sm">{selectedRecipe === i ? '▴' : '▾'}</span>
                        </div>
                      </button>
                      {selectedRecipe === i && (
                        <div className="rounded-xl p-3 mt-1" style={{ background: 'linear-gradient(135deg, #fffbeb, #fff7ed)', border: '1px solid #fed7aa' }}>
                          <p className="text-xs font-bold text-orange-700 mb-2">🛒 מרכיבים:</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {r.ingredients.map((ing, j) => (
                              <span key={j} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'white', border: '1px solid #fed7aa', color: '#c2410c' }}>{ing}</span>
                            ))}
                          </div>
                          <p className="text-xs font-bold text-orange-700 mb-2">👩‍🍳 אופן הכנה:</p>
                          {r.steps.map((step, j) => (
                            <div key={j} className="flex gap-2 mb-1">
                              <span className="text-xs font-black text-orange-400 w-4 flex-shrink-0">{j + 1}.</span>
                              <p className="text-xs text-gray-600">{step}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

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
            {photoFallback && (
              <div className="rounded-2xl p-5 animate-fadein" style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🍽️</div>
                  <p className="font-black text-gray-800">צילמת מנה?</p>
                  <p className="text-sm text-gray-400 mt-1">לא זיהיתי טקסט בתמונה.<br/>כתבי מה האוכל ואבדוק בשבילך!</p>
                </div>
                <div className="relative mb-3">
                  <input type="text" value={photoQuery}
                    onChange={e => setPhotoQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && photoQuery.trim()) { handleSearch(photoQuery); setMode('search'); } }}
                    placeholder="למשל: סושי, עוף צלוי, גבינה..."
                    className="w-full rounded-xl px-4 py-3.5 text-right font-medium transition-all"
                    style={{ border: '2px solid #86efac', background: '#f0fdf4', fontSize: 15 }}
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => { if (photoQuery.trim()) { handleSearch(photoQuery); setMode('search'); } }}
                  className="w-full text-white font-black py-3.5 rounded-2xl text-base"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', boxShadow: '0 5px 18px rgba(34,197,94,0.35)' }}>
                  בדקי אם מותר בהריון ✓
                </button>
              </div>
            )}
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
