const questions = {
  1: {
    text: "Este entitatea din administrația publică centrală?",
    options: ["Da", "Nu"],
    key: "isPublicAdmin"
  },
  2: {
    text: "În ce sector activează entitatea?",
    options: [
      "Energie",
      "Transport",
      "Bancar",
      "Infrastructuri ale pieței financiare",
      "Sănătate",
      "Apă potabilă",
      "Ape uzate",
      "Infrastructură digitală",
      "Gestionare servicii TIC",
      "Administrație publică",
      "Spațiu",
      "Servicii poștale și de curierat",
      "Gestionarea deșeurilor",
      "Producția și distribuția de substanțe chimice",
      "Producția și distribuția de alimente",
      "Fabricare",
      "Furnizori digitali"
    ],
    key: "sector"
  },
  3: {
    text: "Care este dimensiunea entității?",
    options: [
      "Întreprindere mare (>250 angajați sau >50 mil € cifră afaceri)",
      "Întreprindere mijlocie (50-249 angajați și ≤50 mil € cifră afaceri)",
      "Întreprindere mică (10-49 angajați și ≤10 mil € cifră afaceri)",
      "Microîntreprindere (<10 angajați și ≤2 mil € cifră afaceri)"
    ],
    key: "size"
  },
  4: {
    text: "Este singurul furnizor al serviciului în zona geografică?",
    options: ["Da", "Nu"],
    key: "uniqueProvider"
  },
  5: {
    text: "O perturbare a serviciului ar putea avea impact semnificativ asupra siguranței publice?",
    options: ["Da", "Nu"],
    key: "publicSafetyImpact"
  },
  6: {
    text: "O perturbare a serviciului ar putea genera un risc sistemic semnificativ?",
    options: ["Da", "Nu"],
    key: "systemicRisk"
  },
  7: {
    text: "Entitatea este critică datorită importanței sale specifice la nivel național sau regional?",
    options: ["Da", "Nu"],
    key: "criticalImportance"
  }
};

const healthSectorQuestions = {
  8: {
    text: "Entitatea desfășoară activități de cercetare și dezvoltare a medicamentelor?",
    options: ["Da", "Nu"],
    key: "medicineResearch"
  },
  9: {
    text: "Entitatea fabrică produse farmaceutice de bază?",
    options: ["Da", "Nu"],
    key: "pharmaProduction"
  },
  10: {
    text: "Entitatea fabrică dispozitive medicale esențiale?",
    options: ["Da", "Nu"],
    key: "medicalDevices"
  }
};

let currentStep = 1;
let answers = {};
let totalSteps = Object.keys(questions).length;

function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
}

function renderQuestion(step) {
  let question;
  if (answers.sector === 'Sănătate' && step > Object.keys(questions).length) {
    question = healthSectorQuestions[step];
    totalSteps = Object.keys(questions).length + Object.keys(healthSectorQuestions).length;
  } else {
    question = questions[step];
  }
  
  if (!question) return showResult();

  const container = document.getElementById('questionContainer');
  
  container.innerHTML = `
    <h3>${question.text}</h3>
    <div class="radio-group">
      ${question.options.map(option => `
        <label class="radio-option">
          <input type="radio" name="${question.key}" value="${option}">
          ${option}
        </label>
      `).join('')}
    </div>
  `;
  
  updateProgress();
}

function determineCategory() {
  // 1. Verificare administrație publică centrală
  if (answers.isPublicAdmin === 'Da') {
    return {
      category: "Entitate esențială",
      reference: "Art. 5 alin. (1) lit. a) din OUG 155/2024",
      explanation: "Entitate a administrației publice centrale",
      obligations: [
        "Notificare în 30 zile pentru înregistrare (Art. 18 alin. 2)",
        "Implementare măsuri de securitate (Art. 11-14)",
        "Raportare incidente (Art. 15)",
        "Audit de securitate periodic (Art. 11 alin. 5)",
        "Autoevaluare anuală (Art. 12 alin. 4)",
        "Plan de măsuri remediere (Art. 12 alin. 5)"
      ],
      documents: [
        "Notificare către DNSC pentru înregistrare",
        "Politica de securitate cibernetică",
        "Plan de răspuns la incidente",
        "Plan de continuitate a activității",
        "Proceduri de management al incidentelor",
        "Registru active informatice",
        "Raport de autoevaluare anuală"
      ]
    };
  }

  // 2. Verificare criterii Art. 9
  if (answers.uniqueProvider === 'Da' || 
      answers.publicSafetyImpact === 'Da' || 
      answers.systemicRisk === 'Da' ||
      answers.criticalImportance === 'Da') {
    let explanation = "Entitate considerată esențială conform Art. 9 datorită: ";
    if (answers.uniqueProvider === 'Da') explanation += "\n- Este singurul furnizor al serviciului în zonă";
    if (answers.publicSafetyImpact === 'Da') explanation += "\n- Impact semnificativ asupra siguranței publice";
    if (answers.systemicRisk === 'Da') explanation += "\n- Poate genera risc sistemic";
    if (answers.criticalImportance === 'Da') explanation += "\n- Importanță critică la nivel național/regional";

    return {
      category: "Entitate esențială",
      reference: "Art. 9 din OUG 155/2024",
      explanation: explanation,
      obligations: [
        "Notificare în 30 zile (Art. 18)",
        "Audit de securitate (Art. 11)",
        "Raportare incidente în 24h (Art. 15)",
        "Implementare măsuri de securitate (Art. 11-14)",
        "Autoevaluare anuală (Art. 12)"
      ],
      documents: [
        "Notificare către DNSC",
        "Politica de securitate cibernetică",
        "Plan de răspuns la incidente",
        "Proceduri de management al incidentelor",
        "Raport de audit de securitate",
        "Raport de autoevaluare"
      ]
    };
  }

  // 3. Verificare sectoare specifice Anexa 1
  const anexa1Sectors = [
    'Energie',
    'Transport',
    'Bancar',
    'Infrastructuri ale pieței financiare',
    'Apă potabilă',
    'Ape uzate',
    'Infrastructură digitală',
    'Gestionare servicii TIC',
    'Spațiu'
  ];

  if (anexa1Sectors.includes(answers.sector)) {
    if (answers.size === 'Întreprindere mare' || answers.size === 'Întreprindere mijlocie') {
      return {
        category: "Entitate esențială",
        reference: `Art. 5 alin. (2) și Anexa 1 - Sectorul ${answers.sector} din OUG 155/2024`,
        explanation: `Entitate din sectorul ${answers.sector} care îndeplinește criteriile de dimensiune`,
        obligations: [
          "Notificare în 30 zile (Art. 18)",
          "Măsuri de securitate conform sector (Art. 11-14)",
          "Raportare incidente (Art. 15)",
          "Audit de securitate (Art. 11)",
          "Autoevaluare anuală (Art. 12)"
        ],
        documents: [
          "Notificare către DNSC",
          "Politica de securitate cibernetică specifică sectorului",
          "Plan de răspuns la incidente",
          "Proceduri operaționale specifice",
          "Raport de audit",
          "Raport de autoevaluare"
        ]
      };
    }
  }

  // 4. Verificare sector sănătate (caz special din Anexa 1)
  if (answers.sector === 'Sănătate') {
    if (answers.size === 'Întreprindere mare') {
      return {
        category: "Entitate esențială",
        reference: "Art. 5 și Anexa 1 - Sectorul Sănătății din OUG 155/2024",
        explanation: "Entitate din sectorul sănătății care îndeplinește criteriile de dimensiune",
        obligations: [
          "Notificare în 30 zile (Art. 18)",
          "Măsuri tehnice și organizatorice de securitate (Art. 11-14)",
          "Raportare incidente în 24h (Art. 15)",
          "Audit periodic de securitate (Art. 11)",
          "Autoevaluare anuală (Art. 12)"
        ],
        documents: [
          "Notificare către DNSC",
          "Politica de securitate cibernetică",
          "Plan de răspuns la incidente",
          "Proceduri operaționale de securitate",
          "Raport de audit",
          "Raport de autoevaluare"
        ]
      };
    }
  }

  // 5. Verificare pentru sectoarele din Anexa 2
  const anexa2Sectors = [
    'Servicii poștale și de curierat',
    'Gestionarea deșeurilor',
    'Producția și distribuția de substanțe chimice',
    'Producția și distribuția de alimente',
    'Fabricare',
    'Furnizori digitali'
  ];

  if (anexa2Sectors.includes(answers.sector) && answers.size === 'Întreprindere mare') {
    return {
      category: "Entitate importantă",
      reference: `Art. 6 și Anexa 2 - Sectorul ${answers.sector} din OUG 155/2024`,
      explanation: `Entitate din sectorul ${answers.sector} care îndeplinește criteriile de dimensiune`,
      obligations: [
        "Notificare în 30 zile (Art. 18)",
        "Măsuri de securitate de bază (Art. 11)",
        "Raportare incidente majore (Art. 15)",
        "Autoevaluare periodică"
      ],
      documents: [
        "Notificare către DNSC",
        "Politica de securitate de bază",
        "Proceduri de raportare incidente",
        "Document de autoevaluare"
      ]
    };
  }

  // 6. Răspuns default pentru entități care nu se încadrează
  return {
    category: "Nu se încadrează în prevederile OUG 155/2024",
    reference: "Nu este cazul",
    explanation: "Entitatea nu îndeplinește criteriile de încadrare ca entitate esențială sau importantă conform OUG 155/2024",
    obligations: ["Nu există obligații conform OUG 155/2024"],
    documents: ["Nu sunt necesare documente conform OUG 155/2024"]
  };
}
function generatePDF() {
  const result = determineCategory();
  
  const printWindow = window.open('', '', 'width=800,height=600');
  
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
      <div class="date">Data generării: ${new Date().toLocaleString('ro-RO')}</div>
      
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
          ${result.obligations.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <div class="section-title">Documente necesare:</div>
        <ul>
          ${result.documents.map(d => `<li>${d}</li>`).join('')}
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
  const container = document.getElementById('resultContainer');
  
  container.innerHTML = `
    <div class="result" id="resultPDF">
      <div class="result-header">${result.category}</div>
      <div class="result-section">
        <strong>Baza legală:</strong> ${result.reference
<div class="result-section">
        <strong>Baza legală:</strong> ${result.reference}
      </div>
      <div class="result-section">
        <strong>Motivul încadrării:</strong> ${result.explanation}
      </div>
      <div class="result-section">
        <strong>Obligații principale:</strong>
        <ul>
          ${result.obligations.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>
      <div class="result-section">
        <strong>Documente necesare:</strong>
        <ul>
          ${result.documents.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    </div>
    <button id="exportPDF" class="button">Exportă PDF</button>
  `;
  
  container.style.display = 'block';
  document.getElementById('questionContainer').style.display = 'none';
  document.getElementById('nextButton').style.display = 'none';
  document.getElementById('restartButton').style.display = 'block';
  
  document.getElementById('exportPDF').addEventListener('click', generatePDF);
}

// Event Listeners
document.getElementById('nextButton').addEventListener('click', () => {
  const selectedOption = document.querySelector(`input[name="${questions[currentStep].key}"]:checked`);
  
  if (!selectedOption) {
    alert('Vă rugăm să selectați o opțiune');
    return;
  }
  
  answers[questions[currentStep].key] = selectedOption.value;
  
  if (answers.sector === 'Sănătate' && currentStep === Object.keys(questions).length) {
    currentStep++;
    renderQuestion(currentStep);
  } else if (currentStep < Object.keys(questions).length) {
    currentStep++;
    renderQuestion(currentStep);
  } else {
    showResult();
  }
});

document.getElementById('restartButton').addEventListener('click', () => {
  currentStep = 1;
  answers = {};
  document.getElementById('resultContainer').style.display = 'none';
  document.getElementById('questionContainer').style.display = 'block';
  document.getElementById('nextButton').style.display = 'block';
  document.getElementById('restartButton').style.display = 'none';
  totalSteps = Object.keys(questions).length;
  updateProgress();
  renderQuestion(1);
});

// Start with first question
renderQuestion(1);
