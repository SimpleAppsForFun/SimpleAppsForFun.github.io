document.addEventListener('DOMContentLoaded', () => {
    const changeModeButton = document.getElementById('changeMode');
    const modeDisplay = document.getElementById('mode');
    const bpmDisplay = document.getElementById('bpmDisplay');
    const leftNumberDisplay = document.getElementById('leftNumber');
    const rightNumberDisplay = document.getElementById('rightNumber');
    const tip = document.getElementById('tip');

    let mode = 'Basic';
    let bpm = 60;
    let previousNumbers = { L: null, R: null };
    let intervalId = null;

    const modes = ['Basic', 'Moderate', 'Advanced'];

    function changeMode() {
        const currentModeIndex = modes.indexOf(mode);
        mode = modes[(currentModeIndex + 1) % modes.length];
        modeDisplay.textContent = `Mode: ${mode}`;
        updateDisplay();
    }

    function generateUniqueNumber(hand) {
        let newNumber;
        do {
            newNumber = Math.floor(Math.random() * 5) + 1;
        } while (previousNumbers[hand] === newNumber);
        previousNumbers[hand] = newNumber;
        return newNumber;
    }

    function updateDisplay() {
        if (mode === 'Basic') {
            const number = generateUniqueNumber('R');
            rightNumberDisplay.textContent = number;
            leftNumberDisplay.textContent = '';
        } else if (mode === 'Moderate') {
            const hand = Math.random() < 0.5 ? 'L' : 'R';
            const number = generateUniqueNumber(hand);
            if (hand === 'L') {
                leftNumberDisplay.textContent = number;
                rightNumberDisplay.textContent = '';
            } else {
                rightNumberDisplay.textContent = number;
                leftNumberDisplay.textContent = '';
            }
        } else {
            leftNumberDisplay.textContent = generateUniqueNumber('L');
            rightNumberDisplay.textContent = generateUniqueNumber('R');
        }
    }

    function startInterval() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(updateDisplay, 60000 / bpm);
    }

    // Listen to clicks for the Change Mode button
    changeModeButton.addEventListener('click', () => {
        changeMode();
    });

    // Listen for scroll and key events to adjust BPM
    window.addEventListener('wheel', (e) => {
        if (e.deltaY < 0) bpm += 1;
        else if (e.deltaY > 0) bpm -= 1;

        bpm = Math.max(20, Math.min(bpm, 300));
        bpmDisplay.textContent = `BPM: ${bpm}`;
        startInterval();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') bpm += 1;
        else if (e.key === 'ArrowDown') bpm -= 1;

        bpm = Math.max(20, Math.min(bpm, 300));
        bpmDisplay.textContent = `BPM: ${bpm}`;
        startInterval();
    });

    // Initialize the display
    startInterval();
});
