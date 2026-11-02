// Standardplan (v2). Pulley = einzelner Deckenzug mit Plattenstift (1:1), Seil + gerade Stange.
// Pulley-Gewichte sind Startwerte -> in der App anpassen.
(function (root) {
  function ex(id, name, weight, repMin, repMax, o) {
    o = o || {};
    return {
      id: id, name: name, weight: weight, repMin: repMin, repMax: repMax,
      sets: o.sets || 3, step: o.step === undefined ? 2.5 : o.step,
      pulley: !!o.pulley, note: o.note || ''
    };
  }
  var DEFAULT_PLAN = {
    version: 2,
    days: [
      {
        id: 1, name: 'Brust + Trizeps', emoji: '🦍',
        warmup: ['Schulterkreisen 2 × 15', 'Bankdrücken: 20 kg × 10, 40 kg × 5, 55 kg × 3'],
        exercises: [
          ex('bankdruecken', 'Bankdrücken', 65, 6, 8, { note: 'bei 8/8/8 → 70 kg' }),
          ex('kh-flach', 'Kurzhanteldrücken flach', 22.5, 8, 10),
          ex('fliegende-1', 'Fliegende KH', 15, 8, 10),
          ex('bench-dips', 'Bench Dips (+ Zusatzgewicht)', 40, 8, 10),
          ex('overhead-kh', 'Overhead Trizeps Extension KH', 22.5, 8, 10),
          ex('pushdown-seil', 'Seilzug-Pushdown (Pulley)', 20, 8, 10, { pulley: true, note: 'Seil am Deckenzug; ersetzt Band-Pushdown; Startgewicht anpassen' })
        ]
      },
      {
        id: 2, name: 'Schultern + Bizeps', emoji: '🐒',
        warmup: ['Schulterkreisen 2 × 15', 'Leichtes Schulterdrücken KH 10 kg × 12', 'Leichte Curls 10 kg × 10'],
        exercises: [
          ex('schulterdruecken', 'Schulterdrücken KH', 17.5, 8, 10, { note: 'bei 10/10/10 → 20 kg' }),
          ex('seitheben-2', 'Seitheben einarmig', 12.5, 8, 10),
          ex('rear-delt-2', 'Rear Delt Fly (brustgestützt)', 12.5, 8, 10),
          ex('barbell-curl', 'Barbell Curl', 35, 8, 10, { note: 'bei 10/10/10 → 37,5 kg' }),
          ex('preacher', 'Preacher Curl (SZ-Stange)', 25, 8, 10),
          ex('hammer-kh', 'Hammer Curl KH', 12.5, 8, 10, { note: 'ersetzt Incline Curl an diesem Tag' })
        ]
      },
      {
        id: 3, name: 'Beine (hinten)', emoji: '🐆',
        warmup: ['Kniebeugen Körpergewicht 15', 'Hüftmobilisation 1–2 min', 'RDL: 20 kg × 10, 40 kg × 5, 55 kg × 3'],
        exercises: [
          ex('rdl', 'Romanian Deadlift', 70, 6, 8, { note: 'bei 8/8/8 → nächstes Gewicht' }),
          ex('bulgarian', 'Bulgarian Split Squat', 15, 6, 8),
          ex('back-ext', 'Back Extension', 15, 8, 10),
          ex('waden', 'Wadenheben (Hantel)', 20, 10, 15, { note: 'neu; Startgewicht anpassen' })
        ]
      },
      {
        id: 4, name: 'Rücken + hintere Schulter', emoji: '🦜',
        warmup: ['Dead Hang 2 × 30 s', 'Barbell Row: 20 kg × 12, 40 kg × 8, 55 kg × 3'],
        exercises: [
          ex('barbell-row', 'Barbell Row', 65, 6, 8, { note: 'bei 8/8/8 → 70 kg' }),
          ex('latzug', 'Latzug (Pulley, gerade Stange)', 40, 6, 8, { pulley: true, note: 'neu, vertikaler Zug; Körper sichern (Bank/Gurt); Startgewicht anpassen' }),
          ex('one-arm-row', 'One Arm Row', 37.5, 6, 8),
          ex('straight-arm', 'Straight-Arm Pulldown (Pulley, Stange)', 20, 8, 10, { pulley: true, note: 'ersetzt Pullover; Arme fast gestreckt; Startgewicht anpassen' }),
          ex('face-pull-4', 'Face Pull von oben (Pulley, Seil)', 15, 10, 12, { pulley: true, note: 'Seil zur Stirn, Ellbogen hoch; Startgewicht anpassen' })
        ]
      },
      {
        id: 5, name: 'Brust + Arme', emoji: '🐅',
        warmup: ['Schulterkreisen 2 × 15', 'Leichte KH-Presses 10 kg × 12'],
        exercises: [
          ex('schraegbank', 'Schrägbank-Kurzhanteldrücken', 22.5, 6, 8, { note: 'bei 8/8/8 → 25 kg' }),
          ex('kh-flach-5', 'Kurzhanteldrücken flach', 22.5, 8, 10),
          ex('fliegende', 'Fliegende KH', 15, 8, 10),
          ex('seitheben-5', 'Seitheben einarmig (2. Frequenz)', 10, 8, 10, { note: 'leichter als Tag 2; Startgewicht anpassen' }),
          ex('incline-curl', 'Incline Curl (~50° Bank)', 12.5, 8, 10),
          ex('overhead-kh-5', 'Overhead Trizeps Extension KH', 22.5, 8, 10),
          ex('pushdown-5', 'Seilzug-Pushdown (Pulley)', 20, 8, 10, { pulley: true, note: 'ersetzt Band-Pushdown; Startgewicht anpassen' })
        ]
      },
      {
        id: 6, name: 'Beine (vorn) + Core', emoji: '🐊',
        warmup: ['Kniebeugen Körpergewicht 15', 'Hüftmobilisation 1–2 min'],
        exercises: [
          ex('sumo', 'Sumo Squat', 32.5, 6, 8),
          ex('leg-ext', 'Leg Extension', 35, 8, 10),
          ex('step-up', 'Step-Up', 17.5, 6, 8),
          ex('cable-crunch', 'Cable Crunch kniend (Pulley, Seil)', 20, 12, 15, { pulley: true, note: 'ersetzt Band; Startgewicht anpassen' }),
          ex('decline-crunch', 'Decline Crunch', 17.5, 8, 10),
          ex('russian-twist', 'Russian Twist', 20, 20, 30, { note: 'links + rechts einzeln zählen' }),
          ex('dead-hang-leg', 'Dead Hang + Beinheben', 0, 12, 15, { sets: 2, step: 0, note: 'Körpergewicht' })
        ]
      }
    ]
  };
  root.DEFAULT_PLAN = DEFAULT_PLAN;
  if (typeof module !== 'undefined') module.exports = DEFAULT_PLAN;
})(typeof self !== 'undefined' ? self : globalThis);
