document.addEventListener('DOMContentLoaded', () => {
    // Prendiamo i riferimenti agli elementi HTML principali
    const form = document.getElementById('workout-form');
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('toast');
    const workoutsBody = document.getElementById('workouts-body');
    const emptyState = document.getElementById('empty-state');
    const workoutsTable = document.getElementById('workouts-table');

    // Carichiamo subito gli allenamenti salvati all'avvio della pagina
    loadWorkouts();

    // Gestiamo il salvataggio quando si preme il pulsante
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitiamo che la pagina si ricarichi
        
        // Prendiamo i valori dai campi di input
        const type = document.getElementById('type').value;
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;

        // Calcoliamo la durata totale in minuti (ore * 60 + minuti)
        const totalDuration = (hours * 60) + minutes;

        // Controlliamo che l'utente abbia inserito almeno un minuto di allenamento
        if (totalDuration <= 0) {
            showToast('Inserisci una durata valida per l\'allenamento', 'error');
            return;
        }

        // Mostriamo all'utente che stiamo salvando cambiando il pulsante
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loader"></span> Salvataggio...';
        submitBtn.disabled = true;

        try {
            // Inviamo i dati al nostro server locale
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type, duration: totalDuration })
            });

            if (response.ok) {
                form.reset(); // Svuotiamo il modulo dopo il salvataggio
                showToast('Allenamento salvato con successo! 🎉', 'success');
                loadWorkouts(); // Aggiorniamo la tabella con i nuovi dati
            } else {
                throw new Error('Errore nel salvataggio');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Errore durante il salvataggio. Riprova.', 'error');
        } finally {
            // Ripristiniamo il pulsante al suo stato normale
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Funzione per scaricare gli allenamenti dal server
    async function loadWorkouts() {
        try {
            const response = await fetch('/api/workouts');
            if (response.ok) {
                const workouts = await response.json();
                renderWorkouts(workouts);
            }
        } catch (error) {
            console.error('Errore nel caricamento:', error);
        }
    }

    // Funzione per disegnare la tabella con gli allenamenti
    function renderWorkouts(workouts) {
        workoutsBody.innerHTML = ''; // Svuotiamo prima la tabella
        
        // Se non ci sono allenamenti, mostriamo il messaggio che invita a iniziare
        if (workouts.length === 0) {
            workoutsTable.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        workoutsTable.style.display = 'table';
        emptyState.style.display = 'none';

        // Ordiniamo gli allenamenti dal più recente al più vecchio
        workouts.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

        // Per ogni allenamento, creiamo una riga nella tabella
        workouts.forEach(workout => {
            const row = document.createElement('tr');
            
            // Formattiamo la data per essere leggibile in italiano (es. 01/05/2026)
            const dateObj = new Date(workout.date);
            const dateStr = dateObj.toLocaleDateString('it-IT');
            const timeStr = workout.time.substring(0, 5); // Prendiamo solo HH:MM
            
            // Calcoliamo ore e minuti dalla durata totale per mostrarli testualmente
            const h = Math.floor(workout.duration / 60);
            const m = workout.duration % 60;
            let durationText = '';
            if (h > 0) durationText += `${h}h `;
            if (m > 0 || h === 0) durationText += `${m}m`;
            
            row.innerHTML = `
                <td>${dateStr} ${timeStr}</td>
                <td>${workout.type}</td>
                <td>${durationText}</td>
            `;
            workoutsBody.appendChild(row);
        });
    }

    // Funzione globale usata dai pulsanti "Esporta"
    window.downloadData = (format) => {
        // Creiamo un link "fantasma" per far partire il download
        const a = document.createElement('a');
        a.href = `/api/export/${format}`;
        a.download = `workouts.${format}`; // Nome del file
        document.body.appendChild(a);
        a.click(); // Simuliamo il clic
        document.body.removeChild(a); // Rimuoviamo il link
    };

    // Funzione per mostrare il messaggino a comparsa (toast) in basso
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast show ${type === 'error' ? 'error' : ''}`;
        
        // Lo nascondiamo in automatico dopo 3 secondi
        setTimeout(() => {
            toast.className = 'toast hidden';
        }, 3000);
    }
});
