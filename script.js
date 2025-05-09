// Wasser Tracker App
// Diese App hilft dir, deine tägliche Wasseraufnahme zu verfolgen und Statistiken anzuzeigen.
// Sie verwendet HTML, CSS und JavaScript (mit Chart.js für Diagramme) und speichert Daten im Local Storage.
        const ziel = 2000;
        let getrunken = localStorage.getItem('getrunken') ? parseInt(localStorage.getItem('getrunken')) : 0;
        const status = document.getElementById('status');
        const progressBar = document.getElementById('progress-bar');
        const statistikChartCtx = document.getElementById('statistikChart').getContext('2d');
        const durchschnittEl = document.getElementById('durchschnitt');

        function updateStatus() {
            status.textContent = `Du hast ${getrunken} ml von ${ziel} ml getrunken.`;
            const fortschritt = Math.min((getrunken / ziel) * 100, 100);
            progressBar.style.width = fortschritt + "%";
            updateChart();
            updateDurchschnitt();

            if (getrunken >= ziel) {
                alert("🎉 Super! Du hast dein tägliches Trinkziel erreicht. Weiter so!");
            }
        }

        function wasserHinzufuegen() {
            const mengeInput = document.getElementById('menge');
            const menge = parseInt(mengeInput.value);
            if (!isNaN(menge) && menge > 0) {
                getrunken += menge;
                localStorage.setItem('getrunken', getrunken);
                saveDailyData(menge);
                updateStatus();
                mengeInput.value = '';
            } else {
                alert("Bitte gib eine gültige Zahl ein.");
            }
        }

        function resetWasser() {
            getrunken = 0;
            localStorage.setItem('getrunken', getrunken);
            updateStatus();
            alert("Deine Wassermenge wurde zurückgesetzt.");
        }

        function saveDailyData(menge) {
            const today = new Date().toISOString().split('T')[0];
            let data = JSON.parse(localStorage.getItem('wasserStatistik')) || {};
            data[today] = (data[today] || 0) + menge;
            localStorage.setItem('wasserStatistik', JSON.stringify(data));
        }

        function updateChart() {
            const data = JSON.parse(localStorage.getItem('wasserStatistik')) || {};
            const labels = Object.keys(data);
            const values = Object.values(data);

            new Chart(statistikChartCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Getrunkenes Wasser (ml)',
                        data: values,
                        backgroundColor: '#007bff',
                        borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 3000
                        }
                    }
                }
            });
        }

        function updateDurchschnitt() {
            const data = JSON.parse(localStorage.getItem('wasserStatistik')) || {};
            const last7Days = Object.values(data).slice(-7);
            const average = (last7Days.reduce((sum, val) => sum + val, 0) / last7Days.length) || 0;
            durchschnittEl.textContent = `Durchschnitt (letzte 7 Tage): ${Math.round(average)} ml pro Tag`;
        }

        // Initialer Status beim Laden der Seite
        updateStatus();
