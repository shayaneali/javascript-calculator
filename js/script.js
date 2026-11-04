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
            // Keep the last 5 completed calculations, persisted in localStorage.
            addToHistory(expr + " = " + result);
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
