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
