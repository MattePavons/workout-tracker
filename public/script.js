/**
 * TRACKFIT - Logica dell'applicazione
 */

// Funzioni Globali (necessarie per gli attributi onclick nell'HTML)
window.deleteWorkout = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo allenamento?')) return;
    
    try {
        const response = await fetch(`/api/workouts/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            if (window.refreshWorkouts) window.refreshWorkouts();
            if (window.notifyUser) window.notifyUser('Allenamento eliminato! 🗑️', 'success');
        } else {
            alert('Errore durante l\'eliminazione');
        }
    } catch (error) {
        console.error('Errore:', error);
    }
};

window.downloadData = (format) => {
    const a = document.createElement('a');
    a.href = `/api/export/${format}`;
    a.download = `workouts.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('workout-form');
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('toast');
    const workoutsBody = document.getElementById('workouts-body');
    const emptyState = document.getElementById('empty-state');
    const workoutsTable = document.getElementById('workouts-table');

    // Inizializzazione
    loadWorkouts();

    // Esposizione funzioni per l'ambito globale
    window.refreshWorkouts = loadWorkouts;
    window.notifyUser = showToast;

    // Gestione Invio Form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const type = document.getElementById('type').value;
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const totalDuration = (hours * 60) + minutes;

        if (totalDuration <= 0) {
            showToast('Inserisci una durata valida', 'error');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Salvataggio...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, duration: totalDuration })
            });

            if (response.ok) {
                form.reset();
                showToast('Allenamento salvato! 🎉', 'success');
                loadWorkouts();
            }
        } catch (error) {
            showToast('Errore nel salvataggio', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    async function loadWorkouts() {
        try {
            const response = await fetch('/api/workouts');
            if (response.ok) {
                const workouts = await response.json();
                renderWorkouts(workouts);
            }
        } catch (error) {
            console.error('Errore caricamento:', error);
        }
    }

    function renderWorkouts(workouts) {
        workoutsBody.innerHTML = '';
        
        if (workouts.length === 0) {
            workoutsTable.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        workoutsTable.style.display = 'table';
        emptyState.style.display = 'none';

        workouts.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

        workouts.forEach(workout => {
            const dateObj = new Date(workout.date);
            const dateStr = dateObj.toLocaleDateString('it-IT');
            const timeStr = workout.time.substring(0, 5);
            
            const h = Math.floor(workout.duration / 60);
            const m = workout.duration % 60;
            let durationText = `${h > 0 ? h + 'h ' : ''}${m}m`;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dateStr} ${timeStr}</td>
                <td>${workout.type}</td>
                <td>${durationText}</td>
                <td>
                    <button class="btn-delete" onclick="deleteWorkout('${workout.id}')" title="Elimina">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            `;
            workoutsBody.appendChild(row);
        });
    }

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast show ${type === 'error' ? 'error' : ''}`;
        setTimeout(() => { toast.className = 'toast hidden'; }, 3000);
    }
});
