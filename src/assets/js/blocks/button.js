import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.button--primary').forEach(function (btn) {
        var content = document.createElement('span');
        content.className = 'btn-content';
        while (btn.firstChild) {
            content.appendChild(btn.firstChild);
        }
        btn.appendChild(content);

        var ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        btn.appendChild(ripple);

        function getParams(e) {
            var rect     = btn.getBoundingClientRect();
            var x        = e.clientX - rect.left;
            var y        = e.clientY - rect.top;
            var diameter = Math.hypot(
                Math.max(x, rect.width  - x),
                Math.max(y, rect.height - y)
            ) * 2;
            return { x: x, y: y, size: diameter };
        }

        btn.addEventListener('mouseenter', function (e) {
            var p = getParams(e);
            gsap.killTweensOf(ripple);
            gsap.set(ripple, { width: p.size, height: p.size, x: p.x, y: p.y, xPercent: -50, yPercent: -50, scale: 0 });
            gsap.to(ripple, { scale: 1, duration: 0.7, ease: 'power2.out' });
        });

        btn.addEventListener('mouseleave', function () {
            gsap.killTweensOf(ripple);
            gsap.to(ripple, { scale: 0, duration: 0.4, ease: 'power2.in' });
        });
    });
});