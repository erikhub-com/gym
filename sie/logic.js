// Reine Logik (ohne DOM) – wird auch per Node getestet.
(function (root) {
  function round(n) { return Math.round(n * 100) / 100; }

  // Alle Sätze am oberen Ende des Wiederholungsbereichs -> Gewicht + Schrittweite.
  function nextWeight(weight, repMax, step, reps, nextFn) {
    var done = (reps || []).filter(function (r) { return r !== '' && r !== null && !isNaN(r); }).map(Number);
    if (!step || done.length === 0 || done.length < (reps || []).length) return round(weight);
    var allTop = done.every(function (r) { return r >= repMax; });
    return allTop ? round(nextFn ? nextFn(weight, step) : weight + step) : round(weight);
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
  function applyProgression(day, entries, inv) {
    var changes = [];
    day.exercises.forEach(function (ex) {
      var e = entries[ex.id];
      if (!e) return;
      var used = Number(e.weight);
      if (isNaN(used)) used = ex.weight;
      var next = nextWeight(used, ex.repMax, ex.step, e.reps, ex.equip ? function (wt, st) { return nextLadder(wt, st, ex.equip, inv); } : null);
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

  // ---------- Beladung: welche Gewichte sind mit dem Bestand symmetrisch ladbar? ----------
  var SIZES = ['20', '15', '10', '5', '2.5', '2', '1.25', '1', '0.5'];
  var DEFAULT_INV = { longBar: 10, shortBar: 2.5, plates: { '20': 0, '15': 2, '10': 2, '5': 6, '2.5': 6, '2': 2, '1.25': 6, '1': 0, '0.5': 4 } };
  function h100(x) { return Math.round(x * 100); }
  function invOf(inv) { return inv && inv.plates ? inv : DEFAULT_INV; }
  var ladderCache = {};

  function limitCaps(caps) {
    caps = caps.slice();
    function prod() { return caps.reduce(function (p, c) { return p * (c + 1); }, 1); }
    while (prod() > 120000) {
      var mi = 0; caps.forEach(function (c, i) { if (c > caps[mi]) mi = i; });
      caps[mi]--;
    }
    return caps;
  }
  function enumVecs(sz, caps) {
    var out = [], cur = [];
    (function rec(i, sum, n) {
      if (i === sz.length) { out.push({ v: cur.slice(), sum: sum, n: n }); return; }
      for (var c = 0; c <= caps[i]; c++) { cur[i] = c; rec(i + 1, sum + c * h100(sz[i]), n + c); }
      cur[i] = 0;
    })(0, 0, 0);
    return out;
  }

  // equip: 'bar' (Langhantel), 'db1' (eine Kurzhantel), 'db2' (zwei Kurzhanteln, Gewicht je Hand), 'plates' (lose Scheiben/Pulley)
  function ladder(equip, inv) {
    if (['bar', 'db1', 'db2', 'plates'].indexOf(equip) < 0) return null;
    inv = invOf(inv);
    var key = equip + JSON.stringify(inv);
    if (ladderCache[key]) return ladderCache[key];
    var sz = SIZES.filter(function (s) { return inv.plates[s] > 0; }).map(Number).sort(function (a, b) { return b - a; });
    var raw = sz.map(function (s) { return Math.floor(inv.plates[String(s)]); });
    var items = [];
    var res;
    if (equip === 'plates') {
      var best = {};
      enumVecs(sz, limitCaps(raw)).forEach(function (e) {
        if (e.sum > 0 && (!best[e.sum] || e.n < best[e.sum].n)) best[e.sum] = e;
      });
      Object.keys(best).forEach(function (k) { items.push({ w: round(best[k].sum / 100), loads: [best[k].v] }); });
    } else {
      var pairs = raw.map(function (c) { return Math.floor(c / 2); });
      var base = h100(equip === 'bar' ? inv.longBar : inv.shortBar);
      var groups = {};
      enumVecs(sz, limitCaps(pairs)).forEach(function (e) { (groups[e.sum] = groups[e.sum] || []).push(e); });
      Object.keys(groups).forEach(function (k) {
        var g = groups[k].sort(function (a, b) { return a.n - b.n; });
        var loads = null;
        if (equip !== 'db2') loads = [g[0].v];
        else {
          var bestN = 1e9;
          for (var i = 0; i < g.length; i++) for (var j = i; j < g.length; j++) {
            if (g[i].n + g[j].n >= bestN) continue;
            var ok = true;
            for (var q = 0; q < pairs.length; q++) if (g[i].v[q] + g[j].v[q] > pairs[q]) { ok = false; break; }
            if (ok) { bestN = g[i].n + g[j].n; loads = [g[i].v, g[j].v]; }
          }
        }
        if (loads) items.push({ w: round((base + 2 * Number(k)) / 100), loads: loads });
      });
    }
    items.sort(function (a, b) { return a.w - b.w; });
    res = { sz: sz, items: items };
    ladderCache[key] = res;
    return res;
  }
  function ladderWeights(equip, inv) {
    var l = ladder(equip, inv); return l ? l.items.map(function (i) { return i.w; }) : [];
  }

  // Nächstliegendes (nearest, bei Gleichstand das leichtere) oder darunterliegendes (down) ladbares Gewicht.
  function snapWeight(w, equip, inv, mode) {
    if (!w || w <= 0) return w;
    var l = ladder(equip, inv);
    if (!l || !l.items.length) return w;
    var items = l.items, best = items[0].w;
    if (mode === 'down') {
      items.forEach(function (i) { if (i.w <= w + 0.001) best = i.w; });
      return best;
    }
    var bd = Infinity;
    items.forEach(function (i) { var d = Math.abs(i.w - w); if (d < bd - 1e-9) { bd = d; best = i.w; } });
    return best;
  }
  // Nächste Erhöhung: kleinstes ladbares Gewicht >= weight + step (bleibt gleich, wenn nichts Schwereres existiert).
  function nextLadder(weight, step, equip, inv) {
    var target = round(weight + step), l = ladder(equip, inv);
    if (!l) return target;
    for (var i = 0; i < l.items.length; i++) if (l.items[i].w >= target - 0.001) return l.items[i].w;
    return round(weight);
  }
  function fmtN(n) { return String(n).replace('.', ','); }
  // Textanleitung zum Beladen oder null, wenn das Gewicht so nicht exakt ladbar ist.
  function loadout(equip, w, inv) {
    var l = ladder(equip, inv); if (!l || !w) return null;
    var it = null; l.items.forEach(function (i) { if (Math.abs(i.w - w) < 0.005) it = i; });
    if (!it) return null;
    inv = invOf(inv);
    function side(v) {
      var parts = []; v.forEach(function (c, i) { for (var k = 0; k < c; k++) parts.push(fmtN(l.sz[i])); });
      return parts.length ? parts.join(' + ') : 'keine Scheiben';
    }
    if (equip === 'plates') return 'Scheiben: ' + side(it.loads[0]);
    if (equip === 'bar') return 'Stange ' + fmtN(inv.longBar) + ' kg, je Seite: ' + side(it.loads[0]);
    if (equip === 'db1') return 'Hantelstange ' + fmtN(inv.shortBar) + ' kg, je Seite: ' + side(it.loads[0]);
    var a = side(it.loads[0]), b = side(it.loads[1]);
    return a === b ? 'Beide Hanteln (' + fmtN(inv.shortBar) + ' kg), je Seite: ' + a : 'Hantel 1 je Seite: ' + a + ' · Hantel 2 je Seite: ' + b;
  }

  // Alle Plan-Gewichte auf ladbare Werte legen. Gibt die Änderungen zurück.
  function snapPlan(plan, inv) {
    var changes = [];
    plan.days.forEach(function (d) {
      d.exercises.forEach(function (ex) {
        if (!ex.equip || !ex.weight) return;
        var nw = snapWeight(ex.weight, ex.equip, inv, 'nearest');
        if (nw !== ex.weight) { changes.push({ id: ex.id, name: ex.name, from: ex.weight, to: nw }); ex.weight = nw; }
      });
    });
    return changes;
  }

  // Standard-Pause in Sekunden: eigene Vorgabe, sonst nach Gewicht (schwer = länger).
  function defaultRest(ex) {
    if (ex && ex.rest > 0) return Math.round(ex.rest);
    if (!ex || !ex.weight) return 30;
    if (ex.weight >= 40) return 90;
    if (ex.weight >= 20) return 70;
    return 45;
  }

  // Wiedereinstieg: alle Plan-Gewichte um pct % senken (auf 0,5 kg gerundet). Gibt die alten Werte zurück (für Rückgängig).
  function reduceWeight(plan, pct, inv) {
    var f = 1 - pct / 100, before = {}, n = 0;
    plan.days.forEach(function (d) {
      d.exercises.forEach(function (ex) {
        if (!ex.weight || ex.weight <= 0) return;
        var tgt = ex.weight * f;
        var nw = ex.equip && ladder(ex.equip, inv) ? snapWeight(tgt, ex.equip, inv, 'down') : Math.max(0.5, Math.round(tgt * 2) / 2);
        nw = Math.min(ex.weight, nw);
        if (nw !== ex.weight) { before[ex.id] = ex.weight; ex.weight = nw; n++; }
      });
    });
    return { changed: n, before: before };
  }
  function restoreWeights(plan, before) {
    var n = 0;
    plan.days.forEach(function (d) {
      d.exercises.forEach(function (ex) {
        if (before && before[ex.id] !== undefined) { ex.weight = before[ex.id]; n++; }
      });
    });
    return n;
  }

  var api = { SIZES: SIZES, DEFAULT_INV: DEFAULT_INV, ladderWeights: ladderWeights, snapWeight: snapWeight, nextLadder: nextLadder, loadout: loadout, snapPlan: snapPlan, defaultRest: defaultRest, reduceWeight: reduceWeight, restoreWeights: restoreWeights, nextWeight: nextWeight, suggestDay: suggestDay, fmtReps: fmtReps, fmtKg: fmtKg, lastEntry: lastEntry, series: series, applyProgression: applyProgression, isoToday: isoToday, round: round };
  root.TrainLogic = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
