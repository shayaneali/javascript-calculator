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

    // Percentage: converts the current entry/result to its percentage
    // (divides by 100) and shows the conversion in the history line.
    // Non-numeric displays ("Error", expressions) are ignored.
    function percentDisplay() {
        const raw = display.innerText.trim();
        const value = Number(raw);
        if (!raw || Number.isNaN(value)) return;
        const result = roundResult(value / 100);
        display.innerText = String(result);
        document.getElementById("history").innerText = raw + "% = " + result;
    }

    // Plus/minus toggle: flips the sign of the current entry or result.
    // Non-numeric displays ("Error", expressions) are ignored.
    function toggleSign() {
        const raw = display.innerText.trim();
        const value = Number(raw);
        if (!raw || Number.isNaN(value)) return;
        display.innerText = String(roundResult(-value));
    }

    function removeChar() {
        display.innerText = display.innerText.slice(0, -1);
    }

    function clearDisplay() {
        display.innerText = "";
    }

    // Copy the current display value to the clipboard, with brief
    // "Copied" feedback on the button. Empty display or "Error" is ignored.
    // Falls back to a hidden textarea when the Clipboard API is unavailable.
    function copyResult() {
        const value = display.innerText.trim();
        if (!value || value === "Error") return;
        const btn = document.getElementById("copyBtn");
        const showCopied = () => {
            if (!btn) return;
            const original = btn.innerText;
            btn.innerText = "✓ COPIED";
            setTimeout(() => { btn.innerText = original; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(showCopied).catch(() => fallbackCopyText(value, showCopied));
        } else {
            fallbackCopyText(value, showCopied);
        }
    }

    function fallbackCopyText(text, done) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        if (done) done();
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
        if (/^[0-9.]$/.test(e.key) || "+-*/^".includes(e.key)) {
            press(e.key);
        } else if (e.key === "%") {
            percentDisplay();
        } else if (e.key === "Enter" || e.key === "=") {
            e.preventDefault();
            calculate();
        } else if (e.key === "Backspace") {
            removeChar();
        } else if (e.key === "Escape") {
            clearDisplay();
        }
    });
    // Light and dark theme toggle: dark-green is the default, the choice
    // is saved in localStorage and restored on load.
    const THEME_KEY = "calc_theme";
    function applyTheme(theme) {
        const light = theme === "light";
        document.body.classList.toggle("light", light);
        const btn = document.getElementById("themeBtn");
        if (btn) btn.textContent = light ? "🌙 Dark" : "☀️ Light";
    }
    function toggleTheme() {
        const next = document.body.classList.contains("light") ? "dark" : "light";
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        applyTheme(next);
    }
    (function loadTheme() {
        let saved = "dark";
        try { saved = localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark"; } catch (e) {}
        applyTheme(saved);
    })();

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
