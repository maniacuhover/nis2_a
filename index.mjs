// index.mjs - Actualizat pentru conformitate cu OUG 155/2024

const questions = {
  1: {
    text: "Este entitatea din administrația publică centrală?",
    options: ["Da", "Nu"],
    key: "isPublicAdmin",
  },
  2: {
    text: "În ce sector activează entitatea?",
    options: [
      "Energie",
      "Transport",
      "Bancar",
      "Sănătate",
      "Apă potabilă",
      "Ape uzate",
      "Infrastructură digitală",
      "Administrație publică",
      "Spațiu",
      "Servicii Cloud",
      "Furnizor DNS/TLD",
      "Telecomunicații",
      "Industrie farmaceutică",
    ],
    key: "sector",
  },
  3: {
    text: "Entitatea furnizează servicii de cloud computing, servicii DNS, rețele publice de comunicații electronice sau registre TLD?",
    options: ["Da", "Nu"],
    key: "providesCriticalServices",
  },
  4: {
    text: "Entitatea este identificată drept critică conform Directivei 2022/2557 privind reziliența entităților critice?",
    options: ["Da", "Nu"],
    key: "isCriticalEntity",
  },
  5: {
    text: "Care este dimensiunea entității?",
    options: [
      "Microîntreprindere (<10 angajați și ≤2 mil € cifră afaceri)",
      "Întreprindere mică (10-49 angajați și ≤10 mil € cifră afaceri)",
      "Întreprindere mijlocie (50-249 angajați și ≤50 mil € cifră afaceri)",
      "Întreprindere mare (>250 angajați sau >50 mil € cifră afaceri)",
    ],
    key: "size",
  },
};

let currentStep = 1;
let answers = {};

function updateProgress() {
  const progress = (currentStep / Object.keys(questions).length) * 100;
  document.getElementById("progressBar").style.width = `${progress}%`;
}

function renderQuestion(step) {
  const question = questions[step];
  const container = document.getElementById("questionContainer");

  container.innerHTML = `
      <h3>${question.text}</h3>
      <div class="radio-group">
        ${question.options
          .map(
            (option) => `
          <label class="radio-option">
            <input type="radio" name="${question.key}" value="${option}">
            ${option}
          </label>
        `
          )
          .join("")}
      </div>
    `;
  updateProgress();
}

function determineCategory() {
  if (answers.isPublicAdmin === "Da") {
    return { category: "Entitate esențială", reference: "Art. 5 alin. (1) lit. a) din OUG 155/2024", explanation: "Entitate a administrației publice centrale" };
  }
  if (answers.isCriticalEntity === "Da" || answers.providesCriticalServices === "Da") {
    return { category: "Entitate esențială", reference: "Art. 5 și 9 din OUG 155/2024", explanation: "Furnizor de servicii critice sau identificată drept critică" };
  }
  return { category: "Entitate importantă", reference: "Art. 6 din OUG 155/2024", explanation: "Încadrare conform criteriilor generale" };
}

function showResult() {
  const result = determineCategory();
  const container = document.getElementById("resultContainer");

  container.innerHTML = `
      <div class="result">
        <div class="result-header">${result.category}</div>
        <div class="result-section"><strong>Baza legală:</strong> ${result.reference}</div>
        <div class="result-section"><strong>Motivul încadrării:</strong> ${result.explanation}</div>
      </div>
    `;
  container.style.display = "block";
  document.getElementById("questionContainer").style.display = "none";
  document.getElementById("nextButton").style.display = "none";
  document.getElementById("restartButton").style.display = "block";
}

document.getElementById("nextButton").addEventListener("click", () => {
  const selectedOption = document.querySelector(`input[name="${questions[currentStep].key}"]:checked`);
  if (!selectedOption) {
    alert("Vă rugăm să selectați o opțiune");
    return;
  }
  answers[questions[currentStep].key] = selectedOption.value;
  if (currentStep < Object.keys(questions).length) {
    currentStep++;
    renderQuestion(currentStep);
  } else {
    showResult();
  }
});

document.getElementById("restartButton").addEventListener("click", () => {
  currentStep = 1;
  answers = {};
  document.getElementById("resultContainer").style.display = "none";
  document.getElementById("questionContainer").style.display = "block";
  document.getElementById("nextButton").style.display = "block";
  document.getElementById("restartButton").style.display = "none";
  updateProgress();
  renderQuestion(1);
});

renderQuestion(1);

