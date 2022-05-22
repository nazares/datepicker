import Day from "./day.js";
import Month from "./month.js";

export default class Calendar {

    constructor(year = null, monthNumber = null, lang = 'default') {
        this.weekDays = Array.from({ length: 7 });
        this.today = new Day(null, lang);
        this.year = year ?? this.today.year;
        this.month = new Month(new Date(this.year, (monthNumber || this.today.monthNumber) - 1), lang);
        this.lang = lang;

        this[Symbol.iterator] = function* () {
            let number = 1;
            yield this.getMonth(number);
            while (number < 12) {
                ++number;
                yield this.getMonth(number);
            }
        };

        this.weekDays.forEach((_, i) => {
            const day = this.month.getDay(i + 1);
            if (!this.weekDays.includes(day.day)) {
                this.weekDays[day.dayNumber - 1] = day.day;
            }
        });
    }

    get isLeapYear() {
        return isLeapYear(this.year);
    }

    getMonth(monthNumber) {
        return new Month(new Date(this.year, monthNumber - 1), this.lang);
    }

    getPreviousMonth() {
        if (this.month.number === 1) {
            return new Month(new Date(this.year - 1, 11), this.lang);
        }

        return new Month(new Date(this.year, this.month.number - 2), this.lang);
    }

    getNextMonth() {
        if (this.month.number === 12) {
            return new Month(new Date(this.year + 1, 0), this.lang);
        }

        return new Month(new Date(this.year, this.month.number + 2), this.lang);
    }

    goToDate(monthNumber, year) {
        this.month = new Month(new Date(this.year, monthNumber - 1), this.lang);
        this.year = year;
    }

    goToday() {
        this.month = new Month(new Date(), this.lang);
        this.year = new Day().year;
    }

    goToNextYear() {
        this.year += 1;
        this.month = new Month(new Date(this.year, 0), this.lang);
    }

    goToPreviousYear() {
        this.year -= 1;
        this.month = new Month(new Date(this.year, 11), this.lang);
    }

    goToNextMonth() {
        if (this.month.number === 12) {
            return this.goToNextYear();
        }

        this.month = new Month(new Date(this.year, (this.month.number + 1) - 1), this.lang);
    }
    goToPreviousMonth() {
        if (this.month.number === 1) {
            return this.goToPreviousYear();
        }

        this.month = new Month(new Date(this.year, (this.month.number - 1) - 1), this.lang);
    }

}
