
# Festival Muziekaanbeveler voor de Straatfeesten Kalmthout

Dit project is een webapplicatie die gepersonaliseerde muziekaanbevelingen doet aan bezoekers van de Straatfeesten in Kalmthout. Op basis van een vragenlijst worden muzieksuggesties gegenereerd die passen bij je stemming, smaak en persoonlijkheid.

## Functionaliteiten

* Vragenlijst over persoonlijkheid
* Analyse van antwoorden met aanbevelingslogica
* Gepersonaliseerde lijst met festivalacts en muziekgenres
* Overzichtelijke en gebruiksvriendelijke webinterface

## Links

* Figma ontwerp: [https://www.figma.com/design/Xy9sMpCsQ4PKDSYhJrQkaU/muziek-personalitetisquiz?node-id=8-3\&m=dev](https://www.figma.com/design/Xy9sMpCsQ4PKDSYhJrQkaU/muziek-personalitetisquiz?node-id=8-3&m=dev)
* Planning: [https://docs.google.com/spreadsheets/d/1Kl-yZ9q6MzJr35k6tOX0vsBbNeu8zJvMHNxVEeg67hw/edit?usp=share\_link](https://docs.google.com/spreadsheets/d/1Kl-yZ9q6MzJr35k6tOX0vsBbNeu8zJvMHNxVEeg67hw/edit?usp=share_link)

## Gebruikte technologieën

**Frontend:**

* HTML / CSS / Javascript

**Backend:**

* Node.js + Express
* API’s voor communicatie tussen frontend en database

**Database:**

* SQLite 

**Aanbevelingslogica:**

* Regelgebaseerd systeem gebaseerd op muziekdimensies en persoonlijkheid (zie [HvA studie](https://www.hva.nl/binaries/content/assets/subsites/kc-fdmci/assets_1/boek-festivalbeleving---oktober-2012.pdf))

## Gebruikte libraries

| Doel            | Library/tool           |
| --------------- | ---------------------- |
| Server          | Express (Node.js)      |
| Database        | sqlite3 
| Frontend logica | Native Fetch API |
| Styling         | Zelfgeschreven CSS  |



## Achterliggend model

De aanbevelingen zijn gebaseerd op een vereenvoudigde versie van een persoonlijkheidsmodel dat muzieksmaak koppelt aan eigenschappen zoals: reflectief & complex, intense en rebels, upbeat en conventioneel & energiek.
Gebaseerd op de HvA Studie: Festivalbeleving (2012)

# Types koppelen aan genres

| muziekdimensie           | Kenmerken                      | Genres                              |
| ------------------------------- | ------------------------------ | ----------------------------------- |
| Reflectief en Complex (a)       | Creatief, kalm, introspectief  | Ambient, Indie Folk, Jazz, Klassiek |
| Intens en Opstandig (b)         | Gedreven, avontuurlijk, rebels | Rock, Punk, Hip-Hop, Metal          |
| Opgewekt en Conversationeel (c) | Sociaal, gezellig, speels      | Pop, Disco, Funk, Reggae            |
| Energiek en Ritmisch (d)        | Actief, expressief, levendig   | Dance, EDM, Rap/hip hop             |

# Technisch

1. Frontend
   Toon 1 vraag per keer met keuzerondjes (radio buttons).
   Bij klik op "volgende" → sla antwoord op in state.
   Aan het einde: tel hoeveel keer a, b, c of d is gekozen.

2. Logica

```js
function determinePersonalityType(answers) {
  const counts = { a: 0, b: 0, c: 0, d: 0 };
  answers.forEach(answer => counts[answer]++);
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return dominant; // 'a', 'b', 'c' of 'd'
}
```

3. Backend geeft genres en artiesten terug per type

---

## Server starten

1. Open een terminal en navigeer naar de backend-map:

```
cd /Users/noredhondt/Documents/Postgraduaat/Project/backend
```

2. Start de server met:

```
node server.js
```

3. Je ziet in de terminal een bericht dat de server draait, bijvoorbeeld:

```
Server draait op http://localhost:3001
```

4. Open het frontend HTML-bestand ( `index.html`) in je editor of direct in een browser.
   gebruik de Live Server extensie (bijv. in VS Code) om de frontend lokaal te draaien en API calls naar de backend te laten werken.


