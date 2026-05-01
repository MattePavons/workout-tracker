const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
const PORT = 3000;
// Percorso del file dove salviamo i dati
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware necessari per il server
app.use(cors()); // Permette richieste da altri domini
app.use(express.json()); // Permette di leggere i dati in formato JSON nelle richieste
app.use(express.static('public')); // Serve i file statici (HTML, CSS, JS) dalla cartella 'public'

// Se il file dei dati non esiste, lo creiamo vuoto come un array JSON
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Funzione utile per leggere i dati dal file
function getWorkouts() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Rotta per ottenere tutti gli allenamenti
app.get('/api/workouts', (req, res) => {
    try {
        const workouts = getWorkouts();
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: 'Errore nella lettura dei dati' });
    }
});

// Rotta per salvare un nuovo allenamento
app.post('/api/workouts', (req, res) => {
    try {
        const { type, duration } = req.body;
        
        // Controlliamo che i dati ci siano tutti
        if (!type || !duration) {
            return res.status(400).json({ error: 'Tipo e durata sono obbligatori' });
        }

        const workouts = getWorkouts();
        const now = new Date();
        
        // Creiamo il nuovo oggetto allenamento
        const newWorkout = {
            id: Date.now().toString(), // ID univoco basato sull'orario
            type,
            duration: Number(duration), // Durata totale in minuti
            date: now.toISOString().split('T')[0], // Estraiamo solo la data (YYYY-MM-DD)
            time: now.toTimeString().split(' ')[0] // Estraiamo solo l'ora (HH:MM:SS)
        };
        
        // Aggiungiamo il nuovo allenamento alla lista e salviamo il file
        workouts.push(newWorkout);
        fs.writeFileSync(DATA_FILE, JSON.stringify(workouts, null, 2));
        
        res.status(201).json(newWorkout);
    } catch (err) {
        res.status(500).json({ error: 'Errore nel salvataggio' });
    }
});

// Rotta per esportare in formato JSON
app.get('/api/export/json', (req, res) => {
    // Scarica direttamente il file
    res.download(DATA_FILE, 'workouts.json');
});

// Rotta per esportare in formato CSV
app.get('/api/export/csv', (req, res) => {
    try {
        const workouts = getWorkouts();
        if (workouts.length === 0) return res.status(400).send('Nessun dato da esportare');

        // Trasformiamo i dati da JSON a CSV
        const parser = new Parser();
        const csv = parser.parse(workouts);
        
        res.header('Content-Type', 'text/csv');
        res.attachment('workouts.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).send('Errore nella creazione del CSV');
    }
});

// Rotta per esportare in formato XML
app.get('/api/export/xml', (req, res) => {
    try {
        const workouts = getWorkouts();
        // Trasformiamo i dati da JSON a XML
        const builder = new xml2js.Builder({ rootName: 'workouts' });
        const xml = builder.buildObject({ workout: workouts });
        
        res.header('Content-Type', 'application/xml');
        res.attachment('workouts.xml');
        res.send(xml);
    } catch (err) {
        res.status(500).send('Errore nella creazione dell\'XML');
    }
});

// Avviamo il server
app.listen(PORT, () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
});
