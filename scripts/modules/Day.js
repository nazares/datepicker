export default class Day {
    constructor(date = null, lang = 'default') {
        date = date ?? new Date();
        this.Date = date;
        this.date = date.getDate();
        this.day = date.toLocaleString(lang, { weekday: 'long' });
        this.dayNumber = date.getDay() + 1;
        this.dayShort = date.toLocaleString(lang, { weekday: 'short' });
        this.year = date.getFullYear();
        this.yearShort = date.toLocaleString(lang, { year: '2-digit' });
        this.month = date.toLocaleString(lang, { month: 'long' });
        this.monthShort = date.toLocaleString(lang, { month: 'short' });
        this.monthNumber = date.getMonth() + 1;
        this.timestamp = date.getTime();
        this.weekNumber = date.weekNumber();
        this.ISODay = date.getISODay();
        this.suffix = date.nth();
        this.dOY = date.dayOfYear();
        this.leap = date.isLeap(this.year);
        this.dIM = date.daysInMonth();
    }

    get isToday() {
        return this.isEqualTo(new Date());
    }

    isEqualTo(date) {
        date = date instanceof Day ? date.Date : date;

        return date.getDate() === this.date &&
            date.getMonth() === this.monthNumber - 1 &&
            date.getFullYear() === this.year;
    }

    format(formatStr) {
        return formatStr
            // Day ---
            .replace(/\bd\b/, this.date.toString().padStart(2, 0))
            .replace(/\bD\b/, this.dayShort)
            .replace(/\bj\b/, this.date)
            .replace(/\bl\b/, this.day)
            .replace(/\bN\b/, this.ISODay)
            .replace(/\bS\b/, this.suffix)
            .replace(/\bw\b/, this.dayNumber - 1)
            .replace(/\bz\b/, this.dOY - 1)
            // Week ---
            .replace(/\bW\b/, this.weekNumber)
            // Month ---
            .replace(/\bF\b/, this.month)
            .replace(/\bm\b/, this.monthNumber.toString().padStart(2, '0'))
            .replace(/\bM\b/, this.monthShort)
            .replace(/\bn\b/, this.monthNumber)
            .replace(/\bt\b/, this.dIM)
            // Year ---
            .replace(/\bL\b/, this.leap)
            .replace(/\bY\b/, this.year)
            .replace(/\by\b/, this.yearShort);
    }
}
