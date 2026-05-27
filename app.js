// ============================================================
// VERSION
// ============================================================
const APP_VERSION = '1.5.4';

// ============================================================
// DONNÉES DES EXERCICES (tirées du PDF Kinatex)
// ============================================================
const EXERCISES = [
  {
    id: 'circ', categorie: 'couche', emoji: '〰️',
    nom: 'Exercices circulatoires',
    instructions: ['Placez un oreiller sous votre pied.', 'Pointez le pied et ramenez-le vers vous.', 'Vous pouvez aussi faire des cercles avec la cheville.'],
    image: 'images/ex-circulatoires.jpg'
  },
  {
    id: 'fess', categorie: 'couche', emoji: '💪',
    nom: 'Contraction isométrique des fessiers',
    instructions: ['Couchez-vous sur le dos avec les genoux fléchis.', 'Contractez les fesses le plus fort possible.', 'Tenez la contraction pendant 5-10 secondes.', 'Il ne devrait pas y avoir de mouvement.'],
    image: 'images/ex-fessiers.jpg'
  },
  {
    id: 'quad', categorie: 'couche', emoji: '🦵',
    nom: 'Contraction isométrique du quadricep',
    instructions: ['Contractez le muscle quadriceps contre le lit.', 'Faites comme si vous vouliez étendre votre genou.', 'Tenez la contraction pendant 5-10 secondes.', 'Il ne devrait pas y avoir de mouvement.'],
    image: 'images/ex-quadricep.jpg'
  },
  {
    id: 'isch', categorie: 'couche', emoji: '🦴',
    nom: 'Contraction isométrique de l\'ischio-jambier',
    instructions: ['Couchez-vous sur le dos, jambe opérée semi-fléchie.', 'Poussez le talon contre le lit comme pour plier le genou.', 'Tenez 5-10 secondes. Pas de mouvement visible.'],
    image: 'images/ex-ischio.jpg'
  },
  {
    id: 'trifl', categorie: 'couche', emoji: '↩️',
    nom: 'Triple flexion',
    instructions: ['Placez une serviette derrière votre cuisse.', 'Glissez le talon sur le lit comme pour plier le genou.', 'Utilisez la serviette pour aider le mouvement.'],
    image: 'images/ex-triple-flexion.jpg'
  },
  {
    id: 'abdh', categorie: 'couche', emoji: '↔️',
    nom: 'Abduction de la hanche',
    instructions: ['Couchez-vous sur le dos, jambes allongées.', 'Glissez votre talon vers l\'extérieur pour écarter la jambe.', 'Gardez les orteils pointés vers le plafond.'],
    image: 'images/ex-abduction.jpg'
  },
  {
    id: 'extc', categorie: 'couche', emoji: '⬆️',
    nom: 'Extension du genou',
    instructions: ['Placez une serviette roulée ou un coussin sous votre genou.', 'Décollez le talon du lit en contractant le quadriceps.', 'Faites comme si vous vouliez étendre votre genou.'],
    image: 'images/ex-extension-couche.jpg'
  },
  {
    id: 'slr', categorie: 'couche', emoji: '🦿',
    nom: 'Élévation de jambe tendue (SLR)',
    instructions: ['Levez la jambe du lit en gardant la jambe tendue.', 'Montez jusqu\'à 45 degrés.', 'Redescendez à la position initiale.'],
    image: 'images/ex-slr.jpg'
  },
  {
    id: 'flexa', categorie: 'assis', emoji: '🪑',
    nom: 'Flexion du genou (assis)',
    instructions: ['Asseyez-vous sur une chaise avec les pieds au sol.', 'Glissez le pied vers l\'arrière en pliant le genou.', 'Vous pouvez mettre une serviette sous le pied.', 'Tenez 5-10 secondes, puis reprenez la position initiale.'],
    image: 'images/ex-flexion-assis.jpg'
  },
  {
    id: 'exta', categorie: 'assis', emoji: '🦵',
    nom: 'Extension du genou (assis)',
    instructions: ['Asseyez-vous sur une chaise avec les pieds au sol.', 'Étendez votre genou pour le mettre droit.', 'Reprenez la position initiale.'],
    image: 'images/ex-extension-assis.jpg'
  },
  {
    id: 'squat', categorie: 'debout', emoji: '🏋️',
    nom: 'Mini-squat',
    instructions: ['Tenez-vous debout avec un objet stable devant vous.', 'Dos droit, pliez les genoux comme pour vous asseoir.', 'Reprenez la position initiale.'],
    image: 'images/ex-minisquat.jpg'
  },
  {
    id: 'flexh', categorie: 'debout', emoji: '🚶',
    nom: 'Flexion de hanche (debout)',
    instructions: ['Tenez-vous debout avec un objet stable devant vous.', 'Levez le genou vers le haut pour fléchir la hanche.', 'Recommencez l\'exercice avec l\'autre jambe.'],
    image: 'images/ex-flexion-hanche.jpg'
  },
  {
    id: 'flexd', categorie: 'debout', emoji: '↩️',
    nom: 'Flexion du genou (debout)',
    instructions: ['Tenez-vous debout avec un objet stable devant vous.', 'Pliez le genou en amenant le pied vers l\'arrière.', 'Ne pliez pas la hanche, seulement le genou.', 'Recommencez avec l\'autre jambe.'],
    image: 'images/ex-flexion-debout.jpg'
  }
];

// ============================================================
// ÉTAT
// ============================================================
let currentExercise = null;
let currentGraphTab = 'semaine';

// ============================================================
// STOCKAGE LOCAL
// ============================================================
function getData(key, defaut) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaut;
  } catch(e) { return defaut; }
}

function setData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getTodayProgress() {
  const all = getData('progress', {});
  return all[getTodayKey()] || { sessions: 0, exercises: {}, sessionExercises: [] };
}

function saveTodayProgress(prog) {
  const all = getData('progress', {});
  all[getTodayKey()] = prog;
  setData('progress', all);
}

