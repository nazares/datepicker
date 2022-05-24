Date.prototype.getISODay = function () { return (this.getDay() + 6) % 7 + 1; };
Date.prototype.dayOfYear = function () {
    let date = new Date(this);
    date.setMonth(0, 0);
    return Math.round((this - date) / 8.64e7);
};
Date.prototype.nth = function () { return ["st", "nd", "rd"][((this.getDate() + 90) % 100 - 10) % 10 - 1] || "th"; };
Date.prototype.weekNumber = function () {
    let date = new Date(this.valueOf());
    let dayn = (this.getDay() + 6) % 7;
    date.setDate(date.getDate() - dayn + 3);
    let firstThursday = date.valueOf();
    date.setMonth(0, 1);
    if (date.getDay() !== 4) {
        date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - date) / 60.48e7);
};
Date.prototype.dayOfYear = function () {
    let date = new Date(this);
    date.setMonth(0, 0);
    return Math.round((this - date) / 8.64e7);
};
Date.prototype.isLeap = function (year) { return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0; };
Date.prototype.daysInMonth = function () {
    const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let date = new Date(this);
    let year = new Date(this).getFullYear();
    let numberOfDays = monthsSize[date.getMonth()];
    if (date.getMonth() + 1 === 2) { numberOfDays += isLeapYear(new Date().getFullYear()) ? 1 : 0; }
    return numberOfDays;
};
function isLeapYear(year) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}
class Day {
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
    get isToday() { return this.isEqualTo(new Date()); }
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
            .replace(/\bjS\b/, this.date + this.suffix)
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
class Month {
    constructor(date = null, lang = 'default') {
        const day = new Day(date, lang);
        const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.lang = lang;
        this.name = day.month;
        this.number = day.monthNumber;
        this.year = day.year;
        this.numberOfDays = monthsSize[this.number - 1];
        if (this.number === 2) { this.numberOfDays += isLeapYear(day.year) ? 1 : 0; }
        this[Symbol.iterator] = function* () {
            let number = 1;
            yield this.getDay(number);
            while (number < this.numberOfDays) {
                ++number;
                yield this.getDay(number);
            }
        };
    }
    getDay(date) { return new Day(new Date(this.year, this.number - 1, date), this.lang); }
}
class Calendar {
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
class DatePicker extends HTMLElement {
    constructor() {
        super();
        this.format = 'F jS (D), Y';
        this.position = 'bottom';
        this.visible = false;
        this.date = null;
        this.mounted = false;
        this.toggleButton = null;
        this.input = null;
        this.todayButton = null;
        this.calendarDropDown = null;
        this.calendarDateElement = null;
        this.calendarDaysContainer = null;
        this.selectedDayElement = null;
        const lang = window.navigator.language;
        const date = new Date(this.date ?? (this.getAttribute("date") || Date.now()));
        this.shadow = this.attachShadow({ mode: "open" });
        this.date = new Day(date, lang);
        this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);
        this.format = this.getAttribute('format') || this.format;
        this.position = DatePicker.position.includes(this.getAttribute('position')) ?
            this.getAttribute('position') :
            this.position;
        this.visible = this.getAttribute('visible') === '' ||
            this.getAttribute('visible') === 'true' ||
            this.visible;
        this.render();
    }
    connectedCallback() {
        this.mounted = true;
        this.toggleButton = this.shadow.querySelector('.date-toggle');
        this.calendarDropDown = this.shadow.querySelector('.calendar-dropdown');
        // for PHP post method
        // this.input = document.querySelector("input[name=" + this.getAttribute('postname') + "]");
        // this.input.value = this.date.format('d-m-Y');
        this.todayButton = this.shadow.querySelector('.today-btn');
        const [prevButton, calendarDateElement, nextButton] = this.calendarDropDown
            .querySelector('.header').children;
        this.calendarDateElement = calendarDateElement;
        this.calendarDaysContainer = this.calendarDropDown.querySelector('.month-days');
        this.toggleButton.addEventListener('click', () => this.toggleCalendar());
        this.todayButton.addEventListener('click', () => this.goToday());
        prevButton.addEventListener('click', () => this.prevMonth());
        nextButton.addEventListener('click', () => this.nextMonth());
        document.addEventListener('click', (e) => this.handleClickOut(e));
        this.renderCalendarDays();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.mounted) return;
        switch (name) {
            case "date":
                this.date = new Day(new Date(newValue));
                this.calendar.goToDate(this.date.monthNumber, this.date.year);
                this.renderCalendarDays();
                this.updateToggleText();
                break;
            case "format":
                this.format = newValue;
                this.updateToggleText();
                break;
            case "visible":
                this.visible = ['', 'true', 'false'].includes(newValue) ?
                    newValue === '' || newValue === 'true' : this.visible;
                this.toggleCalendar(this.visible);
                break;
            case "position":
                this.position = DatePicker.position.includes(newValue) ?
                    newValue : this.position;
                this.calendarDropDown.className = `calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}`;
                break;
        }
    }
    toggleCalendar(visible = null) {
        if (visible === null) {
            this.calendarDropDown.classList.toggle('visible');
            this.toggleButton.classList.toggle('active');
        } else if (visible) {
            this.calendarDropDown.classList.add('visible');
            this.toggleButton.classList.add('active');
        } else {
            this.calendarDropDown.classList.remove('visible');
            this.toggleButton.classList.remove('active');
        }
        this.visible = this.calendarDropDown.className.includes('visible');
        if (!this.visible) {
            this.toggleButton.focus();
        }
    }
    prevMonth() {
        this.calendar.goToPreviousMonth();
        this.renderCalendarDays();
    }
    nextMonth() {
        this.calendar.goToNextMonth();
        this.renderCalendarDays();
    }
    goToday() {
        this.calendar.goToday();
        this.renderCalendarDays();
        this.selectDay(this.shadow.querySelector('.today'), new Day());
    }
    updateHeaderText() {
        this.calendarDateElement.textContent =
            `${this.calendar.month.name}, ${this.calendar.year}`;
        this.calendarDateElement.setAttribute('aria-label', `current month ${this.date.format(this.format)}`);
    }
    isSelectedDate(date) {
        return date.date === this.date.date &&
            date.monthNumber === this.date.monthNumber &&
            date.year === this.date.year;
    }
    isCurrentCalendarMonth() {
        return this.calendar.month.number === this.date.monthNumber &&
            this.calendar.year === this.date.year;
    }
    selectDay(el, day) {
        if (day.isEqualTo(this.date)) return;
        this.date = day;
        if (day.monthNumber !== this.calendar.month.number) {
            if (day.monthNumber < this.calendar.month.number) {
                this.prevMonth();
            }
            if (day.monthNumber > this.calendar.month.number) {
                this.nextMonth();
            }
        } else {
            el.classList.add('selected');
            this.selectedDayElement.classList.remove('selected');
            this.selectedDayElement = el;
        }
        this.toggleCalendar();
        this.updateToggleText();
    }
    handleClickOut(e) {
        if (this.visible && (this !== e.target)) {
            this.toggleCalendar(false);
            if (!this.isCurrentCalendarMonth()) {
                this.calendar.goToDate(this.date.monthNumber, this.date.year);
                this.renderCalendarDays();
            }
        }
    }
    getWeekDaysElementStrings() {
        return this.calendar.weekDays
            .map(weekDay => `<span>${weekDay.substring(0, 3)}</span>`)
            .join('');
    }
    getMonthDaysGrid() {
        const firstDayOfTheMonth = this.calendar.month.getDay(1);
        const lastDayOfTheMonth = this.calendar.month.getDay(this.calendar.month.numberOfDays);
        const lastDay = 7 - lastDayOfTheMonth.dayNumber;
        const prevMonth = this.calendar.getPreviousMonth();
        const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;
        const totalDays = this.calendar.month.numberOfDays + totalLastMonthFinalDays + lastDay;
        const monthList = Array.from({ length: totalDays });
        for (let i = totalLastMonthFinalDays; i < totalDays; i++) {
            monthList[i] = this.calendar.month.getDay(i + 1 - totalLastMonthFinalDays);
        }
        for (let i = 0; i < totalLastMonthFinalDays; i++) {
            const inverted = totalLastMonthFinalDays - (i + 1);
            monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted);
        }
        return monthList;
    }
    updateToggleText() {
        const date = this.date.format(this.format);
        this.toggleButton.textContent = date;
        // for PHP post method
        // this.input.value = this.date.format('d-m-Y');
    }
    updateMonthDays() {
        this.calendarDaysContainer.innerHTML = '';
        this.getMonthDaysGrid().forEach(day => {
            const el = document.createElement('button');
            el.className = "month-day";
            el.textContent = day.date;
            el.addEventListener('click', (e) => this.selectDay(el, day));
            el.setAttribute('aria-label', day.format(this.format));
            if (day.monthNumber === this.calendar.month.number) {
                el.classList.add("current");
            }
            if (this.isSelectedDate(day)) {
                el.classList.add('selected');
                this.selectedDayElement = el;
            }
            if (day.isEqualTo(new Day())) {
                el.classList.add('today');
            }
            if (day.dayNumber === 1 || day.dayNumber === 7) {
                el.classList.add('weekend');
            }
            this.calendarDaysContainer.appendChild(el);
        });
    }
    renderCalendarDays() {
        this.updateHeaderText();
        this.updateMonthDays();
        this.calendarDateElement.focus();
    }
    static get observedAttributes() {
        return ['date', 'format', 'visible', 'position'];
    }
    static get position() {
        return ['top', 'left', 'bottom', 'right'];
    }
    get style() {
        return `
        :host {
            position: relative;
            font-family: monospace;
        }
        .date-toggle {
            display:flex;
            justify-content: center;
            align-items: center;
            padding: 0 0 0 1rem;
            border: none;
            -webkit-appearance:none;
            -moz-appearance:none;
            appearance:none;
            background: #eee;
            color:#333;
            border-radius: 5px;
            border: 2px solid #000;
            font-weight: bold;
            cursor: pointer;
            text-transform: capitalize;
            font-family: 'Fira Code', monospace;
            vertical-align: middle;
        }
        .date-toggle::after {
            content: 'cal';
            display: inline-block;
            padding: .45rem .8rem;
            margin: 0 0 0 1rem;
            background: #000;
            color: #fff;
            border-color: #000c;
            border-left: 1px solid #000;
            font-size: .7rem;
        }
        .date-toggle.active::after {
            background: #f55;
            border-radius:  0 3px 3px 0;
        }
        .calendar-dropdown {
            display: none;
            height: 275px;
            position: absolute;
            top: 100%;
            left:50%;
            transform: translate(-50%, 8px);
            padding: 1rem;
            background: #fff;
            border-radius: 5px;
            border: 1px solid #eee;
            transition: all .5s ease-in-out;
            z-index: 9999;
        }
        .calendar-dropdown.top {
            top: auto;
            bottom: 100%;
            transform: translate(-50%, -8px);
        }
        .calendar-dropdown.left {
            top: 50%;
            left: 0;
            transform: translate(calc(-8px + -100%), -50%);
          }
          .calendar-dropdown.right {
            top: 50%;
            left: 100%;
            transform: translate(8px, -50%);
          }
        .today-btn {
            position: absolute;
            bottom: .5rem;
            width: calc(100% - 2rem);
            text-align: center;
            cursor: pointer;
        }
        .calendar-dropdown.visible {
            display: block;
            opacity: 1;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0 10px;
        }
        .header h4 {
            margin: 0;
            text-transform: capitalize;
            font-size: 1rem;
            font-weight: bold;
        }
        .header button {
            padding: 0;
            border: 8px solid transparent;
            width: 0;
            height: 0;
            border-radius: 2px;
            border-top-color: #555;
            transform:rotate(90deg);
            cursor: pointer;
            background: none;
            position: relative;
        }
        .header button::after {
            content: '';
            display: block;
            width:25px;
            height:25px;
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%, -50%);
            // background: red;
        }
        .header button:last-of-type {
            transform:rotate(-90deg);
        }
        .week-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            margin-bottom: 5px;
            -webkit-user-select: none;
            cursor: default;
        }
        .week-days span{
            display: flex;
            justify-content: center;
            font-size: 10px;
            text-transform: capitalize;
        }
        .week-days span:first-child {
            color: red;
        }
        .week-days span:last-child {
            color: red;
        }
        .month-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 5px;
        }
        .month-day {
            border: none;
            background: #eee;
            opacity: 0.3;
            font-family: 'Fira Code', monospace;
            // font-size: .55rem;
            padding: 5px 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            cursor:pointer;
        }
        .month-day.current {
            display: flex;
            opacity: 1;
            border: 1px solid #0002;
        }
        .month-day.weekend {
            color: #f55;
        }
        .month-day.today {
            background: #f55;
            border: 1px solid #000;
            color: #000;
        }
        .month-day.selected {
            background: #9f9;
            border-color: #0008;
            color: #000;
        }
        .month-day:hover {
            background: #000a;
            color: #fff;
        }
        `;
    }
    render() {
        const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`;
        const date = this.date.format(this.format);
        this.shadow.innerHTML = `
        <style>${this.style}</style>
        <div class="date-p">
            <button type="button" class="date-toggle">${date}</button>
        </div>
        <div class="calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}">
            <div class="header">
                <button type="button" class="prev-month" aria-label="previous month"></button>
                <h4 tabindex="0" aria-label="current month ${monthYear}">
                    ${monthYear}
                </h4>
                <button type="button" class="prev-month" aria-label="next month"></button>
            </div>
            <div class="week-days">${this.getWeekDaysElementStrings()}</div>
            <div class="month-days"></div>
            <div class="today-btn">Today</div>
        </div>
        `;
    }
}
