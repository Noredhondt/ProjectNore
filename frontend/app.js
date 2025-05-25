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

// Bouw HTML voor lineup
const lineupHtml = data.personalityType.lineup.map(item =>
  `<li><strong>${item.artist}</strong> – ${item.stage} (${item.day})</li>`
).join('');

// Toon resultaat
const resultDiv = document.getElementById('result');
resultDiv.innerHTML = `<h2>Jouw persoonlijkheidstype:</h2>
  <p><strong>${data.personalityType.name}</strong></p>
  <p>${data.personalityType.description}</p>
  <h3>🎶 Jouw aanbevolen line-up:</h3>
  <ul>${lineupHtml}</ul>`;

}

document.getElementById('submit-btn').addEventListener('click', (e) => {
  e.preventDefault();
  submitAnswers();
});

buildQuiz();

  