# Relazione di Progetto: Workout Tracker

## 1. Introduzione e Obiettivo del Progetto
Il progetto "Workout Tracker" è un'applicazione web sviluppata per tenere traccia delle proprie sessioni di allenamento. L'obiettivo era creare uno strumento semplice ma funzionale che permettesse all'utente di registrare le attività fisiche svolte (come corsa, sala pesi, nuoto) specificandone la durata, e di mantenere uno storico ordinato cronologicamente. 
Il sistema prevede anche la persistenza dei dati tramite un file locale (`data.json`) e la possibilità di esportare lo storico in vari formati (CSV, JSON, XML).

## 2. Tecnologie Utilizzate
Per mantenere il progetto snello e comprensibile, sono state utilizzate tecnologie standard senza l'ausilio di framework front-end pesanti:
* **Backend:** Node.js con il framework Express.js per la gestione delle API e del routing.
* **Frontend:** HTML5, CSS3 (con stile Glassmorphism) e Vanilla JavaScript.
* **Archiviazione:** File system locale (salvataggio e lettura in un file `data.json`).

## 3. Architettura
L'applicazione è strutturata in un paradigma Client-Server base:
1. Il client (browser) renderizza l'interfaccia e, tramite JavaScript, invia le richieste HTTP (metodo `fetch`) al server.
2. Il server (Express) ascolta su una porta definita, riceve i dati, inserisce un *timestamp* automatico e li salva in un file di testo in formato JSON.
3. Il server gestisce anche gli endpoint per l'esportazione dei dati in formati utili per fogli di calcolo o altri software.

---

## 4. Processo di Sviluppo (Cronologia dei Prompt)
Lo sviluppo è stato supportato dall'intelligenza artificiale, guidata attraverso una serie di richieste (prompt) studiate per costruire l'applicativo passo dopo passo, partendo dalle fondamenta fino alle rifiniture.

### Fase 1: Setup dell'Ambiente e Struttura Base
In questa fase mi sono concentrato sulla creazione del server e sull'impalcatura visiva.

* **Prompt 1:** *"Devo fare un progetto per l'università. Voglio creare un'applicazione web in Node.js per tenere traccia degli allenamenti in palestra. Mi aiuti a strutturare i file di base e a scrivere il file `server.js` usando Express? Il server deve girare sulla porta 3000 e servire dei file statici da una cartella 'public'."*
* **Prompt 2:** *"Ok, ora creiamo la pagina principale `index.html`. Fammi un layout semplice con un form al centro dove posso selezionare il tipo di allenamento da un menu a tendina (Corsa, Pesi, Nuoto, Yoga) e inserire la durata. Sotto al form aggiungi la struttura di una tabella vuota dove poi mostreremo lo storico."*

### Fase 2: Stile e Interfaccia Grafica (UI)
Volevo che l'applicazione avesse un aspetto accattivante ma non troppo complesso, evitando l'uso di librerie CSS esterne come Bootstrap.

* **Prompt 3:** *"L'HTML base è un po' troppo spartano. Puoi scrivermi un file `style.css` per renderlo più moderno? Mi piacerebbe usare un effetto 'glassmorphism' (quello semitrasparente simile al vetro) su uno sfondo scuro e sfumato. Usa un font pulito, magari importando Google Inter."*
* **Prompt 4:** *"Il form e la tabella sono troppo attaccati e i bordi sono troppo spigolosi. Puoi sistemare i margini nel CSS, arrotondare i bordi della tabella e fare in modo che il bottone 'Salva Allenamento' cambi leggermente colore o si sposti quando ci passo sopra col mouse?"*

### Fase 3: Logica di Backend e Salvataggio Dati
Una volta completata la grafica, mi sono spostato sulle API per permettere al server di memorizzare le informazioni.

* **Prompt 5:** *"Torniamo al file `server.js`. Dobbiamo salvare i dati che l'utente invia dal form. Crea la rotta `POST /api/workouts`. Quando arrivano i dati (tipo e durata), il server deve aggiungere automaticamente la data e l'ora corrente e salvare tutto in modo permanente in un file locale chiamato `data.json`."*
* **Prompt 6:** *"Ora crea la rotta `GET /api/workouts`. Questa API deve leggere il file `data.json` e restituire l'array con tutti gli allenamenti salvati. Fai in modo che l'array sia ordinato cronologicamente al contrario, così gli allenamenti più recenti appaiono per primi."*

### Fase 4: Connessione tra Frontend e Backend
Qui ho fatto in modo che la pagina web comunicasse effettivamente con il server.

* **Prompt 7:** *"Nel file `script.js` del frontend, scrivi l'Event Listener per il form. Quando l'utente clicca salva, deve bloccare il refresh della pagina, prendere il tipo di attività e i minuti, e fare una chiamata `fetch` POST al nostro server. Se il server risponde OK, svuota il form e fai apparire un messaggino di successo (toast) per un paio di secondi."*
* **Prompt 8:** *"Sempre in `script.js`, scrivi la funzione `loadWorkouts()`. Deve fare una fetch GET alla nostra API e popolare dinamicamente il corpo della tabella (`<tbody>`) nell'HTML creando le righe con il DOM. Se dal server torna un array vuoto, mostra un testo 'Nessun allenamento registrato'."*

### Fase 5: Funzionalità Extra e Rifiniture Finali
Negli ultimi passaggi ho aggiunto l'esportazione dei dati e migliorato l'usabilità dell'inserimento del tempo, rendendolo più intuitivo.

* **Prompt 9:** *"Vorrei aggiungere una funzionalità per esportare i dati, utile per un ipotetico professore o per analizzarli. Aggiungi nel `server.js` una rotta `/api/export/csv` che legge il `data.json`, lo converte al volo in formato CSV e lo fa scaricare direttamente all'utente come file. Aggiungi anche un bottone nell'HTML per chiamare questa rotta."*
* **Prompt 10:** *"L'input della durata in soli minuti è un po' scomodo per allenamenti lunghi. Modifica l'HTML per avere due campi vicini: 'Ore' e 'Minuti'. Poi aggiorna lo `script.js`: prima di fare la fetch POST, il frontend deve prendere il valore delle ore, moltiplicarlo per 60, sommarlo ai minuti, e inviare al server un unico valore di durata totale in minuti."*

---

## 5. Conclusioni
L'approccio modulare (interfaccia -> backend -> integrazione -> funzionalità avanzate) ha permesso di mantenere il controllo sul codice, facilitando il debug. L'uso di Express per le API si è dimostrato adeguato per la semplicità richiesta, mentre l'effetto grafico scelto rende l'applicativo piacevole senza sovraccaricare il client con risorse esterne eccessive.
