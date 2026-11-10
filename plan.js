// Standardplan (v2). Pulley = einzelner Deckenzug mit Plattenstift (1:1), Seil + gerade Stange.
// Pulley-Gewichte sind Startwerte -> in der App anpassen.
(function (root) {
  function ex(id, name, weight, repMin, repMax, o) {
    o = o || {};
    return {
      id: id, name: name, weight: weight, repMin: repMin, repMax: repMax,
      sets: o.sets || 3, step: o.step === undefined ? 2.5 : o.step,
      pulley: !!o.pulley, timed: !!o.timed, note: o.note || ''
    };
  }
  var DEFAULT_PLAN = {
    version: 3,
    days: [
      {
        id: 1, name: 'Brust + Trizeps', emoji: '🦍',
        warmup: ['Schulterkreisen 2 × 15', 'Bankdrücken: 20 kg × 10, 40 kg × 5, 55 kg × 3'],
        exercises: [
          ex('bankdruecken', 'Bankdrücken', 65, 6, 8),
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
          ex('schulterdruecken', 'Schulterdrücken KH', 17.5, 8, 10),
          ex('seitheben-2', 'Seitheben einarmig', 12.5, 8, 10),
          ex('rear-delt-2', 'Rear Delt Fly (brustgestützt)', 12.5, 8, 10),
          ex('barbell-curl', 'Barbell Curl', 35, 8, 10),
          ex('preacher', 'Preacher Curl (SZ-Stange)', 25, 8, 10),
          ex('hammer-kh', 'Hammer Curl KH', 12.5, 8, 10, { note: 'ersetzt Incline Curl an diesem Tag' })
        ]
      },
      {
        id: 3, name: 'Beine', emoji: '🐆',
        warmup: ['Kniebeugen Körpergewicht 15', 'Hüftmobilisation 1–2 min', 'RDL: 20 kg × 10, 40 kg × 5, 55 kg × 3'],
        exercises: [
          ex('rdl', 'Romanian Deadlift', 70, 6, 8),
          ex('sumo', 'Sumo Squat', 32.5, 6, 8),
          ex('bulgarian', 'Bulgarian Split Squat', 15, 6, 8),
          ex('leg-ext', 'Leg Extension', 35, 8, 10),
          ex('hip-ext-kabel', 'Hip Extension am Deckenzug (Pulley, Fußschlaufe)', 10, 10, 12, { pulley: true, note: 'neu, pro Seite; Standbein festhalten; Startgewicht anpassen' }),
          ex('back-ext', 'Back Extension', 15, 8, 10),
          ex('waden', 'Wadenheben (Hantel)', 20, 10, 15, { note: 'neu; Startgewicht anpassen' })
        ]
      },
      {
        id: 4, name: 'Rücken + hintere Schulter', emoji: '🦜',
        warmup: ['Dead Hang 2 × 30 s', 'Barbell Row: 20 kg × 12, 40 kg × 8, 55 kg × 3'],
        exercises: [
          ex('barbell-row', 'Barbell Row', 65, 6, 8),
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
          ex('schraegbank', 'Schrägbank-Kurzhanteldrücken', 22.5, 6, 8),
          ex('kh-flach-5', 'Kurzhanteldrücken flach', 22.5, 8, 10),
          ex('fliegende', 'Fliegende KH', 15, 8, 10),
          ex('seitheben-5', 'Seitheben einarmig (2. Frequenz)', 10, 8, 10, { note: 'leichter als Tag 2; Startgewicht anpassen' }),
          ex('incline-curl', 'Incline Curl (~50° Bank)', 12.5, 8, 10),
          ex('overhead-kh-5', 'Overhead Trizeps Extension KH', 22.5, 8, 10),
          ex('pushdown-5', 'Seilzug-Pushdown (Pulley)', 20, 8, 10, { pulley: true, note: 'ersetzt Band-Pushdown; Startgewicht anpassen' })
        ]
      },
      {
        id: 6, name: 'Core', emoji: '🐊',
        warmup: ['Katze-Kuh 10 Wiederholungen', 'Hüftmobilisation 1–2 min'],
        exercises: [
          ex('cable-crunch', 'Cable Crunch kniend (Pulley, Seil)', 20, 12, 15, { pulley: true, note: 'ersetzt Band; Startgewicht anpassen' }),
          ex('decline-crunch', 'Decline Crunch', 17.5, 8, 10),
          ex('russian-twist', 'Russian Twist', 20, 20, 30, { note: 'links + rechts einzeln zählen' }),
          ex('dead-hang-leg', 'Dead Hang + Beinheben', 0, 12, 15, { sets: 2, step: 0, note: 'Körpergewicht' }),
          ex('dead-bug', 'Dead Bugs', 0, 8, 10, { step: 0, note: 'pro Seite' }),
          ex('plank', 'Plank (Sekunden)', 0, 30, 45, { step: 0, note: 'Countdown: leeres Satzfeld antippen', timed: true })
        ]
      }
    ]
  };
  // Gerät je Übung für die Beladung: bar = Langhantel, db2 = zwei Kurzhanteln, db1 = eine Kurzhantel, plates = lose Scheiben/Pulley, free = keine Anpassung
  var EQUIP = {'bankdruecken': 'bar', 'kh-flach': 'db2', 'fliegende-1': 'db2', 'bench-dips': 'plates', 'overhead-kh': 'db1', 'pushdown-seil': 'plates', 'schulterdruecken': 'db2', 'seitheben-2': 'db1', 'rear-delt-2': 'db2', 'barbell-curl': 'bar', 'preacher': 'bar', 'hammer-kh': 'db2', 'rdl': 'bar', 'bulgarian': 'db2', 'back-ext': 'plates', 'waden': 'db1', 'barbell-row': 'bar', 'latzug': 'plates', 'one-arm-row': 'db1', 'straight-arm': 'plates', 'face-pull-4': 'plates', 'schraegbank': 'db2', 'kh-flach-5': 'db2', 'fliegende': 'db2', 'seitheben-5': 'db1', 'incline-curl': 'db2', 'overhead-kh-5': 'db1', 'pushdown-5': 'plates', 'sumo': 'db1', 'step-up': 'db2', 'cable-crunch': 'plates', 'decline-crunch': 'plates', 'russian-twist': 'plates', 'hip-ext-kabel': 'plates'};
  DEFAULT_PLAN.days.forEach(function (d) { d.exercises.forEach(function (e) { e.equip = EQUIP[e.id] || 'free'; }); });
  root.DEFAULT_PLAN = DEFAULT_PLAN;
  if (typeof module !== 'undefined') module.exports = DEFAULT_PLAN;
})(typeof self !== 'undefined' ? self : globalThis);
