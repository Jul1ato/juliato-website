// Project Timeline Sparklines — reads /timeline.json and renders activity graphs per card
(async function() {
    var cards = document.querySelectorAll('.bento-item[data-repo]');
    if (!cards.length) return;

    try {
        var res = await fetch('/timeline.json');
        if (!res.ok) return;
        var repos = await res.json();

        var repoMap = {};
        repos.forEach(function(r) { repoMap[r.name.toLowerCase()] = r; });

        cards.forEach(function(card) {
            var repoName = card.getAttribute('data-repo');
            var repo = repoMap[repoName.toLowerCase()];
            if (!repo || !repo.weekly_commits || !repo.weekly_commits.length) return;

            var weeks = repo.weekly_commits;
            // Take last 26 weeks for a compact view
            var data = weeks.slice(-26);
            var max = Math.max.apply(null, data) || 1;
            var total = data.reduce(function(a, b) { return a + b; }, 0);

            // Build sparkline bar chart as inline SVG
            var barW = 3;
            var gap = 1.5;
            var svgW = data.length * (barW + gap);
            var svgH = 32;

            var bars = '';
            data.forEach(function(val, i) {
                var h = Math.max((val / max) * (svgH - 2), val > 0 ? 2 : 0);
                var x = i * (barW + gap);
                var y = svgH - h;
                var opacity = val > 0 ? 0.4 + (val / max) * 0.6 : 0.08;
                bars += '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + h + '" rx="1" fill="currentColor" opacity="' + opacity.toFixed(2) + '"/>';
            });

            var svg = '<svg class="spark-svg" viewBox="0 0 ' + svgW + ' ' + svgH + '" preserveAspectRatio="none">' + bars + '</svg>';

            // Format dates
            var created = new Date(repo.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            var pushed = new Date(repo.pushed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            var diff = Date.now() - new Date(repo.pushed_at).getTime();
            var days = Math.floor(diff / 86400000);
            var rel = days === 0 ? 'today' : days < 30 ? days + 'd ago' : days < 365 ? Math.floor(days / 30) + 'mo ago' : Math.floor(days / 365) + 'y ago';

            var el = document.createElement('div');
            el.className = 'spark-timeline';
            el.innerHTML =
                '<div class="spark-graph">' + svg + '</div>' +
                '<div class="spark-meta">' +
                    '<span class="spark-stat">' + total + ' commits (26w)</span>' +
                    '<span class="spark-dates">' + created + ' — ' + pushed + ' (' + rel + ')</span>' +
                '</div>';

            // Insert into project-info area
            var info = card.querySelector('.project-info');
            if (info) info.appendChild(el);
        });
    } catch (e) {
        // Silently fail — timeline is a nice-to-have
    }
})();