// ============================================================
// INITIALISATION
// ============================================================
function init() {
  askOpDateIfNeeded();
  setTodayDate();
  setDaysSinceOp();
  checkMidnightReset();
  renderExerciseLists();
  updateSessionDots();
  updateSessionCount();
  renderGraphTab('semaine');
  renderStats();
  renderMedList();
  requestNotifPermission();       // ← ligne ajoutée
  scheduleMedNotifications();     // ← ligne ajoutée
  const versionEl = document.getElementById('app-version');
if (versionEl) versionEl.textContent = APP_VERSION;
}
function askOpDateIfNeeded() {
  const opDate = getData('op-date', null);
  if (!opDate) {
    const rep = prompt("Quelle est la date de votre opération?\n(Format: AAAA-MM-JJ, ex: 2026-05-06)");
    if (rep && rep.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setData('op-date', rep);
    }
  }
}

function checkMidnightReset() {
  // Vérifie si on est un nouveau jour — remet les exercices de la session en cours à zéro
  const lastSeen = getData('last-seen-date', null);
  const today = getTodayKey();
  if (lastSeen !== today) {
    setData('last-seen-date', today);
    // Les données du jour précédent restent dans progress[] pour les graphiques
    // On ne touche pas à l'historique, on crée juste un nouveau jour
  }
}

function setTodayDate() {
  const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const d = new Date();
  document.getElementById('today-date').textContent =
    jours[d.getDay()] + ' ' + d.getDate() + ' ' + mois[d.getMonth()] + ' ' + d.getFullYear();
}

function setDaysSinceOp() {
  const opDate = getData('op-date', null);
  if (!opDate) { document.getElementById('days-since-op').textContent = '?'; return; }
  const diff = Math.floor((new Date() - new Date(opDate)) / 86400000);
  document.getElementById('days-since-op').textContent = diff;
}

// ============================================================
// RENDU DES EXERCICES
// ============================================================
function renderExerciseLists() {
  const prog = getTodayProgress();
  ['couche','assis','debout'].forEach(cat => {
    const container = document.getElementById('list-' + cat);
    container.innerHTML = '';
    EXERCISES.filter(e => e.categorie === cat).forEach(ex => {
      const reps = prog.exercises[ex.id];
      const done = reps !== undefined;
      const card = document.createElement('div');
      card.className = 'exercise-card';
      card.innerHTML = `
        <div class="ex-cat-icon ${cat}">${ex.emoji}</div>
        <div class="ex-card-info">
          <div class="ex-card-name">${ex.nom}</div>
          <div class="ex-card-meta">10 rép. · 3-4×/jour</div>
        </div>
        <span class="ex-card-status ${done ? 'done' : 'pending'}">${done ? '✓ ' + reps + ' rép.' : 'À faire'}</span>
      `;
      card.onclick = () => openExercise(ex);
      container.appendChild(card);
    });
  });
  checkSessionComplete();
}

function checkSessionComplete() {
  const prog = getTodayProgress();
  const totalEx = EXERCISES.length;
  const doneEx = Object.keys(prog.exercises).length;
  const existing = document.getElementById('session-complete-banner');

  if (doneEx === totalEx && prog.sessions < 4) {
    if (!existing) {
      const banner = document.createElement('div');
      banner.id = 'session-complete-banner';
      banner.className = 'session-complete-banner';
      banner.innerHTML = `
        <div class="session-banner-text">
          <span class="session-banner-icon">🎉</span>
          <div>
            <div class="session-banner-title">Tous les exercices complétés!</div>
            <div class="session-banner-sub">Appuyez pour enregistrer la session ${prog.sessions + 1}</div>
          </div>
        </div>
        <button class="session-banner-btn" onclick="completeSession()">Terminer la session</button>
      `;
      const strip = document.querySelector('.sessions-strip');
      strip.parentNode.insertBefore(banner, strip.nextSibling);
    }
  } else {
    if (existing) existing.remove();
  }
}

function openExercise(ex) {
  currentExercise = ex;
  document.getElementById('ex-header-title').textContent = ex.nom;

  const img = document.getElementById('ex-image');
  const placeholder = document.getElementById('ex-image-placeholder');
  img.style.display = 'block';
  placeholder.style.display = 'none';
  img.src = ex.image;

  const instrBox = document.getElementById('ex-instr-box');
  instrBox.innerHTML = ex.instructions.map((s, i) =>
    `<div class="ex-instr-step">${i+1}. ${s}</div>`
  ).join('');

  document.getElementById('reps-select').value = '';
  document.getElementById('set-status').textContent = '';

  const prog = getTodayProgress();
  const reps = prog.exercises[ex.id];
  if (reps !== undefined) {
    document.getElementById('set-status').textContent = '✓ Dernier enregistrement : ' + reps + ' répétitions';
    document.getElementById('reps-select').value = reps;
  }

  showScreen('exercise');
}

// ============================================================
// CONFIRMATION D'UN SET
// ============================================================
function confirmSet() {
  const val = document.getElementById('reps-select').value;
  if (!val) { alert('Veuillez choisir le nombre de répétitions.'); return; }

  const prog = getTodayProgress();
  prog.exercises[currentExercise.id] = parseInt(val);
  saveTodayProgress(prog);

  const msg = parseInt(val) === 10
    ? '✓ Parfait ! 10 répétitions enregistrées.'
    : '✓ ' + val + ' répétitions enregistrées.';
  document.getElementById('set-status').textContent = msg;

  const btn = document.getElementById('confirm-set-btn');
  btn.style.background = '#2e7d32';
  btn.textContent = 'Enregistré ✓';
  setTimeout(() => {
    btn.style.background = '#1a73e8';
    btn.textContent = 'Enregistrer';
  }, 1500);
}

// ============================================================
// COMPLÉTION DE SESSION
// ============================================================
function completeSession() {
  const prog = getTodayProgress();
  if (prog.sessions >= 4) return;

  prog.sessions++;

  // Remet les exercices à zéro pour la prochaine session
  // mais garde l'historique dans sessionExercises
  if (!prog.sessionExercises) prog.sessionExercises = [];
  prog.sessionExercises.push({ ...prog.exercises, completedAt: new Date().toISOString() });
  prog.exercises = {};

  saveTodayProgress(prog);
  updateSessionDots();
  updateSessionCount();
  renderExerciseLists();
  showSessionSummary(prog.sessions);
}

function showSessionSummary(sessionNum) {
  const existing = document.getElementById('session-summary-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'session-summary-overlay';
  overlay.className = 'summary-overlay';
  overlay.innerHTML = `
    <div class="summary-card">
      <div class="summary-icon">🏆</div>
      <div class="summary-title">Session ${sessionNum} complétée!</div>
      <div class="summary-sub">${sessionNum < 4 ? 'Encore ' + (4 - sessionNum) + ' session(s) aujourd\'hui.' : 'Objectif du jour atteint! Excellent travail!'}</div>
      <div class="summary-stats">
        <div class="summary-stat"><span class="summary-stat-num">${EXERCISES.length}</span><span class="summary-stat-lbl">Exercices</span></div>
        <div class="summary-stat"><span class="summary-stat-num">${sessionNum}/4</span><span class="summary-stat-lbl">Sessions</span></div>
      </div>
      <button class="summary-close-btn" onclick="closeSummary()">Continuer</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeSummary() {
  const overlay = document.getElementById('session-summary-overlay');
  if (overlay) overlay.remove();
}

function updateSessionCount() {
  const prog = getTodayProgress();
  document.getElementById('sessions-done').textContent = prog.sessions;
}

function updateSessionDots() {
  const prog = getTodayProgress();
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('s' + i);
    if (i <= prog.sessions) {
      dot.classList.add('done');
      dot.querySelector('.s-icon').textContent = '✓';
    } else {
      dot.classList.remove('done');
      dot.querySelector('.s-icon').textContent = '○';
    }
  }
}

// ============================================================
// NAVIGATION
// ============================================================
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navMap = {
  home: 'nav-home',
  suivi: 'nav-suivi',
  med: 'nav-med',
  'med-form': 'nav-med',
  'med-confirm': 'nav-med', 
  'med-besoin': 'nav-med',
  reglages: 'nav-reglages'  
};
  if (navMap[name]) document.getElementById(navMap[name]).classList.add('active');
  if (name === 'home') { renderExerciseLists(); updateSessionDots(); updateSessionCount(); }
  if (name === 'suivi') { renderGraphTab(currentGraphTab); renderStats(); }
  if (name === 'med') renderMedList();
  if (name === 'med-form') showNotifInfoBox();
  if (name === 'reglages') renderReglages();  
  if (name === 'med') { renderMedList(); }
  if (name === 'med-confirm') { /* déjà géré dans openConfirmDose */ }
  window.scrollTo(0, 0);
}

// ============================================================
// GRAPHIQUES
// ============================================================
function switchGraphTab(tab) {
  currentGraphTab = tab;
  document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  renderGraphTab(tab);
}

function renderGraphTab(tab) {
  const area = document.getElementById('graph-area');
  if (tab === 'semaine') area.innerHTML = buildWeekGraph();
  else area.innerHTML = buildMonthGraph();
}

function buildWeekGraph() {
  const jours = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const progress = getData('progress', {});
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const bars = jours.map((j, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOfWeek + i);
    const key = d.toISOString().slice(0, 10);
    const sessions = (progress[key] || {}).sessions || 0;
    const pct = Math.round((sessions / 4) * 100);
    const cls = pct === 100 ? 'full' : pct > 0 ? 'partial' : 'empty';
    return `<div class="bar-col">
      <div class="bar-fill ${cls}" style="height:${Math.max(pct, 4)}%"></div>
      <div class="bar-day">${j}</div>
    </div>`;
  });
  return `<div class="graph-container">
    <div class="graph-title">Sessions complétées cette semaine</div>
    <div class="bar-chart">${bars.join('')}</div>
    <div class="graph-legend">
      <div class="legend-item"><div class="legend-dot" style="background:#1a73e8"></div> Complet (4/4)</div>
      <div class="legend-item"><div class="legend-dot" style="background:#90caf9"></div> Partiel</div>
      <div class="legend-item"><div class="legend-dot" style="background:#e0e0e0"></div> Aucune</div>
    </div>
  </div>`;
}

function buildMonthGraph() {
  const progress = getData('progress', {});
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  let cells = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
  ['L','M','M','J','V','S','D'].forEach(d => {
    cells += `<div style="font-size:9px;color:#9e9e9e;text-align:center;padding:2px 0;">${d}</div>`;
  });
  for (let i = 0; i < offset; i++) cells += '<div></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const key = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    const sessions = (progress[key] || {}).sessions || 0;
    const isToday = d === today.getDate();
    let bg = '#f5f5f5', color = '#9e9e9e', border = '';
    if (sessions === 4) { bg = '#1a73e8'; color = 'white'; }
    else if (sessions > 0) { bg = '#e8f4fd'; color = '#1a73e8'; }
    if (isToday) { border = 'border:1.5px solid #e65100;'; color = sessions > 0 ? color : '#e65100'; }
    cells += `<div style="background:${bg};${border}border-radius:4px;padding:4px 2px;text-align:center;font-size:9px;color:${color};font-weight:${isToday?'700':'400'}">${d}</div>`;
  }
  cells += '</div>';
  return `<div class="graph-container">
    <div class="graph-title">${mois[month]} ${year}</div>
    ${cells}
  </div>`;
}

function renderStats() {
  const progress = getData('progress', {});
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
  let weekTotal = 0;
  let weekDays = 0;
  for (let i = 0; i <= dayOfWeek; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOfWeek + i);
    const key = d.toISOString().slice(0, 10);
    const s = (progress[key] || {}).sessions || 0;
    weekTotal += s;
    weekDays++;
  }
  const maxWeek = weekDays * 4;
  const pct = maxWeek > 0 ? Math.round((weekTotal / maxWeek) * 100) : 0;
  const opDate = getData('op-date', null);
  const jPlus = opDate ? Math.floor((new Date() - new Date(opDate)) / 86400000) : '?';

  document.getElementById('stats-row').innerHTML = `
    <div class="stat-card"><div class="stat-num">${weekTotal}</div><div class="stat-lbl">Sessions cette semaine</div></div>
    <div class="stat-card"><div class="stat-num">${pct}%</div><div class="stat-lbl">Taux de complétion</div></div>
    <div class="stat-card"><div class="stat-num">J+${jPlus}</div><div class="stat-lbl">Depuis l'opération</div></div>
  `;
}
// ============================================================
// MÉDICATION
// ============================================================
let currentMedConfirm = null;
let currentMedTab = 'actif';

let currentMedType = 'fixe';
let currentBesoinMed = null;

function renderMedArchive() {
  const container = document.getElementById('med-archive-list');
  if (!container) return;
  const meds = getData('meds', []);
  const archived = meds.filter(m => m.archived);

  if (archived.length === 0) {
    container.innerHTML = '<div class="empty-state">Aucun médicament archivé.</div>';
    return;
  }

  const doses = getData('doses', {});
  const mois = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];

  container.innerHTML = archived.map(m => {
    // Calcule les stats globales
    let totalPrises = 0;
    let totalAttendues = 0;
    Object.entries(doses).forEach(([day, dayData]) => {
      const medDoses = dayData[String(m.id)] || dayData[m.id] || {};
      const prises = Object.values(medDoses);
      totalPrises += prises.length;
      if (m.type !== 'besoin' && m.time && m.interval) {
        const slots = [];
        let t = new Date(day + 'T' + m.time + ':00');
        while (slots.length <= 6) {
          if (t.toISOString().slice(0,10) !== day) break;
          slots.push(t);
          t = new Date(t.getTime() + m.interval * 3600000);
        }
        totalAttendues += slots.length;
      }
    });

    const taux = totalAttendues > 0
      ? Math.round((totalPrises / totalAttendues) * 100)
      : null;

    const endDateTxt = m.endDate
      ? (() => { const d = new Date(m.endDate + 'T12:00:00'); return d.getDate() + ' ' + mois[d.getMonth()] + ' ' + d.getFullYear(); })()
      : 'Non définie';

    return `<div class="med-card archived-card">
      <div class="med-card-top">
        <div class="med-icon-circle" style="background:#f5f5f5;opacity:0.7;">
          ${m.type === 'besoin' ? '⚡' : '💊'}
        </div>
        <div style="flex:1;">
          <div class="med-name-txt" style="color:#9e9e9e;">${m.name}
            <span class="archive-badge">Archivé</span>
          </div>
          <div class="med-dose-txt">
            ${m.type === 'besoin' ? 'Au besoin' : 'Toutes les ' + m.interval + 'h'}
            ${m.note ? ' · ' + m.note : ''}
          </div>
          <div class="med-dose-txt">Fin : ${endDateTxt}</div>
        </div>
        <button class="settings-btn" onclick="restoreMed(${m.id})">Restaurer</button>
      </div>
      <div class="archive-stats-row">
        <div class="archive-stat">
          <span class="archive-stat-num">${totalPrises}</span>
          <span class="archive-stat-lbl">Prises totales</span>
        </div>
        ${taux !== null ? `<div class="archive-stat">
          <span class="archive-stat-num">${taux}%</span>
          <span class="archive-stat-lbl">Taux d'adhérence</span>
        </div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function restoreMed(id) {
  if (!confirm('Restaurer ce médicament dans les actifs?')) return;
  const meds = getData('meds', []);
  const med = meds.find(m => m.id === id);
  if (med) {
    med.archived = false;
    med.endDate = null;
    setData('meds', meds);
    renderMedArchive();
  }
}

function selectMedType(type) {
  currentMedType = type;
  document.getElementById('type-btn-fixe').classList.toggle('active', type === 'fixe');
  document.getElementById('type-btn-besoin').classList.toggle('active', type === 'besoin');
  document.getElementById('form-fixe-fields').style.display = type === 'fixe' ? 'block' : 'none';
  document.getElementById('form-besoin-fields').style.display = type === 'besoin' ? 'block' : 'none';
  document.getElementById('med-notif').closest('.form-group').style.display = type === 'fixe' ? 'block' : 'none';
}

function switchMedTab(tab) {
  currentMedTab = tab;
  document.querySelectorAll('.med-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('medtab-' + tab).classList.add('active');
  document.getElementById('medview-actif').style.display = tab === 'actif' ? 'block' : 'none';
  document.getElementById('medview-historique').style.display = tab === 'historique' ? 'block' : 'none';
  document.getElementById('medview-archive').style.display = tab === 'archive' ? 'block' : 'none';
  if (tab === 'historique') renderMedHistory();
  if (tab === 'archive') renderMedArchive();
}

function showNotifInfoBox() {
  const box = document.getElementById('notif-info-box');
  if (!box) return;
  if (!('Notification' in window)) {
    box.innerHTML = '<div class="notif-warn">⚠️ Notifications non supportées sur ce navigateur.</div>';
  } else if (Notification.permission === 'granted') {
    box.innerHTML = '<div class="notif-ok">✅ Notifications activées.</div>';
  } else if (Notification.permission === 'denied') {
    box.innerHTML = '<div class="notif-warn">⚠️ Notifications bloquées dans les réglages Chrome.</div>';
  } else {
    box.innerHTML = '<div class="notif-ok">🔔 Les notifications seront demandées à l\'enregistrement.</div>';
  }
}

function saveMed() {
  const name = document.getElementById('med-name').value.trim();
  if (!name) { alert('Veuillez entrer le nom du médicament.'); return; }

  const type = currentMedType;
  const meds = getData('meds', []);

  const med = {
    id: Date.now(),
    name: name,
    type: type,
    note: document.getElementById('med-note').value.trim(),
    endDate: document.getElementById('med-end-date').value || null,
    archived: false
  };

  if (type === 'fixe') {
    med.time = document.getElementById('med-time').value;
    med.interval = parseInt(document.getElementById('med-interval').value);
    med.notif = parseInt(document.getElementById('med-notif').value);
  } else {
    med.interval = parseInt(document.getElementById('med-interval-besoin').value);
    med.maxDoses = parseInt(document.getElementById('med-max-doses').value);
    med.notif = 0;
  }

  meds.push(med);
  setData('meds', meds);

  // Reset formulaire
  document.getElementById('med-name').value = '';
  document.getElementById('med-note').value = '';
  document.getElementById('med-end-date').value = '';
  selectMedType('fixe');
  scheduleMedNotifications();
  showScreen('med');
}

function deleteMed(id) {
  if (!confirm('Supprimer ce médicament?')) return;
  const meds = getData('meds', []).filter(m => m.id !== id);
  setData('meds', meds);
  renderMedList();
}

function renderMedList() {
  const today = getTodayKey();
  const meds = getData('meds', []);

  // Archivage automatique si date de fin dépassée
  let updated = false;
  meds.forEach(m => {
    if (m.endDate && m.endDate < today && !m.archived) {
      m.archived = true;
      updated = true;
    }
  });
  if (updated) setData('meds', meds);

  const actifs = meds.filter(m => !m.archived && m.type !== 'besoin');
  const besoin = meds.filter(m => !m.archived && m.type === 'besoin');
  console.log('Actifs:', actifs.length, 'Besoin:', besoin.length);

  // Médicaments horaire fixe
  const container = document.getElementById('med-list');
  if (container) {
    if (actifs.length === 0) {
      container.innerHTML = '<div class="empty-state">Aucun médicament à horaire fixe.<br>Appuyez sur + Ajouter pour commencer.</div>';
    } else {
      container.innerHTML = actifs.map(m => {
        const slots = buildMedSlots(m);
        const endBadge = m.endDate ? `<span class="end-date-badge">Fin : ${formatDate(m.endDate)}</span>` : '';
        return `<div class="med-card">
          <div class="med-card-top">
            <div class="med-icon-circle">💊</div>
            <div style="flex:1;">
              <div class="med-name-txt">${m.name} ${endBadge}</div>
              <div class="med-dose-txt">Toutes les ${m.interval}h${m.note ? ' · ' + m.note : ''}</div>
            </div>
            <button class="med-delete-btn" onclick="deleteMed(${m.id})">🗑️</button>
          </div>
          <div class="med-slots-list">${slots}</div>
          <div class="med-notif-row">
            <span>🔔</span><span>Rappel activé</span>
            <span class="notif-pill">${m.notif === 0 ? 'À l\'heure exacte' : m.notif + ' min avant'}</span>
          </div>
        </div>`;
      }).join('');
    }
  }

  // Médicaments au besoin
  const besoinContainer = document.getElementById('med-besoin-list');
  if (besoinContainer) {
    if (besoin.length === 0) {
      besoinContainer.innerHTML = '';
    } else {
      besoinContainer.innerHTML = `
        <div class="med-section-divider">⚡ Au besoin</div>
        ${besoin.map(m => buildBesoinCard(m)).join('')}
      `;
    }
  }
}

function buildBesoinCard(m) {
  const today = getTodayKey();
  const doses = getData('doses', {});
  const todayDoses = (doses[today] || {})[String(m.id)] || {};
  const prises = Object.values(todayDoses);
  const count = prises.length;
  const maxDoses = m.maxDoses || 4;

  // Dernière prise
  let lastPrise = null;
  if (count > 0) {
    const sorted = prises.sort((a, b) => a.takenAt.localeCompare(b.takenAt));
    lastPrise = sorted[sorted.length - 1];
  }

  // Temps depuis dernière prise
  let statusHtml = '';
  let canTake = true;
  if (lastPrise) {
    const [lh, lm] = lastPrise.takenAt.split(':').map(Number);
    const lastTime = new Date();
    lastTime.setHours(lh, lm, 0, 0);
    const diffMin = Math.round((new Date() - lastTime) / 60000);
    const intervalMin = m.interval * 60;
    const remaining = intervalMin - diffMin;
    if (remaining > 0) {
      canTake = false;
      const remH = Math.floor(remaining / 60);
      const remM = remaining % 60;
      const remStr = remH > 0 ? remH + 'h' + String(remM).padStart(2,'0') : remM + ' min';
      statusHtml = `<div class="besoin-next">⏳ Prochaine prise dans ${remStr}</div>`;
    } else {
      statusHtml = `<div class="besoin-ok">✅ Peut être pris maintenant</div>`;
    }
  }

  const endBadge = m.endDate ? `<span class="end-date-badge">Fin : ${formatDate(m.endDate)}</span>` : '';
  const prisesHtml = prises.length > 0
    ? prises.map(p => `<span class="time-pill taken">✓ ${p.takenAt}</span>`).join('')
    : '<span style="font-size:12px;color:#9e9e9e;">Aucune prise aujourd\'hui</span>';

  return `<div class="med-card">
    <div class="med-card-top">
      <div class="med-icon-circle" style="background:#f3e5f5;">⚡</div>
      <div style="flex:1;">
        <div class="med-name-txt">${m.name} <span class="besoin-badge">Au besoin</span> ${endBadge}</div>
        <div class="med-dose-txt">Intervalle min. ${m.interval}h · Max ${maxDoses}/jour${m.note ? ' · ' + m.note : ''}</div>
      </div>
      <button class="med-delete-btn" onclick="deleteMed(${m.id})">🗑️</button>
    </div>
    <div class="besoin-prises-row">${prisesHtml}</div>
    ${statusHtml}
    <div class="besoin-count-row">
      <span class="besoin-count ${count >= maxDoses ? 'at-max' : ''}">${count} / ${maxDoses} prises aujourd'hui</span>
      <button class="slot-confirm-btn ${count >= maxDoses ? 'disabled' : ''}"
        onclick="openBesoinDose(${m.id})">
        ⚡ Prendre maintenant
      </button>
    </div>
  </div>`;
}

function openBesoinDose(medId) {
  const meds = getData('meds', []);
  const med = meds.find(m => m.id === medId);
  if (!med) return;

  const today = getTodayKey();
  const doses = getData('doses', {});
  const todayDoses = (doses[today] || {})[String(medId)] || {};
  const prises = Object.values(todayDoses);
  const count = prises.length;
  const maxDoses = med.maxDoses || 4;

  currentBesoinMed = med;

  document.getElementById('besoin-med-name').textContent = med.name;
  document.getElementById('besoin-med-dose').textContent =
    'Intervalle minimum : ' + med.interval + 'h · Maximum : ' + maxDoses + ' prises/jour';

  const now = new Date();
  document.getElementById('besoin-med-time').value =
    now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  document.getElementById('besoin-med-note').value = '';

  // Vérification intervalle
  let statusHtml = '';
  if (count >= maxDoses) {
    statusHtml = `<div class="besoin-warning">⚠️ Maximum de ${maxDoses} prises atteint pour aujourd'hui.</div>`;
  } else if (prises.length > 0) {
    const sorted = prises.sort((a, b) => a.takenAt.localeCompare(b.takenAt));
    const last = sorted[sorted.length - 1];
    const [lh, lm] = last.takenAt.split(':').map(Number);
    const lastTime = new Date(); lastTime.setHours(lh, lm, 0, 0);
    const diffMin = Math.round((new Date() - lastTime) / 60000);
    const intervalMin = med.interval * 60;
    const remaining = intervalMin - diffMin;
    if (remaining > 0) {
      const remH = Math.floor(remaining / 60);
      const remM = remaining % 60;
      const remStr = remH > 0 ? remH + 'h' + String(remM).padStart(2,'0') : remM + ' min';
      statusHtml = `<div class="besoin-warning">⚠️ Intervalle non respecté — prochaine dose recommandée dans ${remStr}.<br>Vous pouvez quand même enregistrer la prise.</div>`;
    } else {
      statusHtml = `<div class="besoin-ok">✅ Intervalle respecté — peut être pris maintenant.</div>`;
    }
  } else {
    statusHtml = `<div class="besoin-ok">✅ Première prise du jour.</div>`;
  }
  document.getElementById('besoin-status-box').innerHTML = statusHtml;
  showScreen('med-besoin');
}

function saveBesoinDose() {
  if (!currentBesoinMed) return;
  const takenAt = document.getElementById('besoin-med-time').value;
  const note = document.getElementById('besoin-med-note').value.trim();
  if (!takenAt) { alert('Veuillez entrer l\'heure de la prise.'); return; }

  const today = getTodayKey();
  const doses = getData('doses', {});
  if (!doses[today]) doses[today] = {};
  const medKey = String(currentBesoinMed.id);
  if (!doses[today][medKey]) doses[today][medKey] = {};

  // Clé unique par prise (timestamp)
  const doseKey = 'besoin_' + Date.now();
  doses[today][medKey][doseKey] = {
    takenAt: takenAt,
    note: note,
    type: 'besoin',
    confirmedAt: new Date().toISOString()
  };
  setData('doses', doses);
  currentBesoinMed = null;
  showScreen('med');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const mois = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  return d.getDate() + ' ' + mois[d.getMonth()];
}

function buildMedSlots(med) {
  const now = new Date();
  const today = getTodayKey();
  const doses = getData('doses', {});
  const todayDoses = doses[today] || {};
  const medDoses = todayDoses[String(med.id)] || todayDoses[med.id] || todayDoses[Number(med.id)] || {};

  const [h, min] = med.time.split(':').map(Number);
  const start = new Date();
  start.setHours(h, min, 0, 0);

  const slots = [];
  let t = new Date(start);
  while (slots.length <= 6) {
    if (t.getDate() !== start.getDate()) break;
    slots.push(new Date(t));
    t = new Date(t.getTime() + med.interval * 3600000);
  }

  return slots.map((slot, i) => {
    const slotKey = slot.getHours().toString().padStart(2,'0') + ':' + slot.getMinutes().toString().padStart(2,'0');
    const doseRecord = medDoses[slotKey];
    const isPast = slot < now;
    const isNext = !doseRecord && isPast === false && slots.slice(0, i).every((s, j) => {
      const k = s.getHours().toString().padStart(2,'0') + ':' + s.getMinutes().toString().padStart(2,'0');
      return medDoses[k];
    });

    if (doseRecord) {
      // Prise confirmée
      const ecartMin = Math.round((new Date('1970-01-01T' + doseRecord.takenAt + ':00') - new Date('1970-01-01T' + slotKey + ':00')) / 60000);
      const ecartTxt = ecartMin === 0 ? 'À l\'heure' : ecartMin > 0 ? '+' + ecartMin + ' min' : ecartMin + ' min';
      const ecartCls = Math.abs(ecartMin) <= 15 ? 'ecart-ok' : Math.abs(ecartMin) <= 30 ? 'ecart-warn' : 'ecart-late';
      return `<div class="med-slot confirmed">
        <div class="slot-time-col">
          <span class="slot-time">${slotKey}</span>
          <span class="slot-status-badge confirmed">✓ Pris</span>
        </div>
        <div class="slot-detail">
          <span class="slot-taken-time">Pris à ${doseRecord.takenAt}</span>
          <span class="slot-ecart ${ecartCls}">${ecartTxt}</span>
        </div>
      </div>`;
    } else if (isPast) {
      // Manquée ou en retard
      return `<div class="med-slot missed">
        <div class="slot-time-col">
          <span class="slot-time">${slotKey}</span>
          <span class="slot-status-badge missed">En retard</span>
        </div>
        <button class="slot-confirm-btn" onclick="openConfirmDose(${med.id}, '${slotKey}', '${med.name}', '${med.interval}h')">
          Confirmer la prise
        </button>
      </div>`;
    } else {
      // À venir
      const diffMin = Math.round((slot - now) / 60000);
      const diffTxt = diffMin < 60 ? 'Dans ' + diffMin + ' min' : 'Dans ' + Math.round(diffMin/60) + 'h';
      return `<div class="med-slot upcoming">
        <div class="slot-time-col">
          <span class="slot-time">${slotKey}</span>
          <span class="slot-status-badge upcoming">${diffTxt}</span>
        </div>
        <button class="slot-confirm-btn" onclick="openConfirmDose(${med.id}, '${slotKey}', '${med.name}', '${med.interval}h')">
          Confirmer la prise
        </button>
      </div>`;
    }
  }).join('');
}

function openConfirmDose(medId, scheduledTime, medName, dose) {
  currentMedConfirm = { medId, scheduledTime };
  document.getElementById('confirm-med-name').textContent = medName;
  document.getElementById('confirm-med-dose').textContent = 'Dose prévue à ' + scheduledTime + ' · toutes les ' + dose;
  document.getElementById('confirm-scheduled-time').textContent = scheduledTime;

  // Pré-remplir avec l'heure actuelle
  const now = new Date();
  const nowStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  document.getElementById('confirm-med-time').value = nowStr;
  document.getElementById('confirm-med-note').value = '';

  updateEcartDisplay();
  document.getElementById('confirm-med-time').addEventListener('input', updateEcartDisplay);
  showScreen('med-confirm');
}

function updateEcartDisplay() {
  const scheduled = document.getElementById('confirm-scheduled-time').textContent;
  const taken = document.getElementById('confirm-med-time').value;
  if (!taken) return;
  const [sh, sm] = scheduled.split(':').map(Number);
  const [th, tm] = taken.split(':').map(Number);
  const ecartMin = (th * 60 + tm) - (sh * 60 + sm);
  const ecartTxt = ecartMin === 0 ? '✅ À l\'heure exacte'
    : ecartMin > 0 ? '⏰ ' + ecartMin + ' min de retard'
    : '⏰ ' + Math.abs(ecartMin) + ' min en avance';
  const ecartCls = Math.abs(ecartMin) <= 15 ? 'ecart-ok' : Math.abs(ecartMin) <= 30 ? 'ecart-warn' : 'ecart-late';
  const box = document.getElementById('confirm-ecart');
  box.textContent = ecartTxt;
  box.className = 'confirm-ecart ' + ecartCls;
}

function saveConfirmedDose() {
  if (!currentMedConfirm) return;
  const takenAt = document.getElementById('confirm-med-time').value;
  const note = document.getElementById('confirm-med-note').value.trim();
  if (!takenAt) { alert('Veuillez entrer l\'heure de la prise.'); return; }

  const today = getTodayKey();
  const doses = getData('doses', {});
  if (!doses[today]) doses[today] = {};
  const medKey = String(currentMedConfirm.medId);
  if (!doses[today][medKey]) doses[today][medKey] = {};
  doses[today][medKey][currentMedConfirm.scheduledTime] = {
    takenAt: takenAt,
    note: note,
    confirmedAt: new Date().toISOString()
  };
  setData('doses', doses);
  currentMedConfirm = null;
  showScreen('med');
}

// ============================================================
// HISTORIQUE MÉDICATION
// ============================================================
function renderMedHistory() {
  const container = document.getElementById('med-history-content');
  if (!container) return;
  const meds = getData('meds', []);
  const doses = getData('doses', {});

  if (meds.length === 0) {
    container.innerHTML = '<div class="empty-state">Aucun médicament enregistré.</div>';
    return;
  }

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const jours = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const mois = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];

  let html = '';

  meds.forEach(med => {
    const medIdStr = String(med.id);
    const medIdNum = Number(med.id);

    html += `<div class="hist-med-title">💊 ${med.name}</div>`;
    html += `<div class="hist-table-wrap"><table class="hist-table">
      <thead><tr>
        <th>Jour</th><th>Prévue</th><th>Réelle</th><th>Écart</th>
      </tr></thead><tbody>`;

    let hasData = false;

    days.forEach(day => {
      const dayData = doses[day] || {};
      const dayDoses = dayData[medIdStr] || dayData[medIdNum] || dayData[med.id] || {};
      const d = new Date(day + 'T12:00:00');
      const dayLabel = jours[d.getDay()] + ' ' + d.getDate() + ' ' + mois[d.getMonth()];
      const isToday = day === getTodayKey();

      // Médicaments horaire fixe
      if (med.type !== 'besoin' && med.time) {
        const slots = [];
        let t = new Date(day + 'T' + med.time + ':00');
        while (slots.length <= 6) {
          if (t.toISOString().slice(0, 10) !== day) break;
          slots.push(t.getHours().toString().padStart(2,'0') + ':' + t.getMinutes().toString().padStart(2,'0'));
          t = new Date(t.getTime() + med.interval * 3600000);
        }

        slots.forEach((slot, i) => {
          const record = dayDoses[slot];
          const slotDate = new Date(day + 'T' + slot + ':00');
          const isPast = slotDate < new Date();

          let reelle = '—', ecart = '—', rowCls = '';

          if (record) {
            reelle = record.takenAt;
            const [sh, sm] = slot.split(':').map(Number);
            const [th, tm] = record.takenAt.split(':').map(Number);
            const ecartMin = (th * 60 + tm) - (sh * 60 + sm);
            ecart = ecartMin === 0 ? 'À l\'heure' : ecartMin > 0 ? '+' + ecartMin + ' min' : ecartMin + ' min';
            rowCls = Math.abs(ecartMin) <= 15 ? 'row-ok' : Math.abs(ecartMin) <= 30 ? 'row-warn' : 'row-late';
            hasData = true;
          } else if (isPast) {
            reelle = '✗ Manquée';
            rowCls = 'row-missed';
            if (!isToday) hasData = true;
          } else {
            reelle = '⏳ À venir';
            rowCls = 'row-upcoming';
          }

          html += `<tr class="${rowCls}">
            <td>${i === 0 ? dayLabel : ''}</td>
            <td>${slot}</td>
            <td>${reelle}</td>
            <td>${ecart}</td>
          </tr>`;
        });
      }

      // Prises au besoin
      const besoinPrises = Object.entries(dayDoses).filter(([k]) => k.startsWith('besoin_'));
      besoinPrises.forEach(([key, record]) => {
        html += `<tr class="row-ok">
          <td>${dayLabel}</td>
          <td>⚡ Au besoin</td>
          <td>${record.takenAt}</td>
          <td>${record.note || '—'}</td>
        </tr>`;
        hasData = true;
      });

    }); // fin days.forEach

    if (!hasData) {
      html += `<tr><td colspan="4" style="text-align:center;color:#9e9e9e;padding:12px;">Aucune donnée pour les 7 derniers jours</td></tr>`;
    }

    html += `</tbody></table></div>`;

  }); // fin meds.forEach

  container.innerHTML = html;
}
// ============================================================
// RÉGLAGES
// ============================================================
function renderReglages() {
  const opDate = getData('op-date', null);
  const el = document.getElementById('settings-op-date');
  if (!el) return;
  if (opDate) {
    const d = new Date(opDate);
    const mois = ['janvier','février','mars','avril','mai','juin',
      'juillet','août','septembre','octobre','novembre','décembre'];
    const diff = Math.floor((new Date() - d) / 86400000);
    el.textContent = d.getDate() + ' ' + mois[d.getMonth()] + ' ' + d.getFullYear() + ' (J+' + diff + ')';
  } else {
    el.textContent = 'Non définie';
  }
}

