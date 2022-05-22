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
    if (date.getMonth() + 1 === 2) {
        numberOfDays += isLeapYear(new Date().getFullYear()) ? 1 : 0;
    }

    return numberOfDays;
};

function isLeapYear(year) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

export { isLeapYear };
