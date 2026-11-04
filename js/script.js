let display = document.getElementById("display");

    function press(value) {
        display.innerText += value;
    }

    function calculate() {
        const expr = display.innerText.trim();
        if (!expr) return;
        try {
            const result = eval(expr);
            display.innerText = result;
            // Show the last completed calculation as a history line.
            document.getElementById("history").innerText = expr + " = " + result;
        } catch {
            display.innerText = "Error";
        }
    }

    
    function removeChar() {
        display.innerText = display.innerText.slice(0, -1);
    }

    function clearDisplay() {
        display.innerText = "";
    }

    // Memory: MC clears, MR recalls (replacing the display),
    // M+ adds the displayed value, M- subtracts it.
    // Non-numeric displays ("Error", empty) are ignored by M+/M-.
    let memory = 0;

    function memoryClear() {
        memory = 0;
    }

    function memoryRecall() {
        display.innerText = String(memory);
    }

    function memoryAdd() {
        const value = parseFloat(display.innerText);
        if (!isNaN(value)) memory += value;
    }

    function memorySubtract() {
        const value = parseFloat(display.innerText);
        if (!isNaN(value)) memory -= value;
    }

    // Keyboard support: digits/operators type, Enter calculates,
    // Backspace deletes, Escape clears.
    document.addEventListener("keydown", function (e) {
        if (/^[0-9.]$/.test(e.key) || "+-*/%".includes(e.key)) {
            press(e.key);
        } else if (e.key === "Enter" || e.key === "=") {
            e.preventDefault();
            calculate();
        } else if (e.key === "Backspace") {
            removeChar();
        } else if (e.key === "Escape") {
            clearDisplay();
        }
    });