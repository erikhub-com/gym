(function () {
  'use strict';
  var L = window.TrainLogic;
  var KEY = 'dschungel-gym-v1';
  var state = load();
  var tab = 'heute';
  var selDay = null;       // im Heute-Tab gewählter Tag
  var selEx = null;        // im Fortschritt-Tab gewählte Übung
  var openLog = null;      // im Verlauf aufgeklappter Eintrag
  var $ = function (s) { return document.querySelector(s); };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.plan && s.plan.days) {
          s.logs = s.logs || [];
          // Neuer Standardplan nur übernehmen, solange noch nichts gespeichert wurde
          if ((s.planVersion || 1) < window.DEFAULT_PLAN.version && s.logs.length === 0) {
            s.plan = clone(window.DEFAULT_PLAN); s.draft = null; s.lastDayId = null;
          }
          s.planVersion = window.DEFAULT_PLAN.version;
          return s;
        }
      }
    } catch (e) { /* ignorieren, Standard laden */ }
    return { plan: clone(window.DEFAULT_PLAN), planVersion: window.DEFAULT_PLAN.version, logs: [], lastDayId: null, draft: null };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast('Speichern fehlgeschlagen (Speicher voll?)'); }
  }
  function toast(msg, ms) {
    var t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, ms || 3200);
  }
  function dayById(id) { return state.plan.days.find(function (d) { return d.id === id; }); }
  function findEx(id) {
    for (var i = 0; i < state.plan.days.length; i++) {
      var e = state.plan.days[i].exercises.find(function (x) { return x.id === id; });
      if (e) return e;
    }
    return null;
  }
  function fmtDate(iso) {
    var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0];
  }

  // ---------- Entwurf (laufendes Training) ----------
  function ensureDraft(dayId) {
    if (state.draft && state.draft.dayId === dayId) return state.draft;
    var day = dayById(dayId);
    var d = { dayId: dayId, date: L.isoToday(), ex: {}, duration: '', kcal: '', note: '' };
    day.exercises.forEach(function (e) {
      var r = []; for (var i = 0; i < e.sets; i++) r.push('');
      d.ex[e.id] = { weight: e.weight, reps: r };
    });
    state.draft = d; save();
    return d;
  }

  // ---------- Rendering ----------
  function render() {
    document.querySelectorAll('.tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === tab); });
    var v = $('#view');
    if (tab === 'heute') v.innerHTML = viewHeute();
    else if (tab === 'verlauf') v.innerHTML = viewVerlauf();
    else if (tab === 'fortschritt') v.innerHTML = viewFortschritt();
    else v.innerHTML = viewPlan();
    var n = state.logs.length;
    $('#sub').textContent = n + (n === 1 ? ' Training' : ' Trainings') + ' gespeichert';
  }

  function viewHeute() {
    var days = state.plan.days;
    if (!days.length) return '<div class="empty">Kein Plan vorhanden. Unter „Plan" einen Tag anlegen.</div>';
    if (state.draft && selDay === null) selDay = state.draft.dayId;
    if (selDay === null || !dayById(selDay)) selDay = L.suggestDay(days, state.lastDayId);
    var day = dayById(selDay);
    var draft = ensureDraft(selDay);
    var h = '<div class="daypick">' + days.map(function (d) {
      return '<button data-day="' + d.id + '" class="' + (d.id === selDay ? 'on' : '') + '">Tag ' + d.id + ' ' + esc(d.emoji || '') + '</button>';
    }).join('') + '</div>';
    h += '<h2>' + esc(day.emoji || '') + ' Tag ' + day.id + ' – ' + esc(day.name) + '</h2>';
    if (selDay === L.suggestDay(days, state.lastDayId)) h += '<div class="muted">Als Nächstes dran</div>';
    if (day.warmup && day.warmup.length) {
      h += '<div class="card"><h3>Aufwärmen</h3><ul class="warm">' + day.warmup.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>';
    }
    day.exercises.forEach(function (e, idx) {
      var last = L.lastEntry(state.logs, e.id);
      var cur = draft.ex[e.id] || (draft.ex[e.id] = { weight: e.weight, reps: [] });
      while (cur.reps.length < e.sets) cur.reps.push('');
      var lastTxt = last ? ('Zuletzt (' + fmtDate(last.date) + '): ' + L.fmtKg(last.weight) + ' → ' + L.fmtReps(last.reps)) : 'Noch nicht trainiert';
      h += '<div class="card' + (e.pulley ? ' pulley' : '') + '" data-ex="' + esc(e.id) + '">' +
        '<div class="row spread"><h3>' + (idx + 1) + '. ' + esc(e.name) + (e.pulley ? '<span class="badge">Pulley</span>' : '') + '</h3></div>' +
        '<div class="goal">Ziel: <b>' + e.repMin + '–' + e.repMax + ' × ' + e.sets + '</b> bei <b>' + L.fmtKg(e.weight) + '</b>' +
        (e.step ? ' <span class="muted">→ bei ' + e.repMax + '/' + e.repMax + '/' + e.repMax + ' ' + L.fmtKg(L.round(e.weight + e.step)) + '</span>' : '') + '</div>' +
        '<div class="muted">' + esc(lastTxt) + '</div>' + (e.note ? '<div class="muted">💡 ' + esc(e.note) + '</div>' : '') +
        '<label class="f">Gewicht (kg)</label><input class="wgt" type="number" inputmode="decimal" step="0.25" data-w="' + esc(e.id) + '" value="' + esc(cur.weight) + '">' +
        '<div class="sets">' + cur.reps.map(function (r, i) {
          return '<input type="number" inputmode="decimal" step="0.5" placeholder="Satz ' + (i + 1) + '" data-r="' + esc(e.id) + '" data-i="' + i + '" value="' + esc(r) + '">';
        }).join('') + '</div></div>';
    });
    h += '<div class="card"><div class="grid2"><div><label class="f">Zeit (min)</label><input type="number" inputmode="numeric" data-meta="duration" value="' + esc(draft.duration) + '"></div>' +
      '<div><label class="f">Kalorien</label><input type="number" inputmode="numeric" data-meta="kcal" value="' + esc(draft.kcal) + '"></div></div>' +
      '<label class="f">Bemerkungen</label><textarea rows="2" data-meta="note">' + esc(draft.note) + '</textarea></div>';
    h += '<button class="btn" id="finish">✅ Training speichern</button>';
    h += '<button class="btn sec" id="discard">Eingaben leeren</button>';
    return h;
  }

  function viewVerlauf() {
    if (!state.logs.length) return '<div class="empty">Noch kein Training gespeichert.</div>';
    var logs = state.logs.slice().reverse();
    return '<h2>Verlauf</h2>' + logs.map(function (l) {
      var day = dayById(l.dayId);
      var title = day ? ('Tag ' + day.id + ' – ' + day.name) : ('Tag ' + l.dayId);
      var open = openLog === l.id;
      var body = '';
      if (open) {
        body = '<div style="margin-top:8px">' + Object.keys(l.exercises).map(function (id) {
          var e = l.exercises[id]; var ex = findEx(id);
          if (!e.reps.some(function (r) { return r !== '' && r !== null; })) return '';
          return '<div class="list-item"><span>' + esc(ex ? ex.name : (e.name || id)) + '</span><span>' + L.fmtKg(e.weight) + ' · ' + L.fmtReps(e.reps) + '</span></div>';
        }).join('') +
          (l.note ? '<p class="muted">💬 ' + esc(l.note) + '</p>' : '') +
          '<button class="small" data-del="' + l.id + '">Eintrag löschen</button></div>';
      }
      return '<div class="card" data-log="' + l.id + '"><div class="row spread"><b>' + esc(title) + '</b><span class="muted">' + fmtDate(l.date) + '</span></div>' +
        '<div class="muted">' + (l.duration ? l.duration + ' min' : '') + (l.duration && l.kcal ? ' · ' : '') + (l.kcal ? l.kcal + ' kcal' : '') + '</div>' + body + '</div>';
    }).join('');
  }

  function allExercises() {
    var out = [];
    state.plan.days.forEach(function (d) { d.exercises.forEach(function (e) { out.push({ day: d, ex: e }); }); });
    return out;
  }

  function viewFortschritt() {
    var all = allExercises();
    if (!all.length) return '<div class="empty">Keine Übungen im Plan.</div>';
    if (!selEx || !findEx(selEx)) selEx = all[0].ex.id;
    var opts = all.map(function (a) { return '<option value="' + esc(a.ex.id) + '"' + (a.ex.id === selEx ? ' selected' : '') + '>Tag ' + a.day.id + ' · ' + esc(a.ex.name) + '</option>'; }).join('');
    var s = L.series(state.logs, selEx);
    var h = '<h2>Fortschritt</h2><select id="exsel">' + opts + '</select>';
    if (s.length < 1) return h + '<div class="empty">Für diese Übung gibt es noch keine Einträge.</div>';
    var w = 300, hh = 130, pad = 22;
    var ws = s.map(function (p) { return p.weight; });
    var min = Math.min.apply(null, ws), max = Math.max.apply(null, ws);
    if (min === max) { min -= 1; max += 1; }
    var pts = s.map(function (p, i) {
      var x = s.length === 1 ? w / 2 : pad + i * ((w - 2 * pad) / (s.length - 1));
      var y = hh - pad - ((p.weight - min) / (max - min)) * (hh - 2 * pad);
      return { x: x, y: y, p: p };
    });
    var line = pts.map(function (q) { return q.x.toFixed(1) + ',' + q.y.toFixed(1); }).join(' ');
    h += '<div class="card"><svg class="chart" viewBox="0 0 ' + w + ' ' + hh + '" role="img" aria-label="Gewichtsverlauf">' +
      '<polyline fill="none" stroke="#b6e04a" stroke-width="2.5" points="' + line + '"/>' +
      pts.map(function (q) { return '<circle cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="4" fill="#b6e04a"/>'; }).join('') +
      '<text x="4" y="12" fill="#9fcfb3" font-size="10">' + L.fmtKg(max) + '</text><text x="4" y="' + (hh - 4) + '" fill="#9fcfb3" font-size="10">' + L.fmtKg(min) + '</text></svg></div>';
    h += '<div class="card">' + s.slice().reverse().map(function (p) {
      return '<div class="list-item"><span>' + fmtDate(p.date) + '</span><span>' + L.fmtKg(p.weight) + ' · ' + L.fmtReps(p.reps) + '</span></div>';
    }).join('') + '</div>';
    return h;
  }

  function viewPlan() {
    var h = '<h2>Plan</h2><p class="muted">Gewichte, Wiederholungen und Schrittweite pro Übung anpassen. Pulley-Übungen haben Startwerte, die du nach dem ersten Training korrigierst.</p>';
    state.plan.days.forEach(function (d) {
      h += '<div class="card"><div class="row spread"><b>' + esc(d.emoji || '') + ' Tag ' + d.id + ' – ' + esc(d.name) + '</b><button class="small" data-addex="' + d.id + '">+ Übung</button></div>';
      d.exercises.forEach(function (e) {
        h += '<div class="list-item" data-editex="' + esc(e.id) + '" style="cursor:pointer"><span>' + esc(e.name) + (e.pulley ? '<span class="badge">Pulley</span>' : '') +
          '<br><span class="muted">' + e.sets + ' × ' + e.repMin + '–' + e.repMax + ' · +' + L.fmtKg(e.step || 0).replace('KG', '0 kg') + '</span></span><span class="row" style="flex-wrap:nowrap"><b>' + L.fmtKg(e.weight) + '</b><button class="small" data-how="' + esc(e.id) + '" aria-label="Ausführung zeigen">▶ Technik</button></span></div>';
      });
      h += '</div>';
    });
    h += '<div class="card"><h3>Backup</h3><p class="muted">Sicherung aller Daten als Datei und zurückspielen.</p>' +
      '<button class="btn sec" id="export">⬇️ Daten exportieren</button>' +
      '<button class="btn sec" id="import">⬆️ Daten importieren</button>' +
      '<input type="file" id="file" accept="application/json,.json" hidden>' +
      '<button class="btn dng" id="reset">Plan auf Standard zurücksetzen</button></div>';
    return h;
  }

  // ---------- Dialog: Übung bearbeiten / anlegen ----------
  function openExDialog(exId, dayId) {
    var isNew = !exId;
    var e = isNew ? { id: '', name: '', weight: 0, repMin: 8, repMax: 10, sets: 3, step: 2.5, pulley: false, note: '' } : findEx(exId);
    var dlg = $('#dlg');
    dlg.innerHTML = '<h3>' + (isNew ? 'Neue Übung' : 'Übung bearbeiten') + '</h3>' +
      '<label class="f">Name</label><input id="f-name" type="text" value="' + esc(e.name) + '" style="text-align:left">' +
      '<div class="grid2"><div><label class="f">Gewicht (kg)</label><input id="f-weight" type="number" inputmode="decimal" step="0.25" value="' + esc(e.weight) + '"></div>' +
      '<div><label class="f">Schrittweite (kg, 0 = aus)</label><input id="f-step" type="number" inputmode="decimal" step="0.25" value="' + esc(e.step) + '"></div></div>' +
      '<div class="grid3"><div><label class="f">Wdh. min</label><input id="f-min" type="number" inputmode="numeric" value="' + esc(e.repMin) + '"></div>' +
      '<div><label class="f">Wdh. max</label><input id="f-max" type="number" inputmode="numeric" value="' + esc(e.repMax) + '"></div>' +
      '<div><label class="f">Sätze</label><input id="f-sets" type="number" inputmode="numeric" value="' + esc(e.sets) + '"></div></div>' +
      '<label class="f">Notiz</label><input id="f-note" type="text" value="' + esc(e.note) + '" style="text-align:left">' +
      '<label class="row" style="margin-top:10px"><input id="f-pulley" type="checkbox" style="width:auto"' + (e.pulley ? ' checked' : '') + '> Pulley-Übung</label>' +
      '<button class="btn" id="f-save">Speichern</button>' +
      (isNew ? '' : '<div class="grid3"><button class="btn sec" id="f-up">↑</button><button class="btn sec" id="f-down">↓</button><button class="btn dng" id="f-del">Löschen</button></div>') +
      '<button class="btn sec" id="f-cancel">Abbrechen</button>';
    dlg.showModal();
    function num(id, def) { var v = parseFloat($(id).value.replace(',', '.')); return isNaN(v) ? def : v; }
    $('#f-cancel').onclick = function () { dlg.close(); };
    $('#f-save').onclick = function () {
      var name = $('#f-name').value.trim();
      if (!name) { toast('Bitte einen Namen eingeben'); return; }
      var rmin = Math.max(1, Math.round(num('#f-min', 8))), rmax = Math.max(rmin, Math.round(num('#f-max', 10)));
      var vals = { name: name, weight: Math.max(0, num('#f-weight', 0)), step: Math.max(0, num('#f-step', 0)), repMin: rmin, repMax: rmax, sets: Math.min(8, Math.max(1, Math.round(num('#f-sets', 3)))), note: $('#f-note').value.trim(), pulley: $('#f-pulley').checked };
      if (isNew) {
        var d = dayById(dayId);
        vals.id = 'ex-' + Date.now().toString(36);
        d.exercises.push(vals);
      } else {
        Object.assign(e, vals);
      }
      state.draft = null; // Entwurf neu aufbauen, damit Sätze/Gewichte stimmen
      save(); dlg.close(); render();
    };
    if (!isNew) {
      var d = state.plan.days.find(function (dd) { return dd.exercises.indexOf(e) >= 0; });
      var i = d.exercises.indexOf(e);
      $('#f-up').onclick = function () { if (i > 0) { d.exercises.splice(i - 1, 0, d.exercises.splice(i, 1)[0]); state.draft = null; save(); dlg.close(); render(); } };
      $('#f-down').onclick = function () { if (i < d.exercises.length - 1) { d.exercises.splice(i + 1, 0, d.exercises.splice(i, 1)[0]); state.draft = null; save(); dlg.close(); render(); } };
      $('#f-del').onclick = function () {
        if (confirm('Übung „' + e.name + '" aus dem Plan löschen? Der Verlauf bleibt erhalten.')) {
          d.exercises.splice(i, 1); state.draft = null; save(); dlg.close(); render();
        }
      };
    }
  }

  // ---------- Dialog: Technik / Ausführung ----------
  function openHow(exId) {
    var e = findEx(exId); if (!e) return;
    var text = (window.HOWTO && window.HOWTO[exId]) || '';
    var steps = text ? text.split('|') : [];
    var query = e.name.replace(/\s*\(.*?\)/g, '') + ' Ausführung';
    var dlg = $('#dlg');
    dlg.innerHTML = '<h3>' + esc(e.name) + '</h3>' +
      (steps.length ? '<ol class="warm" style="font-size:15px;color:var(--text);padding-left:20px">' + steps.map(function (s) { return '<li style="margin:6px 0">' + esc(s) + '</li>'; }).join('') + '</ol>' :
        '<p class="muted">Für diese Übung gibt es noch keine Kurzanleitung.</p>') +
      (e.note ? '<p class="muted">💡 ' + esc(e.note) + '</p>' : '') +
      '<a class="btn" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(query) + '" target="_blank" rel="noopener">▶ Video auf YouTube suchen</a>' +
      '<button class="btn sec" id="how-close">Schließen</button>';
    dlg.showModal();
    $('#how-close').onclick = function () { dlg.close(); };
  }

  // ---------- Events ----------
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    var tabBtn = t.closest('.tabs button');
    if (tabBtn) { tab = tabBtn.dataset.tab; render(); window.scrollTo(0, 0); return; }
    var dayBtn = t.closest('[data-day]');
    if (dayBtn) {
      var id = parseInt(dayBtn.dataset.day, 10);
      if (state.draft && state.draft.dayId !== id) {
        var hasData = Object.keys(state.draft.ex).some(function (k) { return state.draft.ex[k].reps.some(function (r) { return r !== ''; }); });
        if (hasData && !confirm('Laufende Eingaben von Tag ' + state.draft.dayId + ' verwerfen?')) return;
        state.draft = null;
      }
      selDay = id; save(); render(); return;
    }
    if (t.id === 'finish') return finish();
    if (t.id === 'discard') {
      if (confirm('Alle Eingaben dieses Trainings leeren?')) { state.draft = null; save(); render(); }
      return;
    }
    var del = t.closest('[data-del]');
    if (del) {
      if (confirm('Diesen Verlaufseintrag löschen? Plan-Gewichte werden nicht zurückgesetzt.')) {
        state.logs = state.logs.filter(function (l) { return String(l.id) !== del.dataset.del; });
        openLog = null; save(); render();
      }
      return;
    }
    var logCard = t.closest('[data-log]');
    if (logCard && tab === 'verlauf') { var lid = parseInt(logCard.dataset.log, 10); openLog = openLog === lid ? null : lid; render(); return; }
    var how = t.closest('[data-how]');
    if (how) return openHow(how.dataset.how);
    var editEx = t.closest('[data-editex]');
    if (editEx) return openExDialog(editEx.dataset.editex);
    var addEx = t.closest('[data-addex]');
    if (addEx) return openExDialog(null, parseInt(addEx.dataset.addex, 10));
    if (t.id === 'export') return doExport();
    if (t.id === 'import') { $('#file').click(); return; }
    if (t.id === 'reset') {
      if (confirm('Plan auf den Standard zurücksetzen? Verlauf bleibt erhalten, eigene Gewichte im Plan gehen verloren.')) {
        state.plan = clone(window.DEFAULT_PLAN); state.planVersion = window.DEFAULT_PLAN.version; state.draft = null; selDay = null; save(); render();
      }
    }
  });

  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!state.draft) return;
    if (t.dataset.r !== undefined) {
      state.draft.ex[t.dataset.r].reps[parseInt(t.dataset.i, 10)] = t.value.replace(',', '.'); save();
    } else if (t.dataset.w !== undefined) {
      state.draft.ex[t.dataset.w].weight = t.value.replace(',', '.'); save();
    } else if (t.dataset.meta) {
      state.draft[t.dataset.meta] = t.value; save();
    }
  });
  document.addEventListener('change', function (ev) {
    if (ev.target.id === 'exsel') { selEx = ev.target.value; render(); }
    if (ev.target.id === 'file') doImport(ev.target.files[0]);
  });

  // ---------- Training speichern ----------
  function finish() {
    var d = state.draft; if (!d) return;
    var day = dayById(d.dayId);
    var entries = {}, any = false;
    day.exercises.forEach(function (e) {
      var c = d.ex[e.id]; if (!c) return;
      var reps = c.reps.map(function (r) { return r === '' ? '' : parseFloat(r); });
      if (reps.some(function (r) { return r !== '' && !isNaN(r); })) any = true;
      entries[e.id] = { name: e.name, weight: c.weight === '' ? e.weight : parseFloat(c.weight), reps: reps.map(function (r) { return isNaN(r) ? '' : r; }) };
    });
    if (!any) { toast('Noch keine Wiederholungen eingetragen'); return; }
    var log = { id: Date.now(), date: d.date, dayId: d.dayId, exercises: entries, duration: d.duration, kcal: d.kcal, note: d.note };
    // Fortschritt nur für Übungen mit eingetragenen Sätzen
    var trained = { exercises: day.exercises.filter(function (e) { return entries[e.id] && entries[e.id].reps.some(function (r) { return r !== ''; }); }) };
    var changes = L.applyProgression(trained, entries);
    state.logs.push(log);
    state.lastDayId = d.dayId;
    state.draft = null;
    selDay = null;
    save();
    var ups = changes.filter(function (c) { return c.up; });
    toast(ups.length ? ('Gespeichert 💪 Höher: ' + ups.map(function (c) { return c.name + ' → ' + L.fmtKg(c.to); }).join(', ')) : 'Gespeichert 💪', ups.length ? 6500 : 3200);
    render(); window.scrollTo(0, 0);
  }

  // ---------- Backup ----------
  function doExport() {
    var blob = new Blob([JSON.stringify({ app: 'dschungel-gym', version: 1, exported: new Date().toISOString(), state: state }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'dschungel-gym-backup-' + L.isoToday() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  function doImport(file) {
    if (!file) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var j = JSON.parse(r.result);
        var s = j.state || j;
        if (!s.plan || !Array.isArray(s.plan.days) || !Array.isArray(s.logs)) throw new Error('Format');
        if (!confirm('Backup einspielen? Aktuelle Daten werden ersetzt.')) return;
        state = s; state.draft = null; selDay = null; save(); render(); toast('Backup eingespielt');
      } catch (e) { toast('Datei konnte nicht gelesen werden'); }
    };
    r.readAsText(file);
  }

  if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js').catch(function () { }); }
  render();
})();