function changeOpDate() {
  const actuelle = getData('op-date', '');
  const rep = prompt(
    "Entrez la nouvelle date d'opération\n(Format: AAAA-MM-JJ, ex: 2026-05-06)",
    actuelle
  );
  if (rep && rep.match(/^\d{4}-\d{2}-\d{2}$/)) {
    setData('op-date', rep);
    setDaysSinceOp();
    renderReglages();
    alert('✅ Date mise à jour : ' + rep);
  } else if (rep !== null) {
    alert('Format invalide. Utilisez AAAA-MM-JJ');
  }
}

function resetToday() {
  if (!confirm('Remettre à zéro les sessions et exercices d\'aujourd\'hui?')) return;
  const all = getData('progress', {});
  delete all[getTodayKey()];
  setData('progress', all);
  updateSessionDots();
  updateSessionCount();
  renderExerciseLists();
  alert('✅ Journée réinitialisée.');
}

function resetAllData() {
  if (!confirm('⚠️ Effacer TOUT l\'historique de progression?\nCette action est irréversible.')) return;
  if (!confirm('Êtes-vous certain? Toutes les données seront perdues.')) return;
  localStorage.removeItem('progress');
  localStorage.removeItem('last-seen-date');
  updateSessionDots();
  updateSessionCount();
  renderExerciseLists();
  renderGraphTab(currentGraphTab);
  renderStats();
  alert('✅ Historique effacé.');
}

