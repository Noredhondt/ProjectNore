const apiBase = 'http://localhost:3001/api';


async function fetchQuestions() {
  console.log("🔄 Ophalen van vragen...");
  const res = await fetch(`${apiBase}/questions`);
  const data = await res.json();
  console.log("✅ Gevonden vragen:", data); // <-- Belangrijk!
  return data;
}

async function fetchOptions(questionId) {
  console.log(`🔄 Ophalen van opties voor vraag ${questionId}...`);
  const res = await fetch(`${apiBase}/questions/${questionId}/options`);
  const data = await res.json();
  console.log(`✅ Opties voor vraag ${questionId}:`, data); // <-- Belangrijk!
  return data;
}



async function buildQuiz() {
  const form = document.getElementById('quiz-form');
  form.innerHTML = '';

  const questions = await fetchQuestions();

  for (const question of questions) {
    const options = await fetchOptions(question.id);

    const qDiv = document.createElement('div');
    qDiv.className = 'question';

    const qTitle = document.createElement('h3');
    qTitle.textContent = question.text;
    qDiv.appendChild(qTitle);

    const optsDiv = document.createElement('div');
    optsDiv.className = 'options';

    for (const opt of options) {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q${question.id}`;
      radio.value = opt.answer_value;
      label.appendChild(radio);
      label.append(opt.text);
      optsDiv.appendChild(label);
    }

    qDiv.appendChild(optsDiv);
    form.appendChild(qDiv);
  }
}

async function submitAnswers() {
  const form = document.getElementById('quiz-form');
  const answers = [];

  // Verzamel gekozen antwoorden per vraag
  const questions = await fetchQuestions();

  for (const question of questions) {
    const selected = form.querySelector(`input[name="q${question.id}"]:checked`);
    if (selected) {
      answers.push(selected.value);
    } else {
      alert('Beantwoord alle vragen aub!');
      return;
    }
  }

  // Verstuur antwoorden naar server
  const res = await fetch(`${apiBase}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });

  if (!res.ok) {
    const err = await res.json();
    alert('Fout: ' + (err.error || 'Onbekende fout'));
    return;
  }

  const data = await res.json();

  
// html voor lineup NIEUW gesorteerd
const dagVolgorde = {
  'vrijdag': 1,
  'zaterdag': 2,
  'zondag': 3
};

const lineupSorted = data.personalityType.lineup.slice().sort((a, b) => {
  if (dagVolgorde[a.day.toLowerCase()] !== dagVolgorde[b.day.toLowerCase()]) {
    return dagVolgorde[a.day.toLowerCase()] - dagVolgorde[b.day.toLowerCase()];
  }
  if (a.artist.toLowerCase() !== b.artist.toLowerCase()) {
    return a.artist.toLowerCase().localeCompare(b.artist.toLowerCase());
  }
  return a.stage.toLowerCase().localeCompare(b.stage.toLowerCase());
});

// Groepeer per dag
const lineupByDay = lineupSorted.reduce((acc, item) => {
  const dag = item.day;
  if (!acc[dag]) acc[dag] = [];
  acc[dag].push(item);
  return acc;
}, {});

// Bouw HTML met dag-koppen
let lineupHtml = '';
for (const dag of ['vrijdag', 'zaterdag', 'zondag']) {
  if (lineupByDay[dag]) {
    lineupHtml += `<h4>${dag.charAt(0).toUpperCase() + dag.slice(1)}</h4><ul>`;
    for (const item of lineupByDay[dag]) {
      lineupHtml += `<li><span class="artist-name">${item.artist}</span> – ${item.stage}</li>`;
    }
    lineupHtml += '</ul>';
  }
}
  



/* Bouw HTML voor lineup
const lineupHtml = data.personalityType.lineup.map(item =>
  `<li><strong>${item.artist}</strong> – ${item.stage} (${item.day})</li>`
).join(''); */


// Toon resultaat
const resultDiv = document.getElementById('result');
resultDiv.innerHTML = `
  <h2 class='result-titel'>
    Jouw persoonlijkheidstype: <span class="result-naam">${data.personalityType.name}</span>
  </h2>
  <p> Jouw muziekdimensie: ${data.personalityType.musicDimension} </p> 
  ${data.personalityType.description}
  <h3 class='lineup-titel'> Jouw aanbevolen line-up:</h3>
  ${lineupHtml}
`;
}

document.getElementById('submit-btn').addEventListener('click', (e) => {
  e.preventDefault();
  submitAnswers();
});

buildQuiz();

