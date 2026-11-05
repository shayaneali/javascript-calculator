let display = document.getElementById("display");

    function press(value) {
        display.innerText += value;
    }

    // Round results to 10 decimal places so binary floating-point
    // artefacts (e.g. 0.1 + 0.2 = 0.30000000000000004) display cleanly.
    function roundResult(value) {
        return typeof value === 'number' && Number.isFinite(value)
            ? parseFloat(value.toFixed(10))
            : value;
    }

    function calculate() {
        const expr = display.innerText.trim();
        if (!expr) return;
        try {
            // ^ is an exponent operator: convert it to JS ** before evaluating
            // (e.g. 2^3 becomes 2**3 = 8). The history line keeps the original ^.
            const result = roundResult(eval(expr.replace(/\^/g, '**')));
            display.innerText = result;
            // Keep the last 5 completed calculations, persisted in localStorage.
            addToHistory(expr + " = " + result);
        } catch {
            display.innerText = "Error";
        }
    }

    
    // Square root: replaces the display with the square root of the
    // current value; Error on negative or invalid input.
    function sqrtDisplay() {
        const raw = display.innerText.trim();
        const value = Number(raw);
        if (!raw || Number.isNaN(value) || value < 0) {
            display.innerText = "Error";
            return;
        }
        const result = roundResult(Math.sqrt(value));
        display.innerText = String(result);
        document.getElementById("history").innerText = "√(" + raw + ") = " + result;
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
        if (/^[0-9.]$/.test(e.key) || "+-*/%^".includes(e.key)) {
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
    // Last-5 history list, persisted in localStorage and restored on load.
    const HISTORY_KEY = "calc_history";
    function renderHistory() {
        const el = document.getElementById("history");
        if (!el) return;
        let items = [];
        try { items = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { items = []; }
        el.innerHTML = "";
        items.forEach(text => {
            const line = document.createElement("div");
            line.textContent = text;
            el.appendChild(line);
        });
    }
    function addToHistory(entry) {
        let items = [];
        try { items = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { items = []; }
        items = [entry, ...items].slice(0, 5);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
        renderHistory();
    }
    renderHistory();
