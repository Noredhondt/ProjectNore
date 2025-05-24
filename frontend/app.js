const questions = [
    { text: "Wat beschrijft je het best?", options: { a: "Creatief en kalm", b: "Gedreven en rebels", c: "Sociaal en speels", d: "Energiek en levendig" } },
    { text: "Wat doe je op een festival?", options: { a: "Chillen en luisteren", b: "Headbangen", c: "Dansen en zingen", d: "Springen op beats" } },
    { text: "Wat is je favoriete moment?", options: { a: "Zonsondergang met muziek", b: "Donkere tent met harde muziek", c: "Zomeravond met vrienden", d: "Nachtelijke rave" } },
  ];
  
  let currentQuestion = 0;
  const answers = [];
  
  const quizDiv = document.getElementById("quiz");
  const nextBtn = document.getElementById("nextBtn");
  const resultDiv = document.getElementById("result");
  
  function showQuestion(index) {
    const q = questions[index];
    let html = `<p>${q.text}</p>`;
    for (let key in q.options) {
      html += `<label><input type="radio" name="answer" value="${key}" /> ${q.options[key]}</label><br>`;
    }
    quizDiv.innerHTML = html;
  }
  
  nextBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      alert("Kies een antwoord.");
      return;
    }
    answers.push(selected.value);
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion(currentQuestion);
    } else {
      const personality = determinePersonality(answers);
      fetch("http://localhost:3000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: personality })
      })
        .then(res => res.json())
        .then(data => {
          resultDiv.innerHTML = `<h2>Jouw aanbevelingen:</h2><ul>${data.genres.map(g => `<li>${g}</li>`).join('')}</ul>`;
          quizDiv.innerHTML = "";
          nextBtn.style.display = "none";
        });
    }
  });
  
  function determinePersonality(answers) {
    const counts = { a: 0, b: 0, c: 0, d: 0 };
    answers.forEach(a => counts[a]++);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
  
  showQuestion(currentQuestion);
  