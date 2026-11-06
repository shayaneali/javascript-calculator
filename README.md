# JavaScript Calculator

A lightweight web-based calculator built with pure JavaScript, implementing clean UI logic and arithmetic operations.

## Live Demo
https://mycalprj.netlify.app/

## Screenshot
![javascript-calculator screenshot](https://image.thum.io/get/width/1200/https://mycalprj.netlify.app/)

## Tech Stack
- HTML5
- CSS3
- JavaScript (ES6+)

## Features
- Basic arithmetic: add, subtract, multiply, divide, percentage, plus exponent support via the ^ button (e.g. 2^3 = 8)
- Results are rounded to 10 decimal places, so floating-point artefacts like 0.1 + 0.2 display as 0.3 (the history line shows the same rounded value)
- Backspace and clear functions
- Full keyboard support (type digits/operators, Enter to calculate, Backspace to delete, Escape to clear)
- History list showing the last 5 completed calculations, persisted in localStorage
- Error handling for invalid input
- Simple, responsive layout
- Memory buttons (MC / MR / M+ / M-) that store, recall and adjust a value against the display
- Square root button (√) that replaces the display with the square root of the current value (Error on negative or invalid input)
- Copy result button (COPY) under the display: copies the current display value to the clipboard, with brief "Copied" feedback

## Run Locally
Open `index.html` in a browser, or serve with any static server (e.g. VS Code Live Server).
