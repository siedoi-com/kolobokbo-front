const runningLines = document.querySelectorAll('.running-line');

runningLines.forEach((line) => {
    const track = line.querySelector('.running-line__inner');
    const original = track.querySelector('span');

    function fillMarquee() {
        const containerWidth = line.offsetWidth;

        Array.from(track.children).forEach((child, idx) => {
            if (idx > 0) track.removeChild(child);
        });

        let totalWidth = track.scrollWidth;

        while (totalWidth < containerWidth * 2) {
            const clone = original.cloneNode(true);
            track.appendChild(clone);
            totalWidth = track.scrollWidth;
        }
    }

    fillMarquee();

    window.addEventListener('resize', fillMarquee);
});