// Reine Logik (ohne DOM) – wird auch per Node getestet.
(function (root) {
  function round(n) { return Math.round(n * 100) / 100; }

  // Alle Sätze am oberen Ende des Wiederholungsbereichs -> Gewicht + Schrittweite.
  function nextWeight(weight, repMax, step, reps) {
    var done = (reps || []).filter(function (r) { return r !== '' && r !== null && !isNaN(r); }).map(Number);
    if (!step || done.length === 0 || done.length < (reps || []).length) return round(weight);
    var allTop = done.every(function (r) { return r >= repMax; });
    return allTop ? round(weight + step) : round(weight);
  }

  // Nächster Trainingstag im Zyklus 1..n (nach dem zuletzt gespeicherten).
  function suggestDay(days, lastDayId) {
    if (!days.length) return null;
    var idx = days.findIndex(function (d) { return d.id === lastDayId; });
    return days[(idx + 1) % days.length].id;
  }

  function fmtReps(reps) {
    return (reps || []).map(function (r) { return (r === '' || r === null || r === undefined) ? '–' : String(r).replace('.', ','); }).join('/');
  }
  function fmtKg(w) {
    if (!w) return 'KG';
    return String(round(w)).replace('.', ',') + ' kg';
  }

  // Letzter Eintrag einer Übung aus dem Verlauf (neuester zuerst).
  function lastEntry(logs, exId) {
    for (var i = logs.length - 1; i >= 0; i--) {
      var e = logs[i].exercises && logs[i].exercises[exId];
      if (e && e.reps && e.reps.some(function (r) { return r !== '' && r !== null; })) {
        return { date: logs[i].date, weight: e.weight, reps: e.reps };
      }
    }
    return null;
  }

  function series(logs, exId) {
    var out = [];
    logs.forEach(function (l) {
      var e = l.exercises && l.exercises[exId];
      if (!e || !e.reps) return;
      var nums = e.reps.filter(function (r) { return r !== '' && r !== null && !isNaN(r); }).map(Number);
      if (!nums.length) return;
      out.push({ date: l.date, weight: e.weight, reps: nums, volume: round(nums.reduce(function (a, b) { return a + b; }, 0) * (e.weight || 1)) });
    });
    return out;
  }

  // Training abschließen: neue Plan-Gewichte berechnen. Gibt Liste der Änderungen zurück.
  function applyProgression(day, entries) {
    var changes = [];
    day.exercises.forEach(function (ex) {
      var e = entries[ex.id];
      if (!e) return;
      var used = Number(e.weight);
      if (isNaN(used)) used = ex.weight;
      var next = nextWeight(used, ex.repMax, ex.step, e.reps);
      if (next !== ex.weight) {
        changes.push({ id: ex.id, name: ex.name, from: ex.weight, to: next, up: next > used });
        ex.weight = next;
      }
    });
    return changes;
  }

  function isoToday() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  var api = { nextWeight: nextWeight, suggestDay: suggestDay, fmtReps: fmtReps, fmtKg: fmtKg, lastEntry: lastEntry, series: series, applyProgression: applyProgression, isoToday: isoToday, round: round };
  root.TrainLogic = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