// ============================================================
// DÉMARRAGE
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  init();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service Worker enregistré');
      // Vérifie les mises à jour à chaque chargement
      reg.update();
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            window.location.reload();
          }
        });
      });
    }).catch(e => console.log('SW erreur:', e));
  }
});

// ============================================================
// NOTIFICATIONS DE MÉDICATION
// ============================================================
function requestNotifPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        startNotifWatcher();
      }
    });
  } else if (Notification.permission === 'granted') {
    startNotifWatcher();
  }
}

function scheduleMedNotifications() {
  // Remplacé par startNotifWatcher()
}

// Vérifie toutes les minutes si une notification est due
function startNotifWatcher() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  // Vérification immédiate au démarrage
  checkMedNotifs();

  // Puis toutes les 60 secondes
  setInterval(checkMedNotifs, 60000);
}

function checkMedNotifs() {
  const meds = getData('meds', []);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = getTodayKey();
  const doses = getData('doses', {});
  const todayDoses = doses[today] || {};
  const fired = getData('notifs-fired', {});
  const todayFired = fired[today] || {};

  meds.forEach(m => {
  // Ignore les médicaments au besoin (pas d'horaire fixe)
    if (m.type === 'besoin' || !m.time) return;
    const [h, min] = m.time.split(':').map(Number);
    const start = new Date();
    start.setHours(h, min, 0, 0);
    let t = new Date(start);

    while (t.getDate() === start.getDate()) {
      const slotKey = t.getHours().toString().padStart(2,'0') + ':' + t.getMinutes().toString().padStart(2,'0');
      const notifMin = t.getHours() * 60 + t.getMinutes() - m.notif;
      const fireKey = m.id + '_' + slotKey;

      // Déjà envoyée aujourd'hui?
      if (!todayFired[fireKey]) {
        // Est-ce l'heure d'envoyer?
        if (nowMin >= notifMin && nowMin <= notifMin + 2) {
          // Pas encore prise?
          const medDoses = todayDoses[m.id] || {};
          if (!medDoses[slotKey]) {
            // Envoie la notification
            new Notification('💊 ' + m.name, {
              body: m.notif === 0
                ? 'Heure de prendre votre médicament.'
                : 'Dans ' + m.notif + ' min : heure de prendre votre médicament.',
              icon: '/images/icon-192.png',
              badge: '/images/icon-192.png',
              vibrate: [200, 100, 200],
              requireInteraction: true,
              tag: fireKey
            });

            // Marque comme envoyée
            todayFired[fireKey] = new Date().toISOString();
            fired[today] = todayFired;
            setData('notifs-fired', fired);
          }
        }
      }
      t = new Date(t.getTime() + m.interval * 3600000);
      if (t.getDate() !== start.getDate()) break;
    }
  });
}

function deleteMed(id) {
  if (!confirm('Supprimer ce médicament?')) return;
  const meds = getData('meds', []).filter(m => m.id !== id);
  setData('meds', meds);
  renderMedList();
}
