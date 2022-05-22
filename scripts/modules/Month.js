import Day from "./day.js";
import { isLeapYear } from "./functions.js";

export default class Month {
    constructor(date = null, lang = 'default') {
        const day = new Day(date, lang);
        const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.lang = lang;

        this.name = day.month;
        this.number = day.monthNumber;
        this.year = day.year;
        this.numberOfDays = monthsSize[this.number - 1];

        if (this.number === 2) {
            this.numberOfDays += isLeapYear(day.year) ? 1 : 0;
        }

        this[Symbol.iterator] = function* () {
            let number = 1;
            yield this.getDay(number);
            while (number < this.numberOfDays) {
                ++number;
                yield this.getDay(number);
            }
        };
    }

    getDay(date) {
        return new Day(new Date(this.year, this.number - 1, date), this.lang);
    }
}