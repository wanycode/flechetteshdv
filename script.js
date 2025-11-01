let players = [];

// Ajouter un joueur
document.getElementById("addPlayerBtn").addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();
  if (name && !players.includes(name)) {
    players.push(name);
    updatePlayerList();
    updatePlayerSelect();
    document.getElementById("playerName").value = "";
  } else {
    alert("Nom invalide ou déjà ajouté !");
  }
});

// Mettre à jour la liste des joueurs
function updatePlayerList() {
  const list = document.getElementById("playersList");
  list.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    list.appendChild(li);
  });
}

// Mettre à jour le select pour scores
function updatePlayerSelect() {
  const select = document.getElementById("playerSelect");
  select.innerHTML = "";
  players.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    select.appendChild(option);
  });
}

// Scores
let scores = {};

// Ajouter un score
document.getElementById("addScoreBtn").addEventListener("click", () => {
  const player = document.getElementById("playerSelect").value;
  const score = parseInt(document.getElementById("scoreInput").value);
  if (!player || isNaN(score)) return alert("Veuillez choisir un joueur et entrer un score correct.");

  if (!scores[player]) scores[player] = 0;
  scores[player] += score;

  updateRanking();
  document.getElementById("scoreInput").value = "";
});

// Mettre à jour le classement
function updateRanking() {
  const ranking = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";
  ranking.forEach(([player, score]) => {
    const li = document.createElement("li");
    li.textContent = `${player} - ${score} points`;
    rankingList.appendChild(li);
  });
}
// ----- Remplir les listes de joueurs -----
const selectJ1 = document.getElementById("joueur1");
const selectJ2 = document.getElementById("joueur2");
const allJoueurs = [...joueursA, ...joueursB];

allJoueurs.forEach(j => {
  const option1 = document.createElement("option");
  option1.value = j; option1.textContent = j;
  selectJ1.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = j; option2.textContent = j;
  selectJ2.appendChild(option2);
});

// ----- Commencer le match -----
const matchForm = document.getElementById("matchForm");
const compteur = document.getElementById("compteurMatch");
const matchTitre = document.getElementById("matchTitre");
const nomJ1 = document.getElementById("nomJ1");
const nomJ2 = document.getElementById("nomJ2");
const scoreJ1 = document.getElementById("scoreJ1");
const scoreJ2 = document.getElementById("scoreJ2");
const ptsJ1 = document.getElementById("ptsJ1");
const ptsJ2 = document.getElementById("ptsJ2");
let valJ1, valJ2, maxScore;

matchForm.addEventListener("submit", e => {
  e.preventDefault();
  const joueur1 = selectJ1.value;
  const joueur2 = selectJ2.value;
  if(joueur1 === joueur2) { alert("Choisis deux joueurs différents !"); return; }

  valJ1 = valJ2 = 0;
  maxScore = parseInt(document.getElementById("mode").value);

  nomJ1.textContent = joueur1;
  nomJ2.textContent = joueur2;
  scoreJ1.textContent = valJ1;
  scoreJ2.textContent = valJ2;
  matchTitre.textContent = `${joueur1} vs ${joueur2} (${maxScore})`;
  compteur.style.display = "block";
  matchForm.style.display = "none";
});

// ----- Ajouter points -----
document.getElementById("addJ1").addEventListener("click", () => {
  let pts = parseInt(ptsJ1.value) || 0;
  valJ1 += pts;
  if(valJ1 > maxScore) valJ1 = maxScore;
  scoreJ1.textContent = valJ1;
  ptsJ1.value = "";
});

document.getElementById("addJ2").addEventListener("click", () => {
  let pts = parseInt(ptsJ2.value) || 0;
  valJ2 += pts;
  if(valJ2 > maxScore) valJ2 = maxScore;
  scoreJ2.textContent = valJ2;
  ptsJ2.value = "";
});

// ----- Terminer le match -----
document.getElementById("finMatch").addEventListener("click", () => {
  let resultsList = document.getElementById("results-list");
  const li = document.createElement("li");
  let gagnant;
  if(valJ1 >= maxScore && valJ1 >= valJ2) gagnant = nomJ1.textContent;
  else if(valJ2 >= maxScore && valJ2 >= valJ1) gagnant = nomJ2.textContent;
  else gagnant = "Match incomplet";

  li.textContent = `${nomJ1.textContent} ${valJ1} - ${valJ2} ${nomJ2.textContent} → Gagnant: ${gagnant}`;
  resultsList.appendChild(li);

  // Reset pour nouveau match
  compteur.style.display = "none";
  matchForm.style.display = "block";
  ptsJ1.value = ptsJ2.value = "";
});
