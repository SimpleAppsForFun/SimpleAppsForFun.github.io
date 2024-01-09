document.addEventListener('DOMContentLoaded', () => {
    const changeModeButton = document.getElementById('changeMode');
    const modeDisplay = document.getElementById('modeDisplay');
    const bpmDisplay = document.getElementById('bpmDisplay');
    const leftNumberDisplay = document.getElementById('leftNumber');
    const rightNumberDisplay = document.getElementById('rightNumber');
    

    let mode = 'Basic';
    let bpm = 60;
    let previousNumbers = { L: null, R: null };
    let intervalId = null;

    const modes = ['Basic', 'Moderate', 'Advanced'];

    function changeMode() {
        const currentModeIndex = modes.indexOf(mode);
        mode = modes[(currentModeIndex + 1) % modes.length];
        modeDisplay.textContent = `Mode: ${mode}`; // This line should update the display
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
        const table = document.getElementById('modeTable');
        const leftLetter = table.getElementsByClassName('letter left')[0];
        const rightLetter = table.getElementsByClassName('letter right')[0];
        const leftNumber = table.getElementsByClassName('number left')[0];
        const rightNumber = table.getElementsByClassName('number right')[0];
    
        // Clear the previous mode's displays
        leftLetter.textContent = '';
        leftNumber.textContent = '';
        rightLetter.textContent = '';
        rightNumber.textContent = '';
        rightNumberDisplay.textContent = ''; // Clear the right number display for non-Basic modes
    
        // Only display the table if not in Basic mode
        table.style.display = mode === 'Basic' ? 'none' : '';
    
        // Handle each mode
        if (mode === 'Basic') {
            // Show only one number for Basic mode
            const number = generateUniqueNumber('R');
            rightNumberDisplay.textContent = number;
            rightNumberDisplay.className = 'basic-number';
            // Hide the table since Basic mode does not use it
            table.style.display = 'none';
        } else if (mode === 'Moderate') {
            // Show one set (L or R) at a time for Moderate mode
            let hand = Math.random() < 0.5 ? 'L' : 'R';
            if (hand === 'L') {
                leftLetter.textContent = 'L';
                leftNumber.textContent = generateUniqueNumber('L');
            } else {
                rightLetter.textContent = 'R';
                rightNumber.textContent = generateUniqueNumber('R');
            }
        } else if (mode === 'Advanced') {
            // Show both sets (L and R) for Advanced mode
            leftLetter.textContent = 'L';
            leftNumber.textContent = generateUniqueNumber('L');
            rightLetter.textContent = 'R';
            rightNumber.textContent = generateUniqueNumber('R');
        }
    }

    changeModeButton.addEventListener('click', changeMode);
    window.addEventListener('wheel', adjustBpm);
    window.addEventListener('keydown', adjustBpm);
    window.addEventListener('resize', centerNumbers);

    startInterval();

    function adjustBpm(event) {
        if (event.deltaY < 0 || event.key === 'ArrowUp') {
            bpm = Math.min(bpm + 1, 300);
        } else if (event.deltaY > 0 || event.key === 'ArrowDown') {
            bpm = Math.max(bpm - 1, 20);
        }
        bpmDisplay.textContent = `BPM: ${bpm}`;
        startInterval();
    }

    function centerNumbers() {
        const displays = document.querySelectorAll('.letter-number, .basic-number');
        displays.forEach(display => {
            display.style.display = 'flex';
            display.style.flexDirection = 'column';
            display.style.alignItems = 'center';
            display.style.justifyContent = 'center';
            display.style.height = '100vh';
        });
    }

    function startInterval() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(updateDisplay, 60000 / bpm);
    }
});
