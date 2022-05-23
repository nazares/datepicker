# Multilingual Datepicker VanullaJS Webcomponent

## Usage

```html
<head>
    <script defer src="/scripts/dist/datepicker.min.js"></script>
</head>
<body>
    <date-picker format="F d (D), Y" date="2022-22-05" position="top" visible="false"></date-picker>
</body>
```

> if you want to set up default format or current date just leave that attributes empty.

### The following characters are recognized in the format parameter string

| Format | Description| Example returned values |
|--|--|--|
| Day --- |
| d | Day of the month, 2 digits with leading zeros | 01 to 31|
| D | A textual representation of a day, three letters | Mon through Sun |
| j | Day of the month without leading zeros | 1 to 31 |
| l (lowercase 'L') | A full textual representation of the day of the week | Sunday through Saturday |
| N | ISO 8601 numeric representation of the day of the week | 1 (for Monday) through 7 (for Sunday) |
| S | English ordinal suffix for the day of the month, 2 characters | st, nd, rd or th. Works well with j |
| w | Numeric representation of the day of the week | 0 (for Sunday) through 6 (for Saturday) |
| z | The day of the year (starting from 0) | 0 trough 365 |
| Week --- |
| W | ISO 8601 week number of year, weeks starting on Monday | Example: 20 (the 20th week in the year)
| Month --- |
| F | A full textual representation of a month, such as January or March | January through December |
| m | Numeric representation of a month, with leading zeros | 01 through 12 |
| M | A short textual representation of a month, three letters | Jan through Dec |
| n | Numeric representation of a month, without leading zeros | 1 through 12 |
| t | Number of days in the given month | 28 through 31 |
| Year --- |
| L | Whether it's a leap year | `true` if it is a leap year, `false` otherwise. |
| Y | A full numeric representarion of a year | Examples: 1800 or 2022 |
| y | A two digit representation of a year | Examples: 93 or 22 |

#### examples

```html
<date-picker format="F d (D), Y" date="2021-12-05" position="top" visible="false"></date-picker>
<date-picker format="Y/m/d" date="" position="top" visible="false"></date-picker>
<date-picker format="l jS F Y" date="" position="top" visible="false"></date-picker>
```

![screenshot](/example/Screenshot%202022-05-22%20at%2010.57.29%20PM.png)

The language based on system locale.
`const lang = window.navigator.language;`

![screenshot](/example/Screenshot%202022-05-22%20at%2011.14.52%20PM.png)

Positioning __by default__: `potition = "bottom"`:

`<date-picker position="top"></date-picker>`
`<date-picker position="left"></date-picker>`
`<date-picker position="right"></date-picker>`

![screenshot](/example/Screenshot%202022-05-23%20at%2011.45.54%20PM.png)

You can test it [on netlify](https://nsdatepicker.netlify.app).
