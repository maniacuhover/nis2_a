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
    ],
    key: "sector",
  },
  3: {
    text: "Este singurul furnizor al serviciului în zona geografică?",
    options: ["Da", "Nu"],
    key: "uniqueProvider",
  },
  4: {
    text: "O perturbare a serviciului ar putea avea impact semnificativ asupra siguranței publice?",
    options: ["Da", "Nu"],
    key: "publicSafetyImpact",
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
    return {
      category: "Entitate esențială",
      reference: "Art. 5 alin. (1) lit. a) din OUG 155/2024",
      explanation: "Entitate a administrației publice centrale",
      obligations: [
        "Notificare în 30 zile pentru înregistrare (Art. 18)",
        "Implementare măsuri de securitate (Art. 11-14)",
        "Raportare incidente (Art. 15)",
        "Audit de securitate periodic (Art. 11 alin. 5)",
        "Plan de măsuri remediere (Art. 12 alin. 5)",
      ],
      documents: [
        "Politica de securitate cibernetică",
        "Plan de răspuns la incidente",
        "Plan de continuitate a activității",
        "Proceduri de management al incidentelor",
        "Registru active informatice",
      ],
    };
  }

  if (answers.uniqueProvider === "Da" || answers.publicSafetyImpact === "Da") {
    return {
      category: "Entitate esențială",
      reference: "Art. 9 din OUG 155/2024",
      explanation:
        answers.uniqueProvider === "Da"
          ? "Criteriu de importanță critică: Furnizor unic în zonă"
          : "Criteriu de importanță critică: Impact asupra siguranței publice",
      obligations: [
        "Notificare în 30 zile (Art. 18)",
        "Audit de securitate (Art. 11)",
        "Raportare incidente în 24h (Art. 15)",
        "Implementare măsuri de securitate (Art. 11-14)",
      ],
      documents: [
        "Politica de securitate cibernetică",
        "Plan de răspuns la incidente",
        "Proceduri de management al incidentelor",
      ],
    };
  }

  if (answers.sector === "Sănătate") {
    return {
      category: "Entitate esențială",
      reference: "Anexa 1 - Sectorul Sănătății din OUG 155/2024",
      explanation: "Entitate din sectorul sănătății",
      obligations: [
        "Notificare în 30 zile (Art. 18)",
        "Măsuri tehnice și organizatorice de securitate (Art. 11-14)",
        "Raportare incidente (Art. 15)",
        "Audit periodic de securitate",
      ],
      documents: [
        "Politica de securitate cibernetică",
        "Proceduri operaționale de securitate",
        "Plan de răspuns la incidente",
      ],
    };
  }

  return {
    category: "Entitate importantă",
    reference: "Art. 6 din OUG 155/2024",
    explanation: "Încadrare conform criteriilor generale",
    obligations: [
      "Notificare în 30 zile (Art. 18)",
      "Măsuri de securitate de bază (Art. 11)",
      "Raportare incidente majore (Art. 15)",
    ],
    documents: [
      "Politica de securitate de bază",
      "Proceduri de raportare incidente",
    ],
  };
}

function generatePDF() {
  const result = determineCategory();

  // Creează un nou document pentru print
  const printWindow = window.open("", "", "width=800,height=600");

  printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Raport Încadrare NIS2</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
          }
          .date {
            font-size: 12px;
            color: #666;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 10px;
          }
          ul {
            margin: 0;
            padding-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
          @media print {
            body {
              padding: 0;
            }
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">Raport Încadrare NIS2</div>
        <div class="date">Data generării: ${new Date().toLocaleString(
          "ro-RO"
        )}</div>
        
        <div class="section">
          <div class="section-title">Categorie:</div>
          ${result.category}
        </div>
        
        <div class="section">
          <div class="section-title">Bază legală:</div>
          ${result.reference}
        </div>
        
        <div class="section">
          <div class="section-title">Motivul încadrării:</div>
          ${result.explanation}
        </div>
        
        <div class="section">
          <div class="section-title">Obligații principale:</div>
          <ul>
            ${result.obligations.map((o) => `<li>${o}</li>`).join("")}
          </ul>
        </div>
        
        <div class="section">
          <div class="section-title">Documente necesare:</div>
          <ul>
            ${result.documents.map((d) => `<li>${d}</li>`).join("")}
          </ul>
        </div>
        
        <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">
          Printează / Salvează ca PDF
        </button>
      </body>
      </html>
    `);

  printWindow.document.close();
}
function showResult() {
  const result = determineCategory();
  const container = document.getElementById("resultContainer");

  container.innerHTML = `
      <div class="result" id="resultPDF">
        <div class="result-header">${result.category}</div>
        <div class="result-section">
          <strong>Baza legală:</strong> ${result.reference}
        </div>
        <div class="result-section">
          <strong>Motivul încadrării:</strong> ${result.explanation}
        </div>
        <div class="result-section">
          <strong>Obligații principale:</strong>
          <ul>
            ${result.obligations.map((o) => `<li>${o}</li>`).join("")}
          </ul>
        </div>
        <div class="result-section">
          <strong>Documente necesare:</strong>
          <ul>
            ${result.documents.map((d) => `<li>${d}</li>`).join("")}
          </ul>
        </div>
      </div>
      <button id="exportPDF" class="button">Exportă PDF</button>
    `;

  container.style.display = "block";
  document.getElementById("questionContainer").style.display = "none";
  document.getElementById("nextButton").style.display = "none";
  document.getElementById("restartButton").style.display = "block";

  document.getElementById("exportPDF").addEventListener("click", generatePDF);
}

// Event Listeners
document.getElementById("nextButton").addEventListener("click", () => {
  const selectedOption = document.querySelector(
    `input[name="${questions[currentStep].key}"]:checked`
  );

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

// Start with first question
renderQuestion(1);
