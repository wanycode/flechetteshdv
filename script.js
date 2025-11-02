// -------------------- INITIALISATION --------------------
let match = JSON.parse(localStorage.getItem("matchData") || "{}");

// Si aucun match en cours, redirige vers création
if(!match.joueurs){ window.location.href="nouveau-match.html"; }

let joueurTour = 0;
let multiplicateur = 1;
let pointsTour = 0;
let flechettesRestantes = 3;
let lastThrow = null; // pour annuler le dernier lancer

// -------------------- AFFICHAGE DES JOUEURS --------------------
const playersContainer = document.getElementById("playersContainer");

function createPlayerDivs(){
  playersContainer.innerHTML="";
  match.joueurs.forEach((j,i)=>{
    const div=document.createElement("div");
    div.className="player"+(i===joueurTour?" active":"");
    div.id="player"+i;
    div.innerHTML=`<h2>${j}</h2>
      <p id="score${i}">Score : ${match.scores[i]}</p>
      <p id="avg${i}">Moyenne : 0</p>`;
    playersContainer.appendChild(div);
  });
}

createPlayerDivs();

// -------------------- BOUTONS MULTIPLICATEURS --------------------
document.querySelectorAll(".mult-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    multiplicateur = parseInt(btn.dataset.mult);
    document.querySelectorAll(".mult-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// -------------------- BOUTONS SCORES --------------------
const scoreContainer = document.querySelector(".score-buttons");
for(let i=0;i<=20;i++){
  let b=document.createElement("button");
  b.textContent=i; b.dataset.score=i;
  scoreContainer.appendChild(b);
}
let b25=document.createElement("button"); b25.textContent="25"; b25.dataset.score=25;
scoreContainer.appendChild(b25);

document.querySelectorAll(".score-buttons button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    lancer(parseInt(btn.dataset.score));
  });
});

// -------------------- FONCTION LANCER --------------------
function lancer(score){
  const pts = score * multiplicateur;

  if(pts > match.scores[joueurTour]){
    // Si le score dépasse, on passe le tour
    flechettesRestantes = 0;
    updateDisplay();
    changerJoueur();
    return;
  }

  // Application du lancer
  match.scores[joueurTour] -= pts;
  const s = match.stats[joueurTour];
  s.pts += pts; s.lancers++;
  if(multiplicateur===2) s.doubles++; else if(multiplicateur===3) s.triples++;
  pointsTour += pts;
  flechettesRestantes--;

  // Stocke pour annuler
  lastThrow = { joueur: joueurTour, pts, mult: multiplicateur, reste: flechettesRestantes };

  updateDisplay();

  if(match.scores[joueurTour] === 0){
    // Set terminé dès qu'un joueur arrive à 0
    setTermine(joueurTour);
  } else if(flechettesRestantes===0){
    changerJoueur();
  }

  localStorage.setItem("matchData", JSON.stringify(match));
}

// -------------------- FONCTION CHANGER JOUEUR --------------------
function changerJoueur(){
  pointsTour = 0;
  flechettesRestantes = 3;
  joueurTour = (joueurTour +1) % match.joueurs.length;
  document.querySelectorAll(".player").forEach((p,i)=>p.classList.toggle("active", i===joueurTour));
  updateDisplay();
}

// -------------------- FONCTION SET TERMINÉ --------------------
function setTermine(gagnantIndex){
  match.setsWon[gagnantIndex]++;
  alert(`Set terminé ! ${match.joueurs[gagnantIndex]} remporte ce set.`);

  // Vérifie si un joueur a remporté la majorité des sets
  const majority = Math.ceil(match.sets/2);
  if(match.setsWon[gagnantIndex] >= majority){
    endMatch();
    return;
  }

  // Sinon on lance un nouveau set
  match.currentSet++;
  match.scores = match.joueurs.map(()=>match.mode);
  match.stats = match.joueurs.map(()=>({pts:0,lancers:0,doubles:0,triples:0}));
  joueurTour = 0; pointsTour = 0; flechettesRestantes = 3;
  createPlayerDivs();
  updateDisplay();
  alert(`Nouveau set : Set ${match.currentSet}/${match.sets}`);
}

// -------------------- FONCTION FIN DE MATCH --------------------
function endMatch(){
  let gagnant="", max=0;
  match.setsWon.forEach((s,i)=>{ if(s>max){ max=s; gagnant=match.joueurs[i]; }});
  localStorage.setItem("matchStats", JSON.stringify(match.stats.map((s,i)=>({...s, joueur:match.joueurs[i], scoreFinal:match.scores[i]}))));
  localStorage.setItem("gagnant", gagnant || "Égalité");
  window.location.href="fin_match.html";
}

// -------------------- FONCTION ANNULER LANCER --------------------
function undoLastThrow(){
  if(!lastThrow) return alert("Aucun lancer à annuler !");
  const { joueur, pts, mult, reste } = lastThrow;
  match.scores[joueur] += pts;
  const s = match.stats[joueur];
  s.pts -= pts; s.lancers--;
  if(mult===2) s.doubles--; else if(mult===3) s.triples--;
  joueurTour = joueur;
  pointsTour = pointsTour - pts < 0 ? 0 : pointsTour - pts;
  flechettesRestantes = reste +1 > 3 ? 3 : reste+1;
  lastThrow = null;
  document.querySelectorAll(".player").forEach((p,i)=>p.classList.toggle("active", i===joueurTour));
  updateDisplay();
  localStorage.setItem("matchData", JSON.stringify(match));
}

// -------------------- MISE À JOUR AFFICHAGE --------------------
function updateDisplay(){
  match.joueurs.forEach((j,i)=>{
    document.getElementById("score"+i).textContent = "Score : "+match.scores[i];
    const s = match.stats[i];
    document.getElementById("avg"+i).textContent = "Moyenne : "+(s.lancers?((s.pts/s.lancers)*3).toFixed(1):0);
  });
  document.getElementById("lancerInfo").textContent=`Points ce tour : ${pointsTour} | Fléchettes restantes : ${flechettesRestantes}`;
  document.getElementById("modeInfo").textContent=`Mode : ${match.mode} | Sortie : ${match.sortie} | Set : ${match.currentSet}/${match.sets}`;
}

// -------------------- BOUTONS GÉNÉRAUX --------------------
document.getElementById("resetMatch").addEventListener("click", ()=>{
  if(confirm("Voulez-vous vraiment annuler le match ?")){
    localStorage.removeItem("matchData");
    window.location.href="nouveau-match.html";
  }
});
