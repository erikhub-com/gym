// Wiedereinstiegsplan (4 Tage, 2 Sätze, 3–4 Wiederholungen im Tank).
// Pulley = einzelner Deckenzug mit Plattenstift (1:1). Schrittweiten sind Annahmen -> in der App anpassbar.
(function (root) {
  function ex(id, name, weight, repMin, repMax, o) {
    o = o || {};
    return {
      id: id, name: name, weight: weight, repMin: repMin, repMax: repMax,
      sets: o.sets || 2, step: o.step === undefined ? 2.5 : o.step,
      pulley: !!o.pulley, note: o.note || ''
    };
  }
  var RULE = 'Woche 1–2: nur 2 Sätze, 3–4 Wiederholungen im Tank lassen';
  var DEFAULT_PLAN = {
    version: 1,
    days: [
      {
        id: 1, name: 'Pull', emoji: '🦋',
        warmup: [RULE, 'Schulterkreisen 2 × 15', '1 leichter Einstiegssatz der ersten Übung'],
        exercises: [
          ex('band-klimmzug', 'Band-Klimmzüge', 0, 4, 5, { step: 0, note: 'mit Band; wenn es leicht geht, dünneres Band' }),
          ex('neg-klimmzug', 'Negative Klimmzüge', 0, 2, 2, { step: 0, note: '1–2 Sätze à 2 Wdh., 3–5 s ablassen' }),
          ex('barbell-row', 'Langhantelrudern', 30, 8, 10, { step: 2.5 }),
          ex('one-arm-row', 'Kurzhantelrudern', 12, 8, 10, { step: 1, note: 'pro Seite' }),
          ex('reverse-fly', 'Reverse Flys', 2, 12, 15, { step: 1 }),
          ex('preacher', 'Preacher Curls', 10, 10, 12, { step: 2.5 })
        ]
      },
      {
        id: 2, name: 'Legs & Glutes', emoji: '🌸',
        warmup: [RULE, 'Hüftkreisen 10 pro Seite', 'Kniebeugen Körpergewicht × 15'],
        exercises: [
          ex('rdl', 'Romanian Deadlift', 35, 8, 10, { step: 2.5, note: 'Start 35 kg, später 37,5 kg' }),
          ex('db-squat', 'DB Squats', 22.5, 8, 10, { step: 2.5 }),
          ex('bulgarian', 'Bulgarian Split Squats', 8, 8, 10, { step: 1, note: '8 kg pro Hand' }),
          ex('glute-bridge', 'Glute Bridges', 27.5, 10, 12, { step: 2.5, note: 'Start 27,5 kg, später 30 kg' }),
          ex('hip-ext-kabel', 'Hip Extensions am Kabelzug (Pulley)', 10, 12, 15, { step: 2.5, pulley: true, note: 'Fußschlaufe am Deckenzug; pro Seite; Start 10 kg, später 12,5 kg' }),
          ex('clam-shell', 'Clam Shells', 0, 12, 15, { step: 0, note: 'pro Seite; Band optional' }),
          ex('side-steps', 'Banded Side Steps', 0, 12, 15, { step: 0, note: 'Extra-Fokus seitlicher Po; Schritte je Richtung' })
        ]
      },
      {
        id: 3, name: 'Push', emoji: '🌺',
        warmup: [RULE, 'Schulterkreisen 2 × 15', 'Leichte KH-Drücke 2 kg × 12'],
        exercises: [
          ex('bankdruecken', 'Bankdrücken', 25, 8, 10, { step: 2.5 }),
          ex('schulterdruecken', 'Schulterdrücken KH', 6, 8, 10, { step: 1, note: '6 kg pro Hand' }),
          ex('incline-db', 'Incline DB Press', 7, 8, 10, { step: 1, note: '7 kg pro Hand' }),
          ex('seitheben', 'Seitheben', 4.5, 10, 12, { step: 1 }),
          ex('bench-dips', 'Bench Dips', 0, 8, 10, { step: 0, note: 'Körpergewicht' })
        ]
      },
      {
        id: 4, name: 'Core & Stability', emoji: '🌴',
        warmup: [RULE, 'Katze-Kuh 10 Wiederholungen'],
        exercises: [
          ex('knee-raises', 'Hanging Knee Raises', 0, 8, 10, { step: 0 }),
          ex('dead-bug', 'Dead Bugs', 0, 8, 10, { step: 0, note: 'pro Seite' }),
          ex('reverse-crunch', 'Reverse Crunch', 0, 8, 10, { step: 0 }),
          ex('plank', 'Plank (Sekunden)', 0, 25, 30, { step: 0, note: 'Zeit in Sekunden eintragen' }),
          ex('clam-shell-4', 'Clam Shells', 0, 12, 15, { step: 0, note: 'pro Seite' }),
          ex('bear-taps', 'Bear Plank Shoulder Taps', 0, 8, 10, { step: 0, note: 'pro Seite' }),
          ex('side-steps-4', 'Banded Side Steps', 0, 12, 15, { step: 0, note: 'Extra-Fokus seitlicher Po; Schritte je Richtung' })
        ]
      }
    ]
  };
  root.DEFAULT_PLAN = DEFAULT_PLAN;
  if (typeof module !== 'undefined') module.exports = DEFAULT_PLAN;
})(typeof self !== 'undefined' ? self : globalThis);
