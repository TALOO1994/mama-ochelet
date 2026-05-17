export type FoodStatus = 'allowed' | 'forbidden' | 'caution';

export interface FoodItem {
  name: string;
  aliases: string[];
  status: FoodStatus;
  reason: string;
  recommendation: string;
}

export const foodDatabase: FoodItem[] = [
  // ===== אסור =====
  { name: 'סושי', aliases: ['סשימי', 'מקי', 'ניגירי', 'דג נא', 'uramaki'], status: 'forbidden', reason: 'דגים נאים עלולים להכיל טפילים ובקטריות מסוכנות', recommendation: 'הימנעי לחלוטין. ניתן לאכול סושי עם ירקות או דג מבושל.' },
  { name: 'דג חרב', aliases: ['חרב', 'swordfish', 'כריש', 'טונה לבנה', 'דג מלך'], status: 'forbidden', reason: 'מכיל רמות גבוהות של כספית המסוכנת לעובר', recommendation: 'הימנעי לחלוטין. החליפי בסלמון מבושל.' },
  { name: 'בשר נא', aliases: ['סטייק טר טר', 'קרפצ\'יו', 'בשר לא מבושל', 'מדיום רייר'], status: 'forbidden', reason: 'עלול להכיל טוקסופלסמה וסלמונלה', recommendation: 'כל הבשרים חייבים להיות מבושלים היטב (well done).' },
  { name: 'ביצה נאה', aliases: ['ביצה רכה', 'עין רכה', 'מיונז ביתי', 'קרם ביצים', 'ביצה חצי מבושלת'], status: 'forbidden', reason: 'עלול להכיל סלמונלה', recommendation: 'הקפידי על ביצים מבושלות היטב. מיונז תעשייתי בסדר.' },
  { name: 'גבינה רכה לא מפוסטרת', aliases: ['brie', 'camembert', 'ברי', 'קממבר', 'רוקפור', 'גורגונזולה', 'גבינה כחולה'], status: 'forbidden', reason: 'עלולה להכיל ליסטריה', recommendation: 'הימנעי. בחרי גבינות קשות מפוסטרות כמו צ\'דר או אמנטל.' },
  { name: 'אלכוהול', aliases: ['יין', 'בירה', 'וויסקי', 'וודקה', 'קוקטייל', 'שמפניה', 'ליקר'], status: 'forbidden', reason: 'אין כמות בטוחה של אלכוהול בהריון', recommendation: 'הימנעי לחלוטין מכל משקה אלכוהולי.' },
  { name: 'כבד', aliases: ['פטה', 'כבד עוף', 'כבד אווז', 'פואה גרא', 'כבד בקר'], status: 'forbidden', reason: 'מכיל כמויות גבוהות מאוד של ויטמין A שעלול לפגוע בעובר', recommendation: 'הימנעי לחלוטין. ברזל ניתן לקבל מבשר בקר רזה ועדשים.' },
  { name: 'דג מעושן', aliases: ['סלמון מעושן קר', 'לוקוס'], status: 'forbidden', reason: 'עשן קר לא מבטל חיידקים', recommendation: 'הימנעי מדגים מעושנים קרים. סלמון מבושל - מותר.' },

  // ===== בזהירות =====
  { name: 'קפה', aliases: ['אספרסו', 'קפוצ\'ינו', 'לאטה', 'אמריקנו', 'נס קפה', 'קפה שחור', 'קפה קר'], status: 'caution', reason: 'קפאין עלול להשפיע על קצב לב העובר', recommendation: 'עד 200 מ"ג קפאין ביום - כוס אחת קטנה. הימנעי מכמויות גדולות.' },
  { name: 'טונה', aliases: ['סטייק טונה', 'טונה בפחית', 'טונה קפואה'], status: 'caution', reason: 'מכילה כספית ברמה בינונית', recommendation: 'עד 2 פחיות קטנות בשבוע. עדיפי טונה בפחיות.' },
  { name: 'נקניקיות', aliases: ['נקניק', 'סלמי', 'פרושוטו', 'בייקון', 'בולונה', 'נקניקייה', 'הוט דוג'], status: 'caution', reason: 'עלול להכיל ליסטריה, גבוה בנתרן', recommendation: 'חממי היטב לפני אכילה. עדיפי בשר טרי מבושל.' },
  { name: 'שוקולד', aliases: ['שוקולד מריר', 'שוקולד חלב', 'שוקולד לבן', 'קקאו', 'פרלין'], status: 'caution', reason: 'מכיל קפאין וסוכר', recommendation: 'מותר בכמות קטנה. שוקולד מריר עדיף. אל תגזלי.' },
  { name: 'גלידה', aliases: ['גלידה בכדור', 'ארטיק', 'שייק גלידה', 'סורבה'], status: 'caution', reason: 'גלידה תעשייתית בטוחה. גלידה ביתית עם ביצה נאה - אסורה', recommendation: 'גלידה תעשייתית מותרת בכמות. הימנעי מגלידה ביתית עם ביצים.' },
  { name: 'תה', aliases: ['תה ירוק', 'תה שחור', 'תה צמחים', 'חליטה', 'תה מנטה'], status: 'caution', reason: 'חלק מתה הצמחים עלולים להיות לא בטוחים', recommendation: 'תה ירוק ושחור - עד 2 כוסות ביום. הימנעי מריחן, מרווה, שמיר.' },
  { name: 'חמוצים', aliases: ['מלפפון חמוץ', 'כרוב כבוש', 'זית', 'חמוציות'], status: 'caution', reason: 'מכילים הרבה נתרן', recommendation: 'מותר בכמות קטנה. הימנעי מכמויות גדולות.' },

  // ===== מותר ומומלץ =====
  { name: 'סלמון', aliases: ['פילה סלמון', 'סלמון מבושל', 'סלמון אפוי', 'סלמון מטוגן'], status: 'allowed', reason: 'עשיר באומגה 3 החיונית להתפתחות מוח העובר', recommendation: 'מומלץ מאוד! 2-3 פעמים בשבוע. חשוב שיהיה מבושל היטב.' },
  { name: 'עוף', aliases: ['חזה עוף', 'שוק עוף', 'פרגית', 'כנפיים', 'שניצל עוף', 'עוף בגריל', 'עוף מבושל'], status: 'allowed', reason: 'חלבון איכותי, ברזל וויטמיני B', recommendation: 'מומלץ! מקור חלבון מעולה. הקפידי שיהיה מבושל היטב.' },
  { name: 'בקר', aliases: ['המבורגר', 'שניצל בקר', 'אנטריקוט', 'פילה בקר', 'סטייק', 'צלי', 'בולגרית', 'עגל', 'בשר עגל', 'שניצל עגל', 'הודו', 'הודו טחון', 'שייטל', 'אסאדו', 'ריב איי', 'סינטה'], status: 'allowed', reason: 'מקור מצוין לברזל וחלבון', recommendation: 'מומלץ! חשוב שיהיה well done. מקור ברזל מעולה.' },
  { name: 'ביצה מבושלת', aliases: ['ביצה קשה', 'חביתה', 'ביצה מקושקשת', 'שקשוקה', 'ביצה עין'], status: 'allowed', reason: 'עשירה בחלבון וכולין החשוב לפיתוח מוח העובר', recommendation: 'מומלץ מאוד! עד ביצה אחת ביום. חשוב שתהיה מבושלת היטב.' },
  { name: 'אבוקדו', aliases: ['גואקמולה', 'אבוקדו טוסט'], status: 'allowed', reason: 'עשיר בחומצה פולית, אשלגן ושומנים בריאים', recommendation: 'מומלץ מאוד! מצוין בסלטים, על לחם, כגואקמולה.' },
  { name: 'בננה', aliases: ['בננות', 'שייק בננה'], status: 'allowed', reason: 'עשירה באשלגן, ויטמין B6 ועוזרת בבחילות בוקר', recommendation: 'מומלץ מאוד! מעולה נגד בחילות. קלה לעיכול.' },
  { name: 'תפוח', aliases: ['תפוח עץ', 'תפוחים', 'מיץ תפוחים'], status: 'allowed', reason: 'עשיר בסיבים ורכיבים חיוניים', recommendation: 'מומלץ! נשנוש מצוין ובריא.' },
  { name: 'גזר', aliases: ['מיץ גזר', 'גזרים', 'גזר מגורר'], status: 'allowed', reason: 'עשיר בבטא קרוטן וויטמין A הצמחי (בטוח)', recommendation: 'מומלץ מאוד! מצוין כנשנוש או בסלט.' },
  { name: 'ברוקולי', aliases: ['כרובית', 'כרוב ניצנים', 'ברוקולי מאודה'], status: 'allowed', reason: 'עשיר בחומצה פולית, ברזל, סידן וסיבים', recommendation: 'מומלץ מאוד! אחד הירקות הטובים ביותר בהריון.' },
  { name: 'עדשים', aliases: ['עדשים כתומות', 'עדשים ירוקות', 'מרק עדשים', 'עדשים שחורות'], status: 'allowed', reason: 'עשירות בחומצה פולית, חלבון וברזל', recommendation: 'מומלץ מאוד! מצוין למרקים ותבשילים.' },
  { name: 'חומוס', aliases: ['חומוס עם פיתה', 'טחינה', 'חומוס ביתי', 'חומוס מפעל'], status: 'allowed', reason: 'עשיר בחלבון, ברזל וחומצה פולית', recommendation: 'מומלץ מאוד! מקור מצוין לברזל צמחי.' },
  { name: 'אורז', aliases: ['אורז לבן', 'אורז מלא', 'אורז בסמטי', 'עם אורז'], status: 'allowed', reason: 'פחמימה קלה לעיכול, מצוינת נגד בחילות', recommendation: 'מומלץ! מצוין כתוספת, במיוחד בשליש הראשון.' },
  { name: 'פסטה', aliases: ['ספגטי', 'פנה', 'פוסילי', 'לזניה', 'ריזוטו', 'פסטה ברוטב'], status: 'allowed', reason: 'פחמימה קלה לעיכול ומספקת אנרגיה', recommendation: 'מותר! עדיפי פסטה מלאה.' },
  { name: 'לחם', aliases: ['לחם שיפון', 'לחם מלא', 'פיתה', 'בגט', 'חלה', 'טוסט'], status: 'allowed', reason: 'פחמימה חיונית לאנרגיה', recommendation: 'מותר! עדיפי לחם מלא.' },
  { name: 'חלב', aliases: ['חלב רגיל', 'חלב דל שומן', 'חלב 3%', 'חלב 1%', 'חלב מפוסטר'], status: 'allowed', reason: 'מקור מצוין לסידן וויטמין D', recommendation: 'מומלץ! 2-3 כוסות ביום. עדיפי חלב מפוסטר.' },
  { name: 'יוגורט', aliases: ['יוגורט טבעי', 'לבן', 'פרוביוטי', 'יוגורט פירות'], status: 'allowed', reason: 'עשיר בסידן וחלבון, הפרוביוטיקה מועילה', recommendation: 'מומלץ מאוד! מצוין לבוקר עם פירות.' },
  { name: 'גבינה צהובה', aliases: ['גבינה קשה', 'צ\'דר', 'אמנטל', 'גאודה', 'פרמזן', 'מוצרלה'], status: 'allowed', reason: 'גבינות קשות מפוסטרות בטוחות ומספקות סידן', recommendation: 'מומלץ! מקור מצוין לסידן. אכלי בכמות סבירה.' },
  { name: 'גבינת קוטג\'', aliases: ['קוטג', 'גבינה לבנה', 'ריקוטה'], status: 'allowed', reason: 'גבינה מפוסטרת, בטוחה ובריאה', recommendation: 'מומלץ! עשיר בחלבון וסידן.' },
  { name: 'תות', aliases: ['תותים', 'תות שדה', 'תות יער'], status: 'allowed', reason: 'עשיר בויטמין C וחומצה פולית', recommendation: 'מומלץ מאוד! שטפי היטב לפני אכילה.' },
  { name: 'מנגו', aliases: ['מנגואים', 'מנגו טרי', 'מנגו קפוא'], status: 'allowed', reason: 'עשיר בויטמין C, A וחומצה פולית', recommendation: 'מומלץ! עשיר בויטמינים חיוניים.' },
  { name: 'אגוזים', aliases: ['אגוזי מלך', 'שקדים', 'קשיו', 'פיסטוק', 'אגוזי ברזיל', 'בוטנים'], status: 'allowed', reason: 'עשירים בחומצות שומן אומגה 3 וויטמין E', recommendation: 'מומלץ! חופן קטן ביום. שימי לב לאלרגיות.' },
  { name: 'שיבולת שועל', aliases: ['אוטמיל', 'גרנולה', 'מוסלי', 'דייסת שיבולת שועל'], status: 'allowed', reason: 'עשיר בסיבים, ברזל ופחמימות מורכבות', recommendation: 'מומלץ מאוד! ארוחת בוקר מצוינת.' },
  { name: 'מיץ תפוזים', aliases: ['תפוז', 'מנדרינה', 'מיץ טבעי', 'מיץ הדרים'], status: 'allowed', reason: 'עשיר בויטמין C ועוזר לספיגת ברזל', recommendation: 'מומלץ! כוס אחת ביום. עדיפי מיץ טרי.' },
  { name: 'מים', aliases: ['מים מינרלים', 'מים מסוננים', 'מים קרים'], status: 'allowed', reason: 'חיוני לכל תפקודי הגוף ומניעת התייבשות', recommendation: 'מומלץ מאוד! 8-10 כוסות ביום לפחות.' },
  { name: 'פיצה', aliases: ['פיצה מרגריטה', 'פיצה גבינה', 'פיצה ירקות', 'פיצה הוואי'], status: 'allowed', reason: 'בסיסית מגבינה מפוסטרת ועגבניות - בטוח', recommendation: 'מותר! עדיפי עם ירקות. הימנעי מטופינג של בשר נא.' },
  { name: 'המבורגר', aliases: ['בורגר', 'צ\'יזבורגר', 'מקדונלד', 'בורגר קינג'], status: 'allowed', reason: 'בשר מבושל + לחם + ירקות', recommendation: 'מותר! ודאי שהבשר well done. הימנעי ממיונז ביתי.' },
  { name: 'פלאפל', aliases: ['פיתה עם פלאפל', 'פלאפל בפיתה', 'כדורי פלאפל'], status: 'allowed', reason: 'קטניות מטוגנות - מקור טוב לחלבון צמחי', recommendation: 'מותר! מקור טוב לחלבון. עם הרבה ירקות.' },
  { name: 'סלט', aliases: ['סלט ירקות', 'סלט ישראלי', 'סלט ירוק', 'סלט יווני'], status: 'allowed', reason: 'ירקות טריים מספקים ויטמינים וסיבים', recommendation: 'מומלץ מאוד! שטפי היטב. הימנעי מרטב עם ביצה נאה.' },
  { name: 'שניצל', aliases: ['שניצל מטוגן', 'נאגטס', 'שניצל אפוי'], status: 'allowed', reason: 'בשר מבושל בציפוי - בטוח', recommendation: 'מותר! ודאי שמבושל היטב.' },
  { name: 'טחינה', aliases: ['טחינה גולמית', 'סלט טחינה', 'טחינה מלאה'], status: 'allowed', reason: 'עשירה בסידן, ברזל ושומנים בריאים', recommendation: 'מומלץ! מקור סידן וברזל מצוין לצמחוניות.' },
  { name: 'ירקות מאודים', aliases: ['ירקות מבושלים', 'ירקות בגריל', 'מחבת ירקות'], status: 'allowed', reason: 'ירקות מבושלים בטוחים ומלאי ויטמינים', recommendation: 'מומלץ מאוד! בישול משמר רכיבי תזונה חשובים.' },

  // ===== מאכלים ישראליים נפוצים =====
  { name: 'שווארמה', aliases: ['שוורמה', 'שוורמה עוף', 'שווארמה טלה', 'שוורמה בפיתה', 'שווארמה בלחמנייה'], status: 'allowed', reason: 'בשר מבושל בטמפרטורה גבוהה - בטוח לאכילה', recommendation: 'מותר! ודאי שהבשר חם וטרי. הימנעי משווארמה שעמדה זמן רב.' },
  { name: 'שיפוד', aliases: ['שיפודים', 'שיפוד עוף', 'שיפוד בקר', 'שיפוד כבש', 'גריל', 'מנגל', 'קבב', 'מנגל מעורב'], status: 'allowed', reason: 'בשר צלוי על גחלים - בשר מבושל היטב', recommendation: 'מותר! ודאי שהבשר מבושל היטב ולא ורוד מבפנים.' },
  { name: 'קבב', aliases: ['קבב עוף', 'קבב בקר', 'קבב טלה', 'קבאב'], status: 'allowed', reason: 'בשר טחון מבושל - בטוח כשמבושל היטב', recommendation: 'מותר! ודאי שהקבב מבושל לחלוטין (לא ורוד). בקשי well done.' },
  { name: 'פיתה', aliases: ['פיתה טרייה', 'לחמנייה', 'לאפה', 'פיתה לאפה'], status: 'allowed', reason: 'לחם מאפה - פחמימה בטוחה', recommendation: 'מותר! עדיפי פיתה טרייה.' },
  { name: 'סלט ירקות', aliases: ['סלט ישראלי', 'סלט קצוץ', 'סלט עגבניות מלפפון', 'סלט ערבי'], status: 'allowed', reason: 'ירקות טריים עשירים בויטמינים', recommendation: 'מומלץ! ודאי ששטפו היטב. הימנעי מרטב עם ביצה נאה.' },
  { name: 'חצילים', aliases: ['סלט חצילים', 'חציל צלוי', 'מטבוחה', 'חציל בטחינה', 'בבא גנוש'], status: 'allowed', reason: 'ירק מבושל עשיר בנוגדי חמצון', recommendation: 'מומלץ! מצוין כתוספת.' },
  { name: 'סלסה', aliases: ['רוטב עגבניות', 'סלסה חריפה', 'חריף'], status: 'caution', reason: 'מזון חריף עלול לגרום לצרבת', recommendation: 'מותר בכמות קטנה. אם סובלת מצרבת - הימנעי.' },
  { name: 'רוטב שום', aliases: ['שום', 'ציזיקי', 'דיפ שום'], status: 'allowed', reason: 'שום מבושל או רוטב שום מפוסטר - בטוח', recommendation: 'מותר! שום טרי מאוד - עלול לגרום לצרבת, אכלי בכמות.' },
  { name: 'כבש', aliases: ['בשר כבש', 'טלה', 'עמבה', 'שיפוד כבש'], status: 'allowed', reason: 'בשר כבש מבושל היטב - בטוח ועשיר בברזל', recommendation: 'מותר! ודאי שמבושל היטב. מקור טוב לברזל.' },
  { name: 'צ\'יפס', aliases: ['תפוח אדמה מטוגן', 'פריז', 'ספיישל', 'תפוחי אדמה'], status: 'caution', reason: 'מטוגן עמוק - קלורי ועשיר בשומן', recommendation: 'מותר מדי פעם. הימנעי מכמויות גדולות.' },
  { name: 'עגבנייה', aliases: ['עגבניות', 'עגבניה שרי', 'עגבנייה טרייה'], status: 'allowed', reason: 'ירק עשיר בויטמין C וליקופן', recommendation: 'מומלץ! שטפי היטב לפני אכילה.' },
  { name: 'מלפפון', aliases: ['מלפפונים', 'מלפפון טרי'], status: 'allowed', reason: 'ירק קל לעיכול ומרענן', recommendation: 'מומלץ! שטפי היטב לפני אכילה.' },
  { name: 'פטרוזיליה', aliases: ['פטרוזליה', 'ירוקים', 'עשבי תיבול'], status: 'allowed', reason: 'עשבי תיבול עשירים בויטמין K וברזל', recommendation: 'מותר! בכמות סבירה. הימנעי מכמויות ענקיות.' },
  { name: 'כרוב', aliases: ['כרוב לבן', 'כרוב סגול', 'קולסלו', 'כרוב קצוץ'], status: 'allowed', reason: 'ירק עשיר בסיבים וויטמין C', recommendation: 'מותר! עלול לגרום לגזים - אכלי בכמות.' },
  { name: 'מנה ראשונה', aliases: ['מרק', 'מרק עוף', 'מרק ירקות', 'מרק עדשים', 'מרק בצל'], status: 'allowed', reason: 'מרקים מבושלים בטוחים ומזינים', recommendation: 'מומלץ! מרק עוף ביתי מצוין בהריון.' },
  { name: 'המבורגר', aliases: ['בורגר', 'צ\'יזבורגר', 'סמאש בורגר', 'ביף בורגר'], status: 'allowed', reason: 'בשר מבושל + לחם', recommendation: 'מותר! ודאי שהבשר well done. הימנעי ממיונז ביתי.' },
  { name: 'דג מטוגן', aliases: ['פישנצ\'יפס', 'דג בציפוי', 'פילה דג מטוגן', 'דג בגריל'], status: 'allowed', reason: 'דג מבושל היטב - מקור חלבון ואומגה 3', recommendation: 'מומלץ! ודאי שמבושל היטב. הימנעי מדגים עם כספית גבוהה.' },
  { name: 'לאגמן', aliases: ['אטריות', 'noodles', 'פו', 'ראמן'], status: 'allowed', reason: 'אטריות מבושלות - פחמימה קלה לעיכול', recommendation: 'מותר! שימי לב למרק - ודאי שהוא מבושל היטב.' },
  { name: 'עוגה', aliases: ['קינוח', 'עוגת שוקולד', 'מאפה מתוק', 'בראוניז', 'עוגיות'], status: 'caution', reason: 'עשיר בסוכר ושומן', recommendation: 'מותר מדי פעם. שימי לב לעוגות עם ביצים נאות (כמו מוס שוקולד).' },
  { name: 'גבינת עיזים', aliases: ['לבנה', 'לאבנה', 'גבינה ערבית'], status: 'caution', reason: 'תלוי אם מפוסטרת - לבנה תעשייתית בסדר', recommendation: 'לבנה תעשייתית מפוסטרת - מותר. גבינת עיזים לא מפוסטרת - הימנעי.' },

  // ===== משקאות נפוצים =====
  { name: 'קוקה קולה', aliases: ['קולה', 'דיאט קולה', 'זירו', 'פפסי', 'דיאט פפסי', 'סודה', 'משקה מוגז'], status: 'caution', reason: 'מכילה קפאין וסוכר רב, מוגזת עלולה לגרום לנפיחות', recommendation: 'מותר מדי פעם בכמות קטנה. עדיפי מים או מיץ טבעי.' },
  { name: 'מיץ תפוזים', aliases: ['מיץ תפוח', 'מיץ גזר', 'מיץ ענבים', 'מיץ אשכולית', 'מיץ טרי', 'מיץ פירות'], status: 'allowed', reason: 'עשיר בויטמין C ועוזר לספיגת ברזל', recommendation: 'מומלץ! כוס אחת ביום. עדיפי מיץ טרי ללא סוכר.' },
  { name: 'מי סודה', aliases: ['סודה', 'מים מוגזים', 'מינרל', 'ספרייט', 'פנטה', '7up'], status: 'caution', reason: 'מוגז עלול לגרום לנפיחות וגזים', recommendation: 'מותר בכמות קטנה. עדיפי מים רגילים.' },
  { name: 'לימונדה', aliases: ['לימון', 'לימוניאדה', 'מיץ לימון', 'ליים', 'משקה לימון'], status: 'allowed', reason: 'ויטמין C ורענן, יכול לעזור בבחילות', recommendation: 'מומלץ! לימון טרי מצוין נגד בחילות בוקר.' },
  { name: 'שייק', aliases: ['שייק פירות', 'שייק חלב', 'שייק בננה', 'סמות\'י', 'סמוזי'], status: 'allowed', reason: 'שייק עם פירות וחלב - ערכי תזונה גבוהים', recommendation: 'מומלץ! מצוין לארוחת בוקר. ודאי שהחלב מפוסטר.' },
  { name: 'מיצים טבעיים', aliases: ['מיץ סחוט', 'מיץ קר', 'cold press', 'קולד פרס'], status: 'allowed', reason: 'עשיר בויטמינים ומינרלים', recommendation: 'מומלץ! ויטמינים חיוניים להריון.' },
  { name: 'בירה', aliases: ['בירה קלה', 'בירה שחורה', 'בירה חוצות', 'גולדסטאר', 'מכבי', 'טובורג'], status: 'forbidden', reason: 'אלכוהול אסור לחלוטין בהריון', recommendation: 'הימנעי לחלוטין מכל משקה אלכוהולי בהריון.' },
  { name: 'יין', aliases: ['יין אדום', 'יין לבן', 'יין רוזה', 'רוזה', 'שמפניה', 'פרוסקו', 'קוואלי'], status: 'forbidden', reason: 'אלכוהול אסור לחלוטין בהריון', recommendation: 'הימנעי לחלוטין מכל משקה אלכוהולי בהריון.' },
  { name: 'קפה קר', aliases: ['אייס קפה', 'פרפה', 'קפה עם קרח', 'ice coffee', 'פראפה'], status: 'caution', reason: 'מכיל קפאין - מותר עד 200 מ"ג ביום', recommendation: 'מותר עד כוס אחת ביום. שימי לב לכמות הקפאין.' },
  { name: 'מיץ עגבניות', aliases: ['מיץ ירקות', 'V8', 'עגבניה שתייה'], status: 'allowed', reason: 'עשיר בליקופן, ויטמין C וחומצה פולית', recommendation: 'מומלץ! מקור ויטמינים מצוין.' },
];

