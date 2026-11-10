// Kurzanleitungen je Übungs-ID. Schritte mit "|" getrennt. Eigene Übungen ohne Eintrag zeigen nur den Video-Link.
(function (root) {
  var H = {};
  function add(ids, text) { ids.forEach(function (id) { H[id] = text; }); }

  add(['bankdruecken'],
    'Schulterblätter zusammen und nach unten ziehen, Füße fest am Boden.|Stange kontrolliert zur unteren Brust senken, Ellbogen etwa 45–60° vom Körper.|Ohne Prellen hochdrücken, Handgelenke bleiben gerade.');
  add(['kh-flach', 'kh-flach-5'],
    'Hanteln über der Brust starten, Ellbogen etwa 45–60° vom Körper.|Tief senken, bis die Brust gedehnt wird.|Kontrolliert nach oben drücken, oben die Arme nicht ruckartig sperren.');
  add(['schraegbank'],
    'Bank auf etwa 30° stellen, Schulterblätter zusammen.|Hanteln über der oberen Brust, Ellbogen 45–60° vom Körper.|Kontrolliert senken und drücken.');
  add(['fliegende-1', 'fliegende'],
    'Ellbogen leicht gebeugt und den Winkel während der ganzen Bewegung halten.|Arme im weiten Bogen öffnen, bis die Brust gedehnt wird, nicht tiefer.|Hanteln im Bogen wieder zusammenführen. Gewicht moderat, Schultern schonen.');
  add(['bench-dips'],
    'Hände auf der Bank hinter dir, Beine gestreckt, Zusatzgewicht auf den Oberschenkeln.|Ellbogen nach hinten beugen, bis etwa 90°.|Schultern dabei nicht nach vorn kippen lassen, kontrolliert hochdrücken.');
  add(['overhead-kh', 'overhead-kh-5'],
    'Hantel mit beiden Händen über dem Kopf halten, Ellbogen zeigen nach oben und bleiben eng.|Hinter dem Kopf absenken, bis der Trizeps gedehnt wird.|Ohne Hohlkreuz wieder strecken.');
  add(['pushdown-seil', 'pushdown-5'],
    'Unter dem Deckenzug stehen, leicht vorgebeugt, Ellbogen fest an den Rippen.|Seil nach unten strecken und am Ende nach außen auseinanderziehen.|Kontrolliert zurück bis etwa 90° Ellbogenwinkel. Oberkörper bleibt ruhig.');
  add(['schulterdruecken'],
    'Aufrecht sitzen oder stehen, Bauch und Gesäß fest, kein Hohlkreuz.|Hanteln auf Schulterhöhe starten, Unterarme senkrecht.|Über Kopf drücken und kontrolliert absenken.');
  add(['seitheben-2', 'seitheben-5'],
    'Leicht vorgebeugt, Ellbogen leicht gebeugt.|Arm seitlich bis Schulterhöhe heben, der Ellbogen führt.|Oben kurz halten, langsam ablassen. Kein Schwung aus dem Rücken.');
  add(['rear-delt-2'],
    'Brust auf die Schrägbank legen, Arme hängen locker, Ellbogen leicht gebeugt.|Arme seitlich bis Schulterhöhe nach oben öffnen.|Langsam ablassen, nicht schwingen.');
  add(['barbell-curl'],
    'Ellbogen fest an den Rippen, Oberkörper ruhig.|Stange ohne Schwung hochcurlen, oben kurz anspannen.|Zwei bis drei Sekunden ablassen, unten die Arme fast strecken.');
  add(['preacher'],
    'Oberarme liegen fest auf dem Pult.|Voller Bewegungsradius, oben kurz anspannen.|Unten kontrolliert absenken und die Arme nicht fallen lassen, das schont die Sehne.');
  add(['hammer-kh'],
    'Daumen zeigen nach oben (neutraler Griff), Ellbogen am Körper.|Hanteln hochcurlen, ohne die Schultern nach vorn zu ziehen.|Langsam wieder ablassen.');
  add(['incline-curl'],
    'Bank etwa 50° zurückgelehnt, Arme hängen hinter der Körperachse.|Ellbogen bleiben fest nach unten gerichtet, Schulter ruhig.|Beide Arme gleichzeitig curlen, unten voll dehnen.');
  add(['rdl'],
    'Knie leicht gebeugt, Hüfte nach hinten schieben.|Stange nah an den Beinen nach unten führen, Rücken bleibt neutral.|Bei Dehnung in den Beinbeugern stoppen, dann die Hüfte nach vorn strecken.');
  add(['bulgarian'],
    'Hinterer Fuß liegt auf der Bank, vorderer Fuß weit genug vorn.|Aufrecht senken, bis der Oberschenkel etwa parallel ist, Knie über dem Fuß.|Durch die Ferse des vorderen Beins hochdrücken.');
  add(['back-ext'],
    'Hüfte liegt am Polster, Rücken gerade.|Oberkörper bis zur geraden Linie heben, nicht überstrecken.|Kontrolliert wieder absenken. Gewicht vor der Brust halten.');
  add(['waden'],
    'Auf Stufe oder Kante stehen, Hantel in der Hand.|Ferse ganz absenken, bis die Wade gedehnt wird.|Kräftig auf die Zehenspitzen hochdrücken, oben eine Sekunde halten.');
  add(['barbell-row'],
    'Etwa 45° vorgebeugt, Rücken neutral, Knie leicht gebeugt.|Stange zum Bauchnabel ziehen, Ellbogen nah am Körper, Schulterblätter zusammen.|Kontrolliert absenken, Oberkörper bleibt in der Position.');
  add(['latzug'],
    'Körper sichern (Füße unter die Bank oder Gurt), da das Gewicht 1:1 zieht.|Gerade Stange zur oberen Brust ziehen, Ellbogen nach unten und hinten, Brust raus.|Nicht hinter den Kopf ziehen. Langsam bis zur Streckung zurück.');
  add(['one-arm-row'],
    'Hand und Knie auf der Bank, Rücken gerade.|Hantel zur Hüfte ziehen, Ellbogen nah am Körper, Schulterblatt zurück.|Kontrolliert absenken, Oberkörper dreht nicht mit.');
  add(['straight-arm'],
    'Leicht vorgebeugt, Arme fast gestreckt, Ellbogen minimal gebeugt und fixiert.|Stange im Bogen von oben zu den Oberschenkeln ziehen und den Latissimus anspannen.|Langsam zurück bis zur Dehnung.');
  add(['face-pull-4'],
    'Seil am Deckenzug, Gewicht leicht, Oberkörper nicht zurücklehnen.|Seil zur Stirn bzw. Augenhöhe ziehen, Ellbogen hoch und auseinander.|Am Ende die Hände weit auseinander, kurz halten, langsam zurück.');
  add(['sumo'],
    'Breiter Stand, Fußspitzen nach außen, Knie folgen der Fußrichtung.|Gewicht vor der Brust oder zwischen den Beinen, Oberkörper aufrecht.|So tief wie möglich ohne Rundrücken, kräftig hochdrücken.');
  add(['leg-ext'],
    'Rückenlehne so einstellen, dass die Knie auf Höhe der Drehachse sind.|Beine kontrolliert strecken, oben kurz anspannen.|Langsam ablassen, nicht fallen lassen.');
  add(['step-up'],
    'Ganzen Fuß auf die Box stellen.|Mit dem vorderen Bein hochdrücken, das hintere stößt nicht ab.|Oben aufrichten und kontrolliert wieder absteigen.');
  add(['cable-crunch'],
    'Kniend unter dem Deckenzug, Seil seitlich am Kopf halten.|Wirbelsäule einrollen, Ellbogen Richtung Knie, die Hüfte bleibt ruhig.|Nicht mit den Armen ziehen, langsam zurück.');
  add(['decline-crunch'],
    'Auf der Schrägbank fixieren, Gewicht vor der Brust.|Oberkörper einrollen, nicht aus der Hüfte aufrichten.|Langsam absenken, kein Schwung.');
  add(['russian-twist'],
    'Oberkörper leicht zurücklehnen, Rücken lang.|Gewicht seitlich bewegen, die Drehung kommt aus dem Oberkörper, nicht nur aus den Armen.|Links und rechts einzeln zählen.');
  add(['dead-hang-leg'],
    'An der Stange hängen, Schultern leicht aktiv.|Beine kontrolliert bis Hüfthöhe oder höher heben.|Ohne Schwung wieder absenken.');

  add(['hip-ext-kabel'],
    'Fußschlaufe am Knöchel, Seil am Deckenzug, mit den Händen an Bank oder Wand abstützen.|Bein nach hinten ziehen, Gesäß anspannen, Hüfte bleibt gerade, kein Hohlkreuz.|Langsam zurückkommen. Pro Seite die gleichen Sätze.');
  add(['dead-bug'],
    'Rückenlage, Arme zur Decke, Beine in 90° angehoben, unterer Rücken bleibt am Boden.|Gegenüberliegenden Arm und Bein langsam strecken, ohne dass der Rücken abhebt.|Zur Mitte zurück, Seite wechseln. Pro Seite zählen.');
  add(['plank'],
    'Unterarme unter den Schultern, Körper bildet eine Linie.|Gesäß und Bauch anspannen, Hüfte nicht durchhängen lassen.|Zeit in Sekunden eintragen, nur mit sauberer Form halten.');

  root.HOWTO = H;
  if (typeof module !== 'undefined') module.exports = H;
})(typeof self !== 'undefined' ? self : globalThis);