export function searchFood(query: string): FoodItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const scored: { item: FoodItem; score: number }[] = [];

  for (const item of foodDatabase) {
    let score = 0;
    const name = item.name.toLowerCase();

    // Exact name match - highest score
    if (name === normalizedQuery) { score = 100; }
    // Query contains full name (e.g. "שניצל ירושלמי" contains "שניצל")
    else if (normalizedQuery.includes(name)) { score = 80; }
    // Name contains query
    else if (name.includes(normalizedQuery)) { score = 70; }

    // Check aliases
    for (const alias of item.aliases) {
      const a = alias.toLowerCase();
      if (normalizedQuery === a) { score = Math.max(score, 90); }
      else if (normalizedQuery.includes(a)) { score = Math.max(score, 75); }
      else if (a.includes(normalizedQuery)) { score = Math.max(score, 65); }
    }

    // Partial word match - only for words 3+ chars to avoid false positives
    if (score === 0) {
      const queryWords = normalizedQuery.split(/\s+/);
      for (const word of queryWords) {
        if (word.length < 3) continue; // ignore very short words like "תה"
        if (name.includes(word)) { score = Math.max(score, 50); }
        for (const alias of item.aliases) {
          if (alias.toLowerCase().includes(word)) { score = Math.max(score, 45); }
        }
      }
    }

    // Minimum score of 45 to avoid weak false-positive matches
    if (score >= 45) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.item);
}

// For menu analysis: finds best single match for a menu item description
// For compound names like "עגל בלאפה", tries each word so the main ingredient wins
export function findBestMatch(menuItemText: string): FoodItem | null {
  const results = searchFood(menuItemText);
  if (results.length > 0) return results[0];

  // Fallback: try each word, first significant word wins
  const words = menuItemText.split(/[\s,\-\/]+/).filter(w => w.length >= 3);
  for (const word of words) {
    const wordResults = searchFood(word);
    if (wordResults.length > 0) return wordResults[0];
  }
  return null;
}

export function getStatusLabel(status: FoodStatus): string {
  switch (status) {
    case 'allowed': return 'מותר';
    case 'forbidden': return 'אסור';
    case 'caution': return 'בזהירות';
  }
}

export function getStatusEmoji(status: FoodStatus): string {
  switch (status) {
    case 'allowed': return '✅';
    case 'forbidden': return '❌';
    case 'caution': return '⚠️';
  }
}
