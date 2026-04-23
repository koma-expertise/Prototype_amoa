import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Shield, FileCheck, AlertTriangle, CheckCircle2, XCircle, Clock, Eye,
  ChevronRight, ChevronDown, Bell, Search, Menu, Plus, Filter,
  Building2, Users, FileText, BarChart3, FolderOpen, Camera,
  MessageSquare, Video, Brain, Layers, Activity, Target, Briefcase,
  MapPin, TrendingUp, TrendingDown, X, Send, Upload, Download,
  Calendar, Zap, AlertOctagon, ClipboardCheck, GitBranch, Archive,
  ExternalLink, Paperclip, Flag, ThumbsUp, ThumbsDown, RotateCcw,
  Maximize2, Minimize2, ChevronLeft, MoreVertical, Star,
  CircleDot, Hash, BookOpen, Gauge, ScanEye, Hammer, CircleAlert,
  Image, Play, Pause, Settings, ArrowUpRight, ArrowRight, Info,
  List, Grid3X3, Columns3, ChevronUp, Edit3, Trash2, Copy,
  RefreshCw, Phone, Link, FileImage, FilePlus, FolderPlus, Tag
} from "lucide-react";

/* ─── COULEURS KOMA ─── */
const C = {
  pri: "#18B7D2", priL: "#E0F5F9", priD: "#0E95AD",
  sec: "#6BC0AA", secL: "#E8F5F0", secD: "#4FA08B",
  dk: "#1D1D1B", dkG: "#374151", g: "#6B7280", lG: "#9CA3AF",
  brd: "#E5E7EB", bgL: "#F9FAFB", bg2: "#F3F4F6", w: "#FFFFFF",
  ok: "#10B981", okL: "#D1FAE5", okD: "#065F46",
  warn: "#F59E0B", warnL: "#FEF3C7", warnD: "#92400E",
  err: "#EF4444", errL: "#FEE2E2", errD: "#991B1B",
  info: "#3B82F6", infoL: "#DBEAFE", infoD: "#1E40AF",
  purp: "#8B5CF6", purpL: "#EDE9FE", purpD: "#5B21B6",
  rose: "#E11D48", roseL: "#FCE7F3",
};

/* ─── DONNÉES MOCKÉES ─── */
const PROJECTS = [
  { id:"PRJ-001", nom:"Villa Éden", loc:"Douala, Bonanjo", client:"J-P Fouda", typo:"Construction neuve", phase:"Construction", phaseIdx:7, statut:"Actif", budget:120e6, dep:52.8e6, av:44, avPlan:48, risque:"Modéré", conformite:82, reservesOuv:3, ecartsOuv:2, validAttente:4, sensClient:"Moyenne", dernCtrl:"16/04/2026", prochJalon:"Fin GO R+1 — 28/04", spoc:"M. Atangana", moe:"Arc. Njoya", moex:"BTP Cameroun", tempCtrl:"stable",
    lots:[
      { id:"LOT-I", nom:"LOT I — Travaux Préparatoires", av:100, statut:"Terminé", ops:[ {code:"O1",lib:"Installation chantier",st:"Terminé",av:100},{code:"O2",lib:"Terrassement",st:"Terminé",av:100},{code:"O3",lib:"Implantation",st:"Terminé",av:100} ] },
      { id:"LOT-II", nom:"LOT II — Gros Œuvre", av:55, statut:"En cours", ops:[ {code:"O4",lib:"Fouilles fondations",st:"Terminé",av:100},{code:"O5",lib:"Coulage semelles",st:"Terminé",av:100},{code:"O6",lib:"Amorces poteaux",st:"Terminé",av:100},{code:"O7",lib:"Chaînage bas",st:"Terminé",av:100},{code:"O8",lib:"Élévation murs RDC",st:"Terminé",av:100},{code:"O9",lib:"Coffrage poteaux R+1",st:"En cours",av:75},{code:"O10",lib:"Ferraillage R+1",st:"En cours",av:60},{code:"O11",lib:"Coulage plancher R+1",st:"Non démarré",av:0},{code:"O12",lib:"Élévation murs R+1",st:"Non démarré",av:0} ] },
      { id:"LOT-III", nom:"LOT III — Clos & Couvert", av:0, statut:"Non démarré", ops:[ {code:"O13",lib:"Charpente",st:"Non démarré",av:0},{code:"O14",lib:"Couverture",st:"Non démarré",av:0},{code:"O15",lib:"Menuiseries ext.",st:"Non démarré",av:0},{code:"O16",lib:"Étanchéité",st:"Non démarré",av:0} ] },
      { id:"LOT-IV", nom:"LOT IV — Second Œuvre", av:0, statut:"Non démarré", ops:[ {code:"O17",lib:"Plomberie",st:"Non démarré",av:0},{code:"O18",lib:"Électricité",st:"Non démarré",av:0},{code:"O19",lib:"Carrelage",st:"Non démarré",av:0},{code:"O20",lib:"Peinture",st:"Non démarré",av:0} ] },
    ],
    jalons:[ {d:"15/01",l:"Démarrage chantier",st:"Fait"},{d:"05/03",l:"Fin fondations",st:"Fait"},{d:"28/04",l:"Fin GO R+1",st:"En cours"},{d:"15/06",l:"Hors d'eau",st:"À venir"},{d:"30/09",l:"Réception",st:"À venir"} ],
    intervenants:[ {nom:"M. Atangana",role:"SPOC"},{nom:"Arc. Njoya",role:"MOE"},{nom:"BTP Cameroun",role:"MOEX"},{nom:"S. Kamga",role:"AMOA"},{nom:"BET Structure",role:"BET"} ],
  },
  { id:"PRJ-002", nom:"Résidence Kotto", loc:"Douala, Kotto", client:"M. Ndiaye", typo:"Construction neuve", phase:"Conception", phaseIdx:4, statut:"En validation", budget:85e6, dep:2.1e6, av:8, avPlan:10, risque:"Faible", conformite:95, reservesOuv:0, ecartsOuv:0, validAttente:2, sensClient:"Faible", dernCtrl:"14/04/2026", prochJalon:"Validation APS — 22/04", spoc:"M. Atangana", moe:"Arc. Njoya", moex:"—", tempCtrl:"favorable",
    lots:[ { id:"LOT-ETUDES", nom:"Études", av:30, statut:"En cours", ops:[ {code:"O1",lib:"APS distribution",st:"En revue",av:85},{code:"O2",lib:"APS structure",st:"Non démarré",av:0} ] } ],
    jalons:[ {d:"01/03",l:"Lancement",st:"Fait"},{d:"22/04",l:"Validation APS",st:"En cours"},{d:"15/06",l:"APD finalisé",st:"À venir"} ],
    intervenants:[ {nom:"M. Atangana",role:"SPOC"},{nom:"Arc. Njoya",role:"MOE"},{nom:"S. Kamga",role:"AMOA"} ],
  },
  { id:"PRJ-004", nom:"Reprise Bali", loc:"Douala, Bali", client:"P. Essomba", typo:"Reprise chantier", phase:"Devis", phaseIdx:3, statut:"Actif", budget:45e6, dep:12e6, av:28, avPlan:35, risque:"Élevé", conformite:58, reservesOuv:5, ecartsOuv:4, validAttente:6, sensClient:"Haute", dernCtrl:"15/04/2026", prochJalon:"Devis finalisé — 20/04", spoc:"M. Atangana", moe:"—", moex:"Bati-Plus", tempCtrl:"dégradé",
    lots:[
      { id:"LOT-I", nom:"LOT I — Travaux Prép.", av:65, statut:"En retard", ops:[ {code:"O1",lib:"Déblaiement",st:"En cours",av:80},{code:"O2",lib:"Démolition partielle",st:"En cours",av:50} ] },
      { id:"LOT-II", nom:"LOT II — Gros Œuvre", av:15, statut:"Critique", ops:[ {code:"O3",lib:"Reprise fondations",st:"En cours",av:30},{code:"O4",lib:"Ferraillage poteaux",st:"Non conforme",av:10},{code:"O5",lib:"Verticalité poteaux",st:"Non conforme",av:5} ] },
      { id:"LOT-III", nom:"LOT III — Clos Couvert", av:0, statut:"Bloqué", ops:[ {code:"O6",lib:"Étanchéité toiture",st:"Non testé",av:0} ] },
    ],
    jalons:[ {d:"01/03",l:"Diagnostic structure",st:"Fait"},{d:"20/04",l:"Devis finalisé",st:"En retard"},{d:"15/05",l:"Reprise GO",st:"À venir"} ],
    intervenants:[ {nom:"M. Atangana",role:"SPOC"},{nom:"Bati-Plus",role:"MOEX"},{nom:"S. Kamga",role:"AMOA"},{nom:"BET Diag.",role:"BET"} ],
  },
  { id:"PRJ-006", nom:"Étude Kribi", loc:"Kribi", client:"J-P Fouda", typo:"Études préliminaires", phase:"Pré-faisabilité", phaseIdx:1, statut:"Actif", budget:2.5e6, dep:0.8e6, av:60, avPlan:55, risque:"Faible", conformite:90, reservesOuv:1, ecartsOuv:0, validAttente:1, sensClient:"Faible", dernCtrl:"10/04/2026", prochJalon:"Livraison rapport — 25/04", spoc:"M. Atangana", moe:"—", moex:"—", tempCtrl:"favorable",
    lots:[ { id:"LOT-ETUDES", nom:"Études", av:60, statut:"En cours", ops:[ {code:"O1",lib:"Faisabilité terrain",st:"Validé",av:100},{code:"O2",lib:"Étude G2 AVP",st:"Attendu",av:0} ] } ],
    jalons:[ {d:"15/02",l:"Lancement",st:"Fait"},{d:"08/04",l:"Rapport faisabilité",st:"Fait"},{d:"25/04",l:"Rapport final",st:"En cours"} ],
    intervenants:[ {nom:"M. Atangana",role:"SPOC"},{nom:"S. Kamga",role:"AMOA"} ],
  },
];

const VALIDATIONS = [
  { id:"VAL-001", projet:"PRJ-001", objet:"Rapport journalier RJ-16", type:"Rapport", typeVal:"validation technique chantier", auteur:"B. Ekambi (MOEX)", date:"16/04", risque:"Moyen", synthese:"Coffrage poteaux R+1 – 8 ouvriers – 75% avancement déclaré. Vérifier cohérence avec vidéo.", delai:"17/04", statut:"En attente", pj:true, crit:false, lot:"LOT II", demandeur:"BTP Cameroun", avisAMOA:"", hist:["16/04 08:00 — Soumis par MOEX","16/04 08:05 — Notification envoyée à AMOA"] },
  { id:"VAL-002", projet:"PRJ-004", objet:"Devis reprise v2", type:"Devis", typeVal:"validation livrable", auteur:"M. Atangana (SPOC)", date:"14/04", risque:"Élevé", synthese:"Écart +18% vs estimation initiale. Poste ferraillage à requalifier. Impact budget client.", delai:"18/04", statut:"En attente", pj:true, crit:true, lot:"—", demandeur:"SPOC", avisAMOA:"", hist:["14/04 09:00 — Soumis par SPOC","14/04 14:00 — Relance AMOA","16/04 — En attente"] },
  { id:"VAL-003", projet:"PRJ-001", objet:"Plan RDC v2 — APD", type:"Livrable", typeVal:"validation livrable", auteur:"Arc. Njoya (MOE)", date:"10/04", risque:"Moyen", synthese:"Plan modifié suite réserve AMOA #R-003. Vérifier cotations et conformité normes WeCare.", delai:"20/04", statut:"En attente", pj:true, crit:false, lot:"LOT II", demandeur:"Arc. Njoya", avisAMOA:"", hist:["10/04 — Livrable transmis","12/04 — En revue AMOA"] },
  { id:"VAL-004", projet:"PRJ-002", objet:"APS — Plans distribution", type:"Étude", typeVal:"validation étude", auteur:"Arc. Njoya (MOE)", date:"12/04", risque:"Faible", synthese:"Premier lot APS. Vérifier complétude vs référentiel WeCare.", delai:"22/04", statut:"En attente", pj:false, crit:false, lot:"—", demandeur:"Arc. Njoya", avisAMOA:"", hist:["12/04 — APS transmis"] },
  { id:"VAL-005", projet:"PRJ-004", objet:"Rapport visite AMOA 15/04", type:"Rapport", typeVal:"validation corrective", auteur:"S. Kamga (AMOA)", date:"15/04", risque:"Élevé", synthese:"5 non-conformités identifiées. Ferraillage LOT II non conforme aux plans PRO.", delai:"16/04", statut:"En attente", pj:true, crit:true, lot:"LOT II", demandeur:"AMOA", avisAMOA:"5 NC majeures — correction impérative", hist:["15/04 — Visite terrain","15/04 — 5 NC documentées","16/04 — En attente correction MOEX"] },
  { id:"VAL-006", projet:"PRJ-001", objet:"Commande ciment CPJ — DA-005", type:"Achat", typeVal:"validation technique chantier", auteur:"BTP Cameroun (MOEX)", date:"15/04", risque:"Moyen", synthese:"200 sacs × 5 200 FCFA. Vérifier prix vs devis référence. Stock actuel : 245.", delai:"17/04", statut:"En attente", pj:false, crit:false, lot:"LOT II", demandeur:"BTP Cameroun", avisAMOA:"", hist:["15/04 — DA soumise"] },
  { id:"VAL-007", projet:"PRJ-006", objet:"Rapport faisabilité terrain", type:"Étude", typeVal:"validation étude", auteur:"S. Kamga (AMOA)", date:"08/04", risque:"Faible", synthese:"Terrain exploitable. Sol porteur. Accès routier OK. Recommandation : G2 AVP.", delai:"12/04", statut:"Validée", pj:true, crit:false, lot:"—", demandeur:"AMOA", avisAMOA:"Conforme. Lancer G2 AVP.", hist:["08/04 — Soumis","12/04 — Validé par AMOA"] },
  { id:"VAL-008", projet:"PRJ-001", objet:"Facture main-d'œuvre Mars", type:"Facture", typeVal:"validation avant réception", auteur:"SPOC", date:"01/04", risque:"Faible", synthese:"3.2M FCFA conforme au planning. Aucun écart.", delai:"05/04", statut:"Rejetée", pj:false, crit:false, lot:"—", demandeur:"SPOC", avisAMOA:"Rejeté : libellé non conforme, corriger et resoumettre.", hist:["01/04 — Soumise","03/04 — Rejetée par AMOA","Motif : libellé incorrect"] },
  { id:"VAL-009", projet:"PRJ-004", objet:"Contrôle verticalité poteaux P3-P5", type:"Contrôle", typeVal:"validation technique chantier", auteur:"S. Kamga (AMOA)", date:"15/04", risque:"Élevé", synthese:"Mesure au fil à plomb : écart >2cm sur P3 et P5. Photo + mesure jointe. Reprise nécessaire.", delai:"18/04", statut:"En attente", pj:true, crit:true, lot:"LOT II", demandeur:"AMOA", avisAMOA:"Non conforme — reprise impérative", hist:["15/04 14:00 — Contrôle terrain","15/04 14:30 — Photo prise","15/04 15:00 — NC documentée","16/04 — En attente correction"] },
];

const ECARTS = [
  { id:"EC-001", projet:"PRJ-004", lot:"LOT II — Gros Œuvre", tache:"O4 — Ferraillage poteaux", type:"Non-conformité", gravite:"Critique", source:"Visite AMOA", constat:"Ferraillage poteaux non conforme au plan PRO. Espacement HA12 > norme.", impact:"Qualité + Sécurité", resp:"Bati-Plus", dateOuv:"15/04", ech:"18/04", statut:"Ouvert", preuve:"Photo + Rapport RV-15", relance:2, loc:"Poteaux P3, P5 — RDC", plan:"1. Reprise ferraillage 2. Contrôle AMOA 3. Validation", commentaires:["16/04 AMOA: Correction impérative avant coulage","16/04 MOEX: Plan d'action soumis"] },
  { id:"EC-002", projet:"PRJ-001", lot:"LOT II — Gros Œuvre", tache:"—", type:"Écart budgétaire", gravite:"Majeur", source:"Rapport SPOC", constat:"Hausse ciment +8% non anticipée. Impact devis lot II.", impact:"Coût (+4%)", resp:"SPOC / AMOA", dateOuv:"12/04", ech:"20/04", statut:"En traitement", preuve:"Facture fournisseur", relance:1, loc:"—", plan:"1. Requalifier devis 2. Notifier client 3. Ajuster budget", commentaires:["14/04 SPOC: Devis actualisé en cours"] },
  { id:"EC-003", projet:"PRJ-004", lot:"LOT I — Travaux Prép.", tache:"O1 — Déblaiement", type:"Retard", gravite:"Majeur", source:"Rapport journalier", constat:"Retard +8 jours sur planning. Cause : approvisionnement et pluie.", impact:"Délai (+8j)", resp:"Bati-Plus", dateOuv:"10/04", ech:"22/04", statut:"Ouvert", preuve:"Planning mis à jour", relance:3, loc:"Zone chantier complète", plan:"1. Rattrapage planning 2. Renfort équipe 3. Suivi quotidien", commentaires:["12/04 MOEX: Renfort prévu","14/04 AMOA: Insuffisant — relance"] },
  { id:"EC-004", projet:"PRJ-004", lot:"LOT III — Clos Couvert", tache:"O6 — Étanchéité toiture", type:"Réserve majeure", gravite:"Majeur", source:"Visite AMOA", constat:"Étanchéité toiture non testée avant pose couverture.", impact:"Qualité", resp:"Bati-Plus", dateOuv:"14/04", ech:"19/04", statut:"Ouvert", preuve:"Photo", relance:1, loc:"Toiture — zone est", plan:"1. Test étanchéité 2. Validation avant couverture", commentaires:["15/04 AMOA: Test obligatoire"] },
  { id:"EC-005", projet:"PRJ-001", lot:"LOT IV — Second Œuvre", tache:"—", type:"Observation", gravite:"Mineur", source:"Vidéo", constat:"Alignement cloisons RDC à vérifier lors prochaine visite.", impact:"Qualité (mineur)", resp:"BTP Cameroun", dateOuv:"16/04", ech:"25/04", statut:"Ouvert", preuve:"Capture vidéo CAM-003", relance:0, loc:"RDC — cloisons intérieures", plan:"Vérification prochaine visite", commentaires:[] },
  { id:"EC-006", projet:"PRJ-004", lot:"LOT II — Gros Œuvre", tache:"O5 — Verticalité poteaux", type:"Non-conformité", gravite:"Critique", source:"Visite AMOA", constat:"Verticalité poteaux hors tolérance (>2cm). Reprise nécessaire.", impact:"Qualité + Sécurité", resp:"Bati-Plus", dateOuv:"15/04", ech:"18/04", statut:"Ouvert", preuve:"Photo + Mesure", relance:2, loc:"Poteaux P3, P5", plan:"1. Reprise verticalité 2. Nouvelle mesure 3. Validation AMOA", commentaires:["15/04 AMOA: Hors tolérance — correction","16/04 MOEX: Reprise prévue 3j"] },
  { id:"R-001", projet:"PRJ-001", lot:"LOT II — Gros Œuvre", tache:"O5 — Coulage semelles", type:"Réserve mineure", gravite:"Mineur", source:"Visite AMOA", constat:"Enrobage ferraillage insuffisant sur 2 poteaux RDC.", impact:"Qualité", resp:"BTP Cameroun", dateOuv:"12/04", ech:"16/04", statut:"Levée", preuve:"Photo avant/après", relance:0, loc:"Poteaux RDC P1,P2", plan:"Correction effectuée", commentaires:["12/04 Constat","14/04 Correction","16/04 Levée"], dateLevee:"16/04" },
  { id:"R-002", projet:"PRJ-006", lot:"—", tache:"—", type:"Observation", gravite:"Mineur", source:"Rapport", constat:"Coordonnées GPS terrain à confirmer avec géomètre.", impact:"Documentation", resp:"AMOA", dateOuv:"08/04", ech:"15/04", statut:"Levée", preuve:"PV géomètre", relance:0, loc:"Parcelle Kribi", plan:"Confirmé par géomètre", commentaires:["08/04 Constat","15/04 PV reçu — levée"], dateLevee:"15/04" },
];

const RAPPORTS = [
  { id:"RJ-16", date:"16/04", type:"Journalier", projet:"PRJ-001", auteur:"B. Ekambi", role:"MOEX", meteo:"Soleil", lot:"LOT II", resume:"Coffrage poteaux R+1. 8 ouvriers. Avancement 75%.", ecarts:0, statut:"À valider", transmissible:false, sensible:false },
  { id:"RJ-15", date:"15/04", type:"Journalier", projet:"PRJ-001", auteur:"B. Ekambi", role:"MOEX", meteo:"Soleil", lot:"LOT II", resume:"Ferraillage R+1 terminé. Attente contrôle AMOA.", ecarts:0, statut:"Validé", transmissible:true, sensible:false },
  { id:"RV-15", date:"15/04", type:"Visite AMOA", projet:"PRJ-004", auteur:"S. Kamga", role:"AMOA", meteo:"Nuageux", lot:"LOT II", resume:"5 non-conformités identifiées. Ferraillage + verticalité.", ecarts:5, statut:"À valider", transmissible:false, sensible:true },
  { id:"RJ-14", date:"14/04", type:"Journalier", projet:"PRJ-004", auteur:"T. Mbede", role:"MOEX", meteo:"Pluie", lot:"LOT I", resume:"Arrêt chantier pour pluie. Jour sans travail justifié.", ecarts:0, statut:"À corriger", transmissible:false, sensible:false },
  { id:"RV-12", date:"12/04", type:"Visite AMOA", projet:"PRJ-001", auteur:"S. Kamga", role:"AMOA", meteo:"Soleil", lot:"LOT II", resume:"Fondations conformes. Réserve mineure enrobage.", ecarts:1, statut:"Validé", transmissible:true, sensible:false },
  { id:"RH-W15", date:"14/04", type:"Hebdomadaire", projet:"PRJ-001", auteur:"S. Kamga", role:"AMOA", meteo:"Variable", lot:"Tous", resume:"Semaine W15 : avancement global 42→44%. Coffrage R+1 lancé. 1 réserve levée.", ecarts:0, statut:"Validé", transmissible:true, sensible:false },
  { id:"RC-001", date:"15/04", type:"Contrôle", projet:"PRJ-004", auteur:"S. Kamga", role:"AMOA", meteo:"Nuageux", lot:"LOT II", resume:"Contrôle ferraillage et verticalité. 2 NC critiques constatées.", ecarts:2, statut:"À valider", transmissible:false, sensible:true },
  { id:"RRU-001", date:"10/04", type:"Réunion", projet:"PRJ-001", auteur:"S. Kamga", role:"AMOA", meteo:"—", lot:"Tous", resume:"Réunion de chantier S14. Points abordés : planning, budget, qualité.", ecarts:0, statut:"Validé", transmissible:true, sensible:false },
];

const ETUDES = [
  { id:"LIV-001", projet:"PRJ-001", type:"Plan de masse", phase:"APS", cat:"Plans", version:"v2", auteur:"Arc. Njoya", date:"08/04", statut:"Validé", completude:100, obsAMOA:"Conforme référentiel WeCare.", action:"—" },
  { id:"LIV-002", projet:"PRJ-001", type:"Plans RDC 1/50", phase:"APD", cat:"Plans", version:"v2", auteur:"Arc. Njoya", date:"10/04", statut:"En revue", completude:90, obsAMOA:"Cotations à vérifier. Réserve #R-003 à intégrer.", action:"Valider ou rejeter" },
  { id:"LIV-003", projet:"PRJ-001", type:"Note de calcul structure", phase:"APD", cat:"Études", version:"v1", auteur:"BET Structure", date:"13/04", statut:"Reçu", completude:70, obsAMOA:"Incomplet : pas de note sismique.", action:"Demander complément" },
  { id:"LIV-004", projet:"PRJ-002", type:"Plans distribution APS", phase:"APS", cat:"Plans", version:"v1", auteur:"Arc. Njoya", date:"12/04", statut:"En revue", completude:85, obsAMOA:"Vérifier conformité nommage pièces + surfaces.", action:"Valider ou rejeter" },
  { id:"LIV-005", projet:"PRJ-004", type:"Diagnostic structure existante", phase:"Diagnostic", cat:"Études", version:"v1", auteur:"BET Diag.", date:"05/04", statut:"Validé", completude:100, obsAMOA:"RAS. Bon état structural global.", action:"—" },
  { id:"LIV-006", projet:"PRJ-004", type:"Devis reprise v2", phase:"Devis", cat:"Devis", version:"v2", auteur:"M. Atangana", date:"14/04", statut:"À corriger", completude:60, obsAMOA:"Écart +18%. Poste ferraillage à requalifier.", action:"Correction requise" },
  { id:"LIV-007", projet:"PRJ-006", type:"Rapport faisabilité terrain", phase:"Pré-faisabilité", cat:"Rapports", version:"v1", auteur:"S. Kamga", date:"08/04", statut:"Validé", completude:100, obsAMOA:"Terrain exploitable. Recommandation G2 AVP.", action:"—" },
  { id:"LIV-008", projet:"PRJ-006", type:"Étude géotechnique G2 AVP", phase:"Pré-faisabilité", cat:"Études", version:"—", auteur:"—", date:"—", statut:"Attendu", completude:0, obsAMOA:"Non encore commandée. Priorité haute.", action:"Lancer commande" },
  { id:"LIV-009", projet:"PRJ-001", type:"PV réception fondations", phase:"Réception", cat:"PV", version:"v1", auteur:"S. Kamga", date:"05/04", statut:"Validé", completude:100, obsAMOA:"Fondations conformes. Réserves mineures levées.", action:"—" },
  { id:"LIV-010", projet:"PRJ-001", type:"DOE partiel — Fondations", phase:"DOE", cat:"DOE", version:"v1", auteur:"BTP Cameroun", date:"06/04", statut:"Reçu", completude:80, obsAMOA:"Plans de récolement à compléter.", action:"Demander complément" },
];

const DOCS = [
  { id:"DOC-001", nom:"Plan de masse v2.dwg", cat:"Plans", projet:"PRJ-001", version:"v2", date:"08/04", auteur:"Arc. Njoya", statut:"Validé", client:true, lien:"LIV-001", taille:"2.4 MB" },
  { id:"DOC-002", nom:"Plans RDC 1/50 v2.pdf", cat:"Plans", projet:"PRJ-001", version:"v2", date:"10/04", auteur:"Arc. Njoya", statut:"En revue", client:false, lien:"VAL-003", taille:"5.1 MB" },
  { id:"DOC-003", nom:"Rapport visite 15-04.pdf", cat:"Rapports", projet:"PRJ-004", version:"v1", date:"15/04", auteur:"S. Kamga", statut:"À valider", client:false, lien:"VAL-005", taille:"1.8 MB" },
  { id:"DOC-004", nom:"Devis reprise v2.xlsx", cat:"Devis", projet:"PRJ-004", version:"v2", date:"14/04", auteur:"M. Atangana", statut:"À corriger", client:false, lien:"VAL-002", taille:"890 KB" },
  { id:"DOC-005", nom:"PV réception fondations.pdf", cat:"PV", projet:"PRJ-001", version:"v1", date:"05/04", auteur:"S. Kamga", statut:"Validé", client:true, lien:"—", taille:"1.2 MB" },
  { id:"DOC-006", nom:"Photo ferraillage NC.jpg", cat:"Photos", projet:"PRJ-004", version:"—", date:"15/04", auteur:"S. Kamga", statut:"Rattaché", client:false, lien:"EC-001", taille:"3.5 MB" },
  { id:"DOC-007", nom:"Contrat MOE PRJ-001.pdf", cat:"Contrats", projet:"PRJ-001", version:"v1", date:"15/01", auteur:"Admin", statut:"Signé", client:true, lien:"—", taille:"420 KB" },
  { id:"DOC-008", nom:"Faisabilité Kribi.pdf", cat:"Études", projet:"PRJ-006", version:"v1", date:"08/04", auteur:"S. Kamga", statut:"Validé", client:true, lien:"LIV-007", taille:"2.1 MB" },
  { id:"DOC-009", nom:"DOE Fondations partiel.zip", cat:"DOE", projet:"PRJ-001", version:"v1", date:"06/04", auteur:"BTP Cameroun", statut:"Reçu", client:false, lien:"LIV-010", taille:"15.3 MB" },
  { id:"DOC-010", nom:"Photo verticalité NC.jpg", cat:"Photos", projet:"PRJ-004", version:"—", date:"15/04", auteur:"S. Kamga", statut:"Rattaché", client:false, lien:"EC-006", taille:"2.8 MB" },
  { id:"DOC-MANQ-001", nom:"Étude G2 AVP", cat:"Études", projet:"PRJ-006", version:"—", date:"—", auteur:"—", statut:"Manquant", client:false, lien:"LIV-008", taille:"—" },
  { id:"DOC-MANQ-002", nom:"Note sismique", cat:"Études", projet:"PRJ-001", version:"—", date:"—", auteur:"—", statut:"Manquant", client:false, lien:"LIV-003", taille:"—" },
];

const CAMS = [
  { id:"CAM-001", nom:"Entrée chantier", zone:"Accès", projet:"PRJ-001", s:"En ligne", evts:[{time:"16/04 08:14",type:"Mouvement détecté",desc:"Arrivée équipe matin — 8 personnes identifiées"},{time:"16/04 07:55",type:"Mouvement détecté",desc:"Ouverture portail chantier"}] },
  { id:"CAM-002", nom:"Zone matériaux", zone:"Stock", projet:"PRJ-001", s:"En ligne", evts:[{time:"16/04 07:30",type:"Livraison détectée",desc:"Camion benne — déchargement agrégats"},{time:"15/04 16:45",type:"Activité hors plage",desc:"Mouvement détecté après 17h — vérifier"}] },
  { id:"CAM-003", nom:"Front GO R+1", zone:"Gros Œuvre", projet:"PRJ-001", s:"En ligne", evts:[{time:"16/04 09:45",type:"Activité continue",desc:"Coffrage en cours — 4 ouvriers visibles"},{time:"16/04 08:30",type:"Observation visuelle",desc:"Alignement cloisons à vérifier — lié EC-005"}], lienEc:"EC-005" },
  { id:"CAM-004", nom:"Panoramique 360°", zone:"Vue globale", projet:"PRJ-001", s:"Hors ligne", evts:[{time:"14/04 18:00",type:"Anomalie",desc:"Coupure réseau — flux indisponible depuis 48h"}] },
  { id:"CAM-005", nom:"Entrée chantier Bali", zone:"Accès", projet:"PRJ-004", s:"En ligne", evts:[{time:"15/04 16:20",type:"Baisse d'activité",desc:"Fin de journée anticipée — départ à 16h20"}] },
  { id:"CAM-006", nom:"Zone GO Bali", zone:"Gros Œuvre", projet:"PRJ-004", s:"En ligne", evts:[{time:"15/04 14:10",type:"Baisse d'activité",desc:"Activité réduite — 2 ouvriers vs 6 attendus"},{time:"15/04 11:00",type:"Anomalie sécurité",desc:"Absence EPI détectée — 1 ouvrier sans casque"}], lienEc:"EC-006" },
];

const MESSAGES = [
  { id:"MSG-001", from:"M. Atangana", role:"SPOC", projet:"PRJ-004", sujet:"Devis reprise — écart +18%", prio:"Haute", attente:true, lien:"VAL-002", canal:"AMOA ↔ SPOC", msgs:[
    { auteur:"M. Atangana", role:"SPOC", txt:"Le client questionne l'écart de +18% sur le devis. Peux-tu qualifier les postes concernés ?", time:"15/04 09:30", lu:true },
    { auteur:"S. Kamga", role:"AMOA", txt:"J'ai identifié le poste ferraillage comme principal facteur. Rapport de visite en cours de finalisation.", time:"15/04 11:15", lu:true },
    { auteur:"M. Atangana", role:"SPOC", txt:"OK. Le client attend une réponse avant vendredi. Merci de prioriser.", time:"15/04 14:00", lu:true },
  ]},
  { id:"MSG-002", from:"Arc. Njoya", role:"MOE", projet:"PRJ-001", sujet:"Plans RDC v2 — réserve intégrée", prio:"Moyenne", attente:false, lien:"VAL-003", canal:"SPOC ↔ MOE ↔ AMOA", msgs:[
    { auteur:"Arc. Njoya", role:"MOE", txt:"Plans RDC v2 transmis avec correction de la réserve #R-003. Merci de valider.", time:"10/04 14:00", lu:true },
    { auteur:"S. Kamga", role:"AMOA", txt:"Reçu. Vérification en cours. Retour prévu d'ici vendredi.", time:"10/04 16:45", lu:true },
  ]},
  { id:"MSG-003", from:"BTP Cameroun", role:"MOEX", projet:"PRJ-001", sujet:"Demande matériaux — 200 sacs ciment", prio:"Moyenne", attente:true, lien:"VAL-006", canal:"SPOC ↔ MOE ↔ AMOA ↔ MOEX", msgs:[
    { auteur:"B. Ekambi", role:"MOEX", txt:"DA-005 soumise pour 200 sacs ciment CPJ. Besoin urgent pour coulage jeudi.", time:"15/04 17:00", lu:true },
  ]},
  { id:"MSG-004", from:"Bati-Plus", role:"MOEX", projet:"PRJ-004", sujet:"Correction ferraillage — plan d'action", prio:"Haute", attente:true, lien:"EC-001", canal:"SPOC ↔ MOE ↔ AMOA ↔ MOEX", msgs:[
    { auteur:"T. Mbede", role:"MOEX", txt:"Suite à votre constat, nous prévoyons reprise ferraillage poteaux P3 et P5. Délai estimé 3 jours.", time:"16/04 08:00", lu:false },
  ]},
  { id:"MSG-005", from:"J-P Fouda", role:"Client", projet:"PRJ-001", sujet:"Questions sur avancement", prio:"Faible", attente:false, lien:"—", canal:"Client ↔ AMOA", msgs:[
    { auteur:"J-P Fouda", role:"Client", txt:"Merci pour le rapport de visite. Tout est conforme ?", time:"13/04 20:00", lu:true },
    { auteur:"S. Kamga", role:"AMOA", txt:"Oui, fondations conformes. Réserve mineure levée. Construction en bonne voie.", time:"14/04 09:00", lu:true },
  ]},
];

const FEED_ITEMS = [
  { time:"16/04 09:50", type:"rapport", txt:"Nouveau rapport RJ-16 soumis par B. Ekambi (PRJ-001)", projet:"PRJ-001", lien:"RJ-16" },
  { time:"16/04 08:00", type:"message", txt:"Message Bati-Plus : plan d'action correction ferraillage (PRJ-004)", projet:"PRJ-004", lien:"MSG-004" },
  { time:"15/04 17:00", type:"validation", txt:"DA-005 soumise — 200 sacs ciment CPJ (PRJ-001)", projet:"PRJ-001", lien:"VAL-006" },
  { time:"15/04 15:00", type:"reserve", txt:"2 NC critiques documentées : ferraillage + verticalité (PRJ-004)", projet:"PRJ-004", lien:"EC-001" },
  { time:"15/04 14:10", type:"camera", txt:"Baisse d'activité détectée CAM-006 — 2 ouvriers vs 6 attendus", projet:"PRJ-004", lien:"CAM-006" },
  { time:"15/04 11:00", type:"ia", txt:"IA : Anomalie sécurité — absence EPI détectée sur CAM-006", projet:"PRJ-004", lien:"CAM-006" },
  { time:"14/04 14:00", type:"document", txt:"Devis reprise v2 déposé par M. Atangana (PRJ-004)", projet:"PRJ-004", lien:"DOC-004" },
  { time:"14/04 09:00", type:"relance", txt:"Relance envoyée à Bati-Plus — retard +8j (PRJ-004)", projet:"PRJ-004", lien:"EC-003" },
];

/* ─── COMPOSANTS UI RÉUTILISABLES ─── */
function Badge({ children, v = "default", s = "sm", onClick }) {
  const m = {
    default:{bg:C.priL,c:C.priD}, success:{bg:C.okL,c:C.okD}, warning:{bg:C.warnL,c:C.warnD},
    danger:{bg:C.errL,c:C.errD}, info:{bg:C.infoL,c:C.infoD}, purple:{bg:C.purpL,c:C.purpD},
    dark:{bg:C.bg2,c:"#1F2937"}, active:{bg:C.secL,c:C.secD},
    critique:{bg:"#FEE2E2",c:"#991B1B"}, majeur:{bg:"#FEF3C7",c:"#92400E"},
    mineur:{bg:"#DBEAFE",c:"#1E40AF"}, leve:{bg:C.okL,c:C.okD},
  };
  const st = m[v] || m.default;
  return <span onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:3, padding:s==="xs"?"1px 5px":"2px 9px", borderRadius:20, fontSize:s==="xs"?9:10, fontWeight:600, background:st.bg, color:st.c, whiteSpace:"nowrap", letterSpacing:0.2, cursor:onClick?"pointer":"default" }}>{children}</span>;
}
function SB({ s }) {
  const m = { "En attente":"warning","À valider":"warning","En revue":"info","Validé":"success","Validée":"success","Rejetée":"danger","Reçu":"default","À corriger":"danger","Attendu":"dark","Ouvert":"danger","En traitement":"warning","Levée":"success","Levé":"success","Signé":"success","Manquant":"danger","Rattaché":"purple","En ligne":"success","Hors ligne":"danger","Actif":"success","Brouillon":"dark","En validation":"warning","Transmissible":"active","Terminé":"success","En cours":"info","Non démarré":"dark","Critique":"danger","En retard":"danger","Bloqué":"danger","Non conforme":"danger","Non testé":"warning","Fait":"success","À venir":"dark" };
  return <Badge v={m[s]||"default"}>{s}</Badge>;
}
function GravBadge({ g }) {
  const m = { "Critique":"critique","Majeur":"majeur","Élevé":"critique","Mineur":"mineur","Levée":"leve","Information":"info" };
  return <Badge v={m[g]||"default"} s="xs">{g}</Badge>;
}
function CritBadge({ level }) {
  const cfg = { critique:{bg:C.errL,c:C.errD,icon:AlertOctagon}, elevee:{bg:"#FEF3C7",c:C.warnD,icon:AlertTriangle}, moderee:{bg:C.infoL,c:C.infoD,icon:Info}, information:{bg:C.bg2,c:C.g,icon:Info} };
  const s = cfg[level]||cfg.information;
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:12,fontSize:9,fontWeight:700,background:s.bg,color:s.c}}><s.icon size={10}/>{level.charAt(0).toUpperCase()+level.slice(1)}</span>;
}

function Kpi({ icon:I, label, value, sub, trend, color=C.sec, accent, onClick }) {
  return <div onClick={onClick} style={{ background:C.w, borderRadius:10, padding:"12px 14px", border:"1px solid "+C.brd, flex:1, minWidth:130, position:"relative", overflow:"hidden", cursor:onClick?"pointer":"default", transition:"box-shadow 0.15s" }} onMouseEnter={e=>{if(onClick)e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.08)"}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none"}}>
    {accent && <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:color, borderRadius:"10px 0 0 10px" }}/>}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div style={{ width:28, height:28, borderRadius:7, background:color+"14", display:"flex", alignItems:"center", justifyContent:"center" }}><I size={13} color={color}/></div>
      {trend!==undefined && <span style={{ fontSize:10, fontWeight:600, color:trend>=0?C.ok:C.err, display:"flex", alignItems:"center", gap:1 }}>{trend>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{Math.abs(trend)}%</span>}
    </div>
    <div style={{ fontSize:17, fontWeight:800, color:C.dk, marginTop:5 }}>{value}</div>
    <div style={{ fontSize:10, color:C.g, marginTop:1 }}>{label}</div>
    {sub && <div style={{ fontSize:9, color:C.lG }}>{sub}</div>}
    {onClick && <div style={{position:"absolute",bottom:4,right:8,fontSize:8,color:C.sec}}>Détails →</div>}
  </div>;
}

function Pr({ value, plan, h=5 }) {
  return <div style={{ width:"100%", background:C.bg2, borderRadius:h, height:h, overflow:"hidden", position:"relative" }}>
    {plan!==undefined && <div style={{ position:"absolute", left:Math.min(100,plan)+"%", top:0, width:1.5, height:"100%", background:C.lG, zIndex:2 }}/>}
    <div style={{ width:Math.min(100,value)+"%", height:"100%", borderRadius:h, background:value>=80?C.ok:value>=40?C.sec:value>=20?C.warn:C.err, transition:"width 0.4s" }}/>
  </div>;
}

function Cd({ children, style:es, onClick, accent }) {
  return <div onClick={onClick} style={{ background:C.w, borderRadius:10, padding:14, border:"1px solid "+C.brd, cursor:onClick?"pointer":"default", position:"relative", overflow:"hidden", ...es }}>
    {accent && <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:accent }}/>}
    {children}
  </div>;
}

function Bt({ children, v="primary", icon:I, onClick, small, disabled }) {
  const p = v==="primary"; const d = v==="danger";
  return <button disabled={disabled} onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:4, borderRadius:6, fontWeight:600, cursor:disabled?"not-allowed":"pointer", fontSize:small?10:11, padding:small?"3px 8px":"5px 11px", background:p?C.sec:d?C.err:C.bgL, color:p||d?"#fff":C.dkG, border:p||d?"none":"1px solid "+C.brd, opacity:disabled?0.5:1, transition:"all 0.15s" }}>{I && <I size={small?10:12}/>}{children}</button>;
}

function ST({ children, right }) {
  return <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
    <h3 style={{ fontSize:13, fontWeight:700, color:C.dk, margin:0 }}>{children}</h3>
    {right}
  </div>;
}

function Tbl({ cols, data, compact, onRowClick }) {
  return <div style={{ overflowX:"auto", borderRadius:8, border:"1px solid "+C.brd }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
      <thead><tr style={{ background:C.bgL }}>{cols.map((c,i) => <th key={i} style={{ padding:compact?"5px 8px":"7px 10px", textAlign:"left", fontWeight:600, color:C.g, fontSize:9, textTransform:"uppercase", letterSpacing:0.5, borderBottom:"1px solid "+C.brd }}>{c.label}</th>)}</tr></thead>
      <tbody>{data.map((r,ri) => <tr key={ri} onClick={()=>onRowClick&&onRowClick(r)} style={{ borderBottom:"1px solid "+C.brd, background:r._highlight?C.errL+"40":"transparent", cursor:onRowClick?"pointer":"default", transition:"background 0.1s" }} onMouseEnter={e=>{if(onRowClick)e.currentTarget.style.background=C.bgL}} onMouseLeave={e=>{e.currentTarget.style.background=r._highlight?C.errL+"40":"transparent"}}>{cols.map((c,ci) => <td key={ci} style={{ padding:compact?"5px 8px":"7px 10px", color:C.dkG, verticalAlign:"top" }}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function TabBar({ tabs, active, onChange }) {
  return <div style={{ display:"flex", gap:2, background:C.bg2, borderRadius:7, padding:2, flexWrap:"wrap" }}>
    {tabs.map(t => <button key={t.k} onClick={()=>onChange(t.k)} style={{ padding:"5px 12px", borderRadius:5, border:"none", cursor:"pointer", fontSize:10, fontWeight:active===t.k?700:500, background:active===t.k?C.w:"transparent", color:active===t.k?C.dk:C.g, boxShadow:active===t.k?"0 1px 3px rgba(0,0,0,0.06)":"none", transition:"all 0.15s" }}>{t.l}{t.count!==undefined && <span style={{ marginLeft:4, fontSize:8, fontWeight:700, padding:"0 4px", borderRadius:8, background:active===t.k?C.sec+"18":C.bg2, color:active===t.k?C.sec:C.lG }}>{t.count}</span>}</button>)}
  </div>;
}

function TempBadge({ t }) {
  const cfg = { favorable:{c:C.ok,l:"Favorable"}, stable:{c:C.warn,l:"Stable"}, "dégradé":{c:C.err,l:"Dégradé"} };
  const s = cfg[t]||cfg.stable;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:9, fontWeight:600, color:s.c }}>●{" "}{s.l}</span>;
}

function fmt(n) { return n>=1e6?(n/1e6).toFixed(1)+"M":(n/1e3).toFixed(0)+"K"; }

function ProjectSelector({ value, onChange, allOption }) {
  return <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid "+C.brd,fontSize:10,fontWeight:600,background:C.w,color:C.dk,cursor:"pointer",outline:"none"}}>
    {allOption && <option value="all">Tous les projets</option>}
    {PROJECTS.map(p=><option key={p.id} value={p.id}>{p.id} — {p.nom}</option>)}
  </select>;
}

/* ─── DRAWER / MODAL ─── */
function Drawer({ open, onClose, title, width=480, children }) {
  if(!open) return null;
  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:1000,display:"flex",justifyContent:"flex-end"}}>
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)"}}/>
    <div style={{position:"relative",width,maxWidth:"90vw",height:"100vh",background:C.w,boxShadow:"-4px 0 20px rgba(0,0,0,0.1)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid "+C.brd,flexShrink:0}}>
        <h3 style={{fontSize:14,fontWeight:700,color:C.dk,margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.g,display:"flex"}}><X size={16}/></button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:18}}>{children}</div>
    </div>
  </div>;
}

function Modal({ open, onClose, title, children, wide }) {
  if(!open) return null;
  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)"}}/>
    <div style={{position:"relative",width:wide?720:520,maxWidth:"92vw",maxHeight:"85vh",background:C.w,borderRadius:12,boxShadow:"0 10px 40px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid "+C.brd}}>
        <h3 style={{fontSize:14,fontWeight:700,color:C.dk,margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.g,display:"flex"}}><X size={16}/></button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:20}}>{children}</div>
    </div>
  </div>;
}

function DetailRow({ label, value, color }) {
  return <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+C.brd+"80",fontSize:10}}>
    <span style={{color:C.g,fontWeight:500}}>{label}</span>
    <span style={{color:color||C.dk,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{value}</span>
  </div>;
}

function HistoryTimeline({ items }) {
  return <div style={{display:"flex",flexDirection:"column",gap:0}}>
    {items.map((it,i) => <div key={i} style={{display:"flex",gap:10,paddingLeft:4}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:i===0?C.sec:C.brd,marginTop:4,flexShrink:0}}/>
        {i<items.length-1 && <div style={{width:1,flex:1,background:C.brd}}/>}
      </div>
      <div style={{fontSize:10,color:C.dkG,paddingBottom:8,lineHeight:1.5}}>{it}</div>
    </div>)}
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 1. COCKPIT AMOA                                                      */
/* ══════════════════════════════════════════════════════════════════════ */
function PageCockpit({ onNav }) {
  const [urgentDrawer, setUrgentDrawer] = useState(null);
  const [kpiDrawer, setKpiDrawer] = useState(null);

  const vEnAttente = VALIDATIONS.filter(v=>v.statut==="En attente");
  const ecOuverts = ECARTS.filter(e=>e.statut==="Ouvert"||e.statut==="En traitement");
  const resCrit = ECARTS.filter(e=>e.gravite==="Critique"&&e.statut!=="Levée");
  const rapAVal = RAPPORTS.filter(r=>r.statut==="À valider");
  const actCorr = ECARTS.filter(e=>e.statut==="Ouvert"&&e.ech);

  const urgentActions = [
    { m:"Valider rapport RJ-16 — Coffrage R+1", t:"Validation", c:"warning", dl:"Aujourd'hui", projet:"PRJ-001", lot:"LOT II", op:"O9 — Coffrage poteaux R+1", crit:"moderee", orig:"MOEX — soumission automatique", resp:"S. Kamga (AMOA)", ech:"17/04", pj:"RJ-16.pdf", lienId:"VAL-001" },
    { m:"Qualifier écart +18% devis reprise", t:"Contrôle budget", c:"danger", dl:"18/04", projet:"PRJ-004", lot:"—", op:"Devis global", crit:"elevee", orig:"Analyse SPOC", resp:"S. Kamga (AMOA)", ech:"18/04", pj:"Devis v2.xlsx", lienId:"VAL-002" },
    { m:"Documenter NC ferraillage — 2 constats critiques", t:"Non-conformité", c:"danger", dl:"18/04", projet:"PRJ-004", lot:"LOT II", op:"O4 — Ferraillage", crit:"critique", orig:"Visite AMOA 15/04", resp:"Bati-Plus", ech:"18/04", pj:"Photo ferraillage", lienId:"EC-001" },
    { m:"Vérifier cohérence rapport RV-15 vs vidéo CAM-006", t:"Corroboration", c:"warning", dl:"17/04", projet:"PRJ-004", lot:"LOT II", op:"—", crit:"elevee", orig:"IA KOMA — détection", resp:"S. Kamga (AMOA)", ech:"17/04", pj:"CAM-006 capture", lienId:"RV-15" },
    { m:"Plan RDC v2 en revue depuis 6 jours", t:"Livrable", c:"info", dl:"20/04", projet:"PRJ-001", lot:"LOT II", op:"Plans APD", crit:"moderee", orig:"Workflow validation", resp:"S. Kamga (AMOA)", ech:"20/04", pj:"Plans RDC v2.pdf", lienId:"VAL-003" },
    { m:"Remonter situation PRJ-004 au SPOC — escalade", t:"Escalade", c:"danger", dl:"Aujourd'hui", projet:"PRJ-004", lot:"Tous", op:"Projet global", crit:"critique", orig:"Analyse risque AMOA", resp:"S. Kamga → M. Atangana", ech:"16/04", pj:"—", lienId:"PRJ-004" },
  ];

  const colorMap = { danger:C.err, warning:C.warn, info:C.info };

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Cockpit AMOA</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Tour de contrôle</h2>
        <div style={{ fontSize:10, color:C.g }}>Mercredi 16 avril 2026 · S. Kamga</div>
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <Bt icon={Plus} v="ghost" onClick={()=>setKpiDrawer("new-reserve")}>Nouvelle réserve</Bt>
        <Bt icon={FileCheck} onClick={()=>onNav("validations")}>Valider en lot</Bt>
      </div>
    </div>

    {/* SYNTHÈSE EXÉCUTIVE */}
    <Cd style={{ background:"linear-gradient(135deg, "+C.sec+"08, "+C.pri+"04)", border:"1px solid "+C.sec+"20" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <Target size={14} color={C.sec}/>
        <span style={{ fontSize:13, fontWeight:700, color:C.dk }}>Synthèse exécutive</span>
      </div>
      <div style={{ fontSize:11, color:C.dkG, lineHeight:1.7 }}>
        <b>Attention prioritaire :</b> PRJ-004 concentre 6 écarts ouverts dont 2 critiques (ferraillage + verticalité). Escalade au SPOC recommandée.
        Le devis reprise présente un écart de +18% nécessitant requalification du poste ferraillage avant transmission au client.<br/>
        <b>PRJ-001 :</b> Avancement conforme. Rapport RJ-16 à valider. Note de calcul structure incomplète (pas de note sismique).<br/>
        <b>Publiable au client :</b> Rapport visite RV-12, rapport RJ-15, plan de masse v2, PV fondations.<br/>
        <b>Prudence :</b> Ne pas transmettre rapport RV-15 (PRJ-004) avant consolidation des corrections.
      </div>
    </Cd>

    {/* KPI EXÉCUTIF — DRILLABLE */}
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      <Kpi icon={Briefcase} label="Projets suivis" value="4" color={C.sec} accent onClick={()=>setKpiDrawer("projets")}/>
      <Kpi icon={Clock} label="Validations en attente" value={String(vEnAttente.length)} color={C.warn} accent onClick={()=>setKpiDrawer("validations")}/>
      <Kpi icon={AlertTriangle} label="Écarts ouverts" value={String(ecOuverts.length)} color={C.err} accent onClick={()=>setKpiDrawer("ecarts")}/>
      <Kpi icon={Shield} label="Réserves critiques" value={String(resCrit.length)} color={C.err} accent onClick={()=>setKpiDrawer("reserves")}/>
      <Kpi icon={FileCheck} label="Rapports à relire" value={String(rapAVal.length)} color={C.info} accent onClick={()=>setKpiDrawer("rapports")}/>
      <Kpi icon={CircleAlert} label="Actions corr. retard" value={String(actCorr.filter(e=>{ const d=parseInt(e.ech.split("/")[0]); return d<=16; }).length)} color={C.rose} accent onClick={()=>setKpiDrawer("correctives")}/>
    </div>

    {/* ACTIONS URGENTES */}
    <Cd accent={C.err} style={{ background:C.errL+"12" }}>
      <ST right={<Badge v="danger" s="xs">{urgentActions.length} actions</Badge>}>⚡ Actions urgentes AMOA</ST>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {urgentActions.map((a,i) => <div key={i} onClick={()=>setUrgentDrawer(a)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:6, background:C.w, border:"1px solid "+C.brd, borderLeft:"3px solid "+(colorMap[a.c]||C.g), cursor:"pointer", transition:"background 0.1s" }} onMouseEnter={e=>{e.currentTarget.style.background=C.bgL}} onMouseLeave={e=>{e.currentTarget.style.background=C.w}}>
          <CritBadge level={a.crit}/>
          <div style={{ flex:1 }}><span style={{ fontSize:11, color:C.dk, fontWeight:500 }}>{a.m}</span></div>
          <Badge v={a.c==="danger"?"danger":a.c==="warning"?"warning":"info"} s="xs">{a.t}</Badge>
          <span style={{ fontSize:9, color:C.lG, minWidth:60, textAlign:"right" }}>{a.dl}</span>
          <ChevronRight size={12} color={C.lG}/>
        </div>)}
      </div>
    </Cd>

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
      <Cd accent={C.warn}>
        <ST right={<span onClick={()=>onNav("validations")} style={{ fontSize:10, color:C.sec, cursor:"pointer", fontWeight:600 }}>Voir tout →</span>}>Validations à traiter</ST>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {vEnAttente.slice(0,4).map(v => <div key={v.id} onClick={()=>onNav("validations")} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:5, background:v.crit?C.errL+"30":C.bgL, border:"1px solid "+(v.crit?C.err+"20":C.brd), cursor:"pointer" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:600, color:C.dk }}>{v.objet}</div>
              <div style={{ fontSize:9, color:C.g }}>{v.projet} · {v.auteur} · {v.date}</div>
            </div>
            <Badge v={v.risque==="Élevé"?"danger":v.risque==="Moyen"?"warning":"default"} s="xs">{v.risque}</Badge>
          </div>)}
        </div>
      </Cd>

      <Cd accent={C.err}>
        <ST right={<span onClick={()=>onNav("ecarts")} style={{ fontSize:10, color:C.sec, cursor:"pointer", fontWeight:600 }}>Voir tout →</span>}>Écarts critiques</ST>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {ECARTS.filter(e=>e.gravite==="Critique"&&e.statut!=="Levée").map(e => <div key={e.id} onClick={()=>onNav("ecarts")} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:5, background:C.errL+"20", border:"1px solid "+C.err+"15", cursor:"pointer" }}>
            <AlertOctagon size={12} color={C.err}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:600, color:C.dk }}>{e.constat.substring(0,60)}…</div>
              <div style={{ fontSize:9, color:C.g }}>{e.projet} · {e.lot} · {e.resp}</div>
            </div>
            <span style={{ fontSize:9, color:C.err, fontWeight:600 }}>Éch. {e.ech}</span>
          </div>)}
        </div>
      </Cd>
    </div>

    {/* PROJETS SOUS SURVEILLANCE */}
    <ST>Projets sous surveillance</ST>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:10 }}>
      {PROJECTS.map(p => <Cd key={p.id} onClick={()=>onNav("projets")} style={{ cursor:"pointer" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <div>
            <span style={{ fontFamily:"monospace", fontSize:9, color:C.sec }}>{p.id}</span>
            <div style={{ fontSize:13, fontWeight:700, color:C.dk }}>{p.nom}</div>
            <div style={{ fontSize:9, color:C.g }}><MapPin size={8} style={{display:"inline"}}/> {p.loc} · {p.phase}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
            <Badge v={p.risque==="Élevé"?"danger":p.risque==="Modéré"?"warning":"success"} s="xs">{p.risque}</Badge>
            <TempBadge t={p.tempCtrl}/>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
          <span style={{ fontSize:10, color:C.g }}>Avancement</span>
          <span style={{ fontSize:10, fontWeight:700, color:C.sec }}>{p.av}%<span style={{color:C.lG,fontWeight:400}}> / {p.avPlan}% plan</span></span>
        </div>
        <Pr value={p.av} plan={p.avPlan}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4, marginTop:8 }}>
          {[ { l:"Budget", v:fmt(p.budget) }, { l:"Conform.", v:p.conformite+"%", c:p.conformite<70?C.err:p.conformite<85?C.warn:C.ok }, { l:"Réserves", v:String(p.reservesOuv), c:p.reservesOuv>2?C.err:C.g }, { l:"Valid.", v:String(p.validAttente), c:p.validAttente>3?C.warn:C.g } ].map((k,i) => <div key={i} style={{ padding:"3px 5px", borderRadius:3, background:C.bgL, fontSize:9, textAlign:"center" }}>
            <div style={{ color:C.g }}>{k.l}</div>
            <div style={{ fontWeight:700, color:k.c||C.dk }}>{k.v}</div>
          </div>)}
        </div>
        <div style={{ marginTop:6, fontSize:9, color:C.g }}>Jalon : <b style={{color:C.dk}}>{p.prochJalon}</b></div>
      </Cd>)}
    </div>

    {/* DRAWER ACTION URGENTE */}
    <Drawer open={!!urgentDrawer} onClose={()=>setUrgentDrawer(null)} title={urgentDrawer?"Détail action urgente":""}>
      {urgentDrawer && <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <CritBadge level={urgentDrawer.crit}/>
        <h4 style={{fontSize:14,fontWeight:700,color:C.dk,margin:0}}>{urgentDrawer.m}</h4>
        <DetailRow label="Projet" value={urgentDrawer.projet}/>
        <DetailRow label="Lot" value={urgentDrawer.lot}/>
        <DetailRow label="Opération" value={urgentDrawer.op}/>
        <DetailRow label="Criticité" value={urgentDrawer.crit}/>
        <DetailRow label="Origine" value={urgentDrawer.orig}/>
        <DetailRow label="Responsable" value={urgentDrawer.resp}/>
        <DetailRow label="Échéance" value={urgentDrawer.ech} color={C.err}/>
        <DetailRow label="Pièce jointe" value={urgentDrawer.pj}/>
        <DetailRow label="Lié à" value={urgentDrawer.lienId}/>
        <ST>Historique</ST>
        <HistoryTimeline items={["Détecté le 15/04","Documenté le 15/04","En attente de traitement"]}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          <Bt icon={CheckCircle2}>Traiter</Bt>
          <Bt icon={Send} v="ghost">Relancer</Bt>
          <Bt icon={Flag} v="ghost">Escalader</Bt>
          <Bt icon={FileText} v="ghost">Ouvrir document</Bt>
          <Bt icon={MessageSquare} v="ghost">Commenter</Bt>
        </div>
      </div>}
    </Drawer>

    {/* DRAWER KPI */}
    <Drawer open={!!kpiDrawer} onClose={()=>setKpiDrawer(null)} title={kpiDrawer==="projets"?"Projets suivis":kpiDrawer==="validations"?"Validations en attente":kpiDrawer==="ecarts"?"Écarts ouverts":kpiDrawer==="reserves"?"Réserves critiques":kpiDrawer==="rapports"?"Rapports à relire":kpiDrawer==="correctives"?"Actions correctives en retard":"Détail"}>
      {kpiDrawer==="projets" && PROJECTS.map(p=><div key={p.id} style={{padding:"8px 0",borderBottom:"1px solid "+C.brd}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:11}}>{p.nom}</span><Badge v={p.risque==="Élevé"?"danger":"success"} s="xs">{p.risque}</Badge></div>
        <div style={{fontSize:9,color:C.g}}>{p.phase} · Av. {p.av}% · Conform. {p.conformite}%</div>
      </div>)}
      {kpiDrawer==="validations" && vEnAttente.map(v=><div key={v.id} style={{padding:"8px 0",borderBottom:"1px solid "+C.brd}}>
        <div style={{fontWeight:600,fontSize:11}}>{v.objet}</div>
        <div style={{fontSize:9,color:C.g}}>{v.projet} · {v.auteur} · Éch. {v.delai}</div>
      </div>)}
      {kpiDrawer==="ecarts" && ecOuverts.map(e=><div key={e.id} style={{padding:"8px 0",borderBottom:"1px solid "+C.brd}}>
        <div style={{display:"flex",gap:4,alignItems:"center"}}><GravBadge g={e.gravite}/><span style={{fontWeight:600,fontSize:11}}>{e.constat.substring(0,50)}…</span></div>
        <div style={{fontSize:9,color:C.g}}>{e.projet} · {e.lot} · {e.resp}</div>
      </div>)}
      {kpiDrawer==="reserves" && resCrit.map(e=><div key={e.id} style={{padding:"8px 0",borderBottom:"1px solid "+C.brd}}>
        <div style={{display:"flex",gap:4,alignItems:"center"}}><GravBadge g={e.gravite}/><span style={{fontWeight:600,fontSize:11}}>{e.constat.substring(0,50)}…</span></div>
        <div style={{fontSize:9,color:C.g}}>{e.projet} · {e.lot}</div>
      </div>)}
      {kpiDrawer==="rapports" && rapAVal.map(r=><div key={r.id} style={{padding:"8px 0",borderBottom:"1px solid "+C.brd}}>
        <div style={{fontWeight:600,fontSize:11}}>{r.id} — {r.type}</div>
        <div style={{fontSize:9,color:C.g}}>{r.projet} · {r.auteur} · {r.date}</div>
      </div>)}
      {kpiDrawer==="new-reserve" && <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{fontSize:11,color:C.g}}>Formulaire de création de réserve</div>
        <select style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.brd,fontSize:11}}><option>Choisir un projet...</option>{PROJECTS.map(p=><option key={p.id}>{p.id} — {p.nom}</option>)}</select>
        <input placeholder="Description du constat..." style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.brd,fontSize:11}}/>
        <select style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.brd,fontSize:11}}><option>Gravité...</option><option>Critique</option><option>Majeur</option><option>Mineur</option></select>
        <input placeholder="Lot concerné..." style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.brd,fontSize:11}}/>
        <input placeholder="Responsable..." style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.brd,fontSize:11}}/>
        <Bt icon={Plus}>Créer la réserve</Bt>
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 2. MES PROJETS                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function PageProjets() {
  const [filtre, setFiltre] = useState("tous");
  const [selProj, setSelProj] = useState(null);
  const [selLot, setSelLot] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  const filtered = filtre==="tous"?PROJECTS:filtre==="critique"?PROJECTS.filter(p=>p.risque==="Élevé"||p.conformite<70):PROJECTS.filter(p=>p.validAttente>0);
  const proj = selProj ? PROJECTS.find(p=>p.id===selProj) : null;
  const lot = selLot && proj ? proj.lots.find(l=>l.id===selLot) : null;

  if(lot && proj) {
    return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button onClick={()=>setSelLot(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.sec,display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600}}><ChevronLeft size={14}/>Retour au projet</button>
        <span style={{color:C.lG}}>·</span>
        <span style={{fontSize:10,color:C.g}}>{proj.nom}</span>
      </div>
      <h2 style={{fontSize:18,fontWeight:800,color:C.dk,margin:0}}>{lot.nom}</h2>
      <div style={{display:"flex",gap:8}}>
        <Badge v={lot.statut==="Terminé"?"success":lot.statut==="En cours"?"info":lot.statut==="Critique"||lot.statut==="En retard"?"danger":"dark"}>{lot.statut}</Badge>
        <span style={{fontSize:11,fontWeight:700,color:C.sec}}>Avancement : {lot.av}%</span>
      </div>
      <Pr value={lot.av} h={8}/>

      <ST>Opérations</ST>
      <Tbl cols={[
        { label:"Code", render:r=><span style={{fontFamily:"monospace",fontSize:10,fontWeight:600,color:C.sec}}>{r.code}</span> },
        { label:"Libellé", render:r=><span style={{fontWeight:600,fontSize:11}}>{r.lib}</span> },
        { label:"Statut", render:r=><SB s={r.st}/> },
        { label:"Avancement", render:r=><div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}><Pr value={r.av} h={4}/><span style={{fontSize:9,fontWeight:700}}>{r.av}%</span></div> },
        { label:"Actions", render:r=>r.st!=="Terminé"?<div style={{display:"flex",gap:4}}>
          <Bt small icon={Eye} v="ghost">Voir</Bt>
          {r.st==="Non conforme"&&<Bt small icon={AlertTriangle} v="danger">NC</Bt>}
        </div>:<span style={{fontSize:9,color:C.ok}}>✓</span> },
      ]} data={lot.ops}/>

      <div style={{display:"flex",gap:6}}>
        <Bt icon={FileText} v="ghost">Documents du lot</Bt>
        <Bt icon={Camera} v="ghost">Photos</Bt>
        <Bt icon={AlertTriangle} v="ghost">Écarts liés</Bt>
      </div>
    </div>;
  }

  if(proj) {
    const projValidations = VALIDATIONS.filter(v=>v.projet===proj.id);
    const projEcarts = ECARTS.filter(e=>e.projet===proj.id);
    const projRapports = RAPPORTS.filter(r=>r.projet===proj.id);
    const projDocs = DOCS.filter(d=>d.projet===proj.id);

    return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button onClick={()=>setSelProj(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.sec,display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600}}><ChevronLeft size={14}/>Retour au portefeuille</button>
      </div>

      {/* IDENTITÉ PROJET */}
      <Cd>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <span style={{fontFamily:"monospace",fontSize:10,color:C.sec}}>{proj.id}</span>
            <h2 style={{fontSize:20,fontWeight:800,color:C.dk,margin:"2px 0"}}>{proj.nom}</h2>
            <div style={{fontSize:10,color:C.g}}><MapPin size={10} style={{display:"inline"}}/> {proj.loc} · {proj.typo} · Client : {proj.client}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
            <Badge v={proj.risque==="Élevé"?"danger":proj.risque==="Modéré"?"warning":"success"}>{proj.risque}</Badge>
            <TempBadge t={proj.tempCtrl}/>
            <SB s={proj.statut}/>
          </div>
        </div>
      </Cd>

      {/* KPI PROJET */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <Kpi icon={Target} label="Avancement" value={proj.av+"%"} sub={"Plan "+proj.avPlan+"%"} color={proj.av>=proj.avPlan?C.ok:C.warn} accent/>
        <Kpi icon={Briefcase} label="Budget initial" value={fmt(proj.budget)} sub={"Engagé "+fmt(proj.dep)} color={C.sec} accent/>
        <Kpi icon={Shield} label="Conformité" value={proj.conformite+"%"} color={proj.conformite>=85?C.ok:proj.conformite>=70?C.warn:C.err} accent/>
        <Kpi icon={AlertTriangle} label="Écarts ouverts" value={String(proj.ecartsOuv)} color={C.err} accent/>
        <Kpi icon={Flag} label="Réserves ouvertes" value={String(proj.reservesOuv)} color={C.warn} accent/>
        <Kpi icon={Clock} label="Validations att." value={String(proj.validAttente)} color={C.warn} accent/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {/* JALONS */}
        <Cd>
          <ST>Jalons</ST>
          {proj.jalons.map((j,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid "+C.brd}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:j.st==="Fait"?C.ok:j.st==="En cours"?C.warn:C.bg2}}/>
            <span style={{fontSize:10,fontWeight:600,color:C.dk,flex:1}}>{j.l}</span>
            <span style={{fontSize:9,color:C.g}}>{j.d}</span>
            <SB s={j.st}/>
          </div>)}
        </Cd>

        {/* INTERVENANTS */}
        <Cd>
          <ST>Intervenants</ST>
          {proj.intervenants.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid "+C.brd}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:C.sec+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.sec}}>{it.nom[0]}</div>
            <span style={{fontSize:10,fontWeight:600,color:C.dk,flex:1}}>{it.nom}</span>
            <Badge v="dark" s="xs">{it.role}</Badge>
          </div>)}
        </Cd>
      </div>

      {/* PROGRESSION PAR LOT */}
      <Cd>
        <ST>Progression par lot</ST>
        {proj.lots.map(l=><div key={l.id} onClick={()=>setSelLot(l.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid "+C.brd,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.background=C.bgL}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
          <span style={{fontSize:11,fontWeight:600,color:C.dk,flex:1,minWidth:180}}>{l.nom}</span>
          <SB s={l.statut}/>
          <div style={{width:120}}><Pr value={l.av} h={6}/></div>
          <span style={{fontSize:10,fontWeight:700,color:C.sec,minWidth:35}}>{l.av}%</span>
          <span style={{fontSize:9,color:C.g}}>{l.ops.length} ops</span>
          <ChevronRight size={12} color={C.lG}/>
        </div>)}
      </Cd>

      {/* ALERTES + DOCUMENTS + RAPPORTS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Cd accent={C.err}>
          <ST>Alertes actives</ST>
          {projEcarts.filter(e=>e.statut!=="Levée").length===0 ? <div style={{fontSize:10,color:C.ok}}>Aucune alerte active</div> :
          projEcarts.filter(e=>e.statut!=="Levée").slice(0,3).map(e=><div key={e.id} style={{padding:"5px 0",borderBottom:"1px solid "+C.brd,fontSize:10}}>
            <div style={{display:"flex",gap:4,alignItems:"center"}}><GravBadge g={e.gravite}/><span style={{fontWeight:600}}>{e.constat.substring(0,45)}…</span></div>
          </div>)}
        </Cd>
        <Cd>
          <ST>Documents récents</ST>
          {projDocs.slice(0,4).map(d=><div key={d.id} style={{padding:"4px 0",borderBottom:"1px solid "+C.brd,fontSize:10,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontWeight:500}}>{d.nom}</span><SB s={d.statut}/>
          </div>)}
        </Cd>
      </div>

      {/* PANNEAU ACTIONS PROJET */}
      <Cd style={{background:C.sec+"06",border:"1px solid "+C.sec+"18"}}>
        <ST>Actions projet</ST>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <Bt icon={CheckCircle2} onClick={()=>setActionModal("valider")}>Valider</Bt>
          <Bt icon={MessageSquare} v="ghost" onClick={()=>setActionModal("commenter")}>Commenter</Bt>
          <Bt icon={RotateCcw} v="ghost" onClick={()=>setActionModal("correction")}>Demander correction</Bt>
          <Bt icon={Calendar} v="ghost" onClick={()=>setActionModal("visite")}>Planifier visite</Bt>
          <Bt icon={Send} v="ghost" onClick={()=>setActionModal("relancer")}>Relancer intervenant</Bt>
          <Bt icon={FileText} v="ghost" onClick={()=>setActionModal("rapport")}>Générer rapport</Bt>
          <Bt icon={FolderOpen} v="ghost" onClick={()=>setActionModal("docs")}>Ouvrir documents</Bt>
          <Bt icon={Flag} v="ghost" onClick={()=>setActionModal("reserve")}>Créer réserve</Bt>
          <Bt icon={Users} v="ghost" onClick={()=>setActionModal("affecter")}>Affecter responsable</Bt>
        </div>
      </Cd>

      <Modal open={!!actionModal} onClose={()=>setActionModal(null)} title={actionModal==="valider"?"Validation en lot":actionModal==="commenter"?"Ajouter un commentaire":actionModal==="visite"?"Planifier une visite":actionModal==="relancer"?"Relancer un intervenant":actionModal==="reserve"?"Créer une réserve":"Action projet"}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontSize:11,color:C.g}}>Projet : {proj.nom} ({proj.id})</div>
          <textarea placeholder="Détails de l'action..." rows={3} style={{padding:"8px 10px",borderRadius:6,border:"1px solid "+C.brd,fontSize:11,resize:"vertical"}}/>
          <div style={{display:"flex",gap:6}}>
            <Bt icon={CheckCircle2}>Confirmer</Bt>
            <Bt v="ghost" onClick={()=>setActionModal(null)}>Annuler</Bt>
          </div>
        </div>
      </Modal>
    </div>;
  }

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Portefeuille AMOA</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Mes Projets</h2>
      </div>
      <TabBar tabs={[{k:"tous",l:"Tous",count:PROJECTS.length},{k:"critique",l:"Critiques",count:PROJECTS.filter(p=>p.risque==="Élevé"||p.conformite<70).length},{k:"validation",l:"En validation",count:PROJECTS.filter(p=>p.validAttente>0).length}]} active={filtre} onChange={setFiltre}/>
    </div>
    <Tbl cols={[
      { label:"Projet", render:r=><div><span style={{fontFamily:"monospace",fontSize:9,color:C.sec}}>{r.id}</span><div style={{fontWeight:700,fontSize:12}}>{r.nom}</div><div style={{fontSize:9,color:C.g}}>{r.loc}</div></div> },
      { label:"Phase", render:r=><Badge v="dark">{r.phase}</Badge> },
      { label:"Avancement", render:r=><div style={{minWidth:80}}><div style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:2}}><span>{r.av}%</span><span style={{color:C.lG}}>Plan {r.avPlan}%</span></div><Pr value={r.av} plan={r.avPlan}/></div> },
      { label:"Budget", render:r=><div><div style={{fontWeight:700}}>{fmt(r.budget)}</div><div style={{fontSize:9,color:C.g}}>Dép. {fmt(r.dep)}</div></div> },
      { label:"Conform.", render:r=><div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:r.conformite>=85?C.okL:r.conformite>=70?C.warnL:C.errL,color:r.conformite>=85?C.okD:r.conformite>=70?C.warnD:C.errD,fontSize:10,fontWeight:800}}>{r.conformite}</div> },
      { label:"Risque", render:r=><Badge v={r.risque==="Élevé"?"danger":r.risque==="Modéré"?"warning":"success"} s="xs">{r.risque}</Badge> },
      { label:"Contrôle", render:r=><TempBadge t={r.tempCtrl}/> },
    ]} data={filtered.map(p=>({...p,_highlight:p.risque==="Élevé"}))} onRowClick={r=>setSelProj(r.id)}/>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 3. ÉTUDES & LIVRABLES                                                */
/* ══════════════════════════════════════════════════════════════════════ */
function PageEtudes() {
  const [tab, setTab] = useState("tous");
  const [projFilter, setProjFilter] = useState("all");
  const [selLiv, setSelLiv] = useState(null);

  const phases = ["Pré-faisabilité","Diagnostic","APS","APD","Devis","Réception","DOE"];
  const filtered = ETUDES.filter(e=>{
    if(projFilter!=="all" && e.projet!==projFilter) return false;
    if(tab==="revue") return e.statut==="En revue";
    if(tab==="corriger") return e.statut==="À corriger";
    if(tab==="attendu") return e.statut==="Attendu";
    if(tab==="valide") return e.statut==="Validé";
    if(tab==="reception") return ["Réception","DOE"].includes(e.phase);
    return true;
  });

  const livrable = selLiv ? ETUDES.find(e=>e.id===selLiv) : null;

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Centre de contrôle</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Études & Livrables</h2>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <ProjectSelector value={projFilter} onChange={setProjFilter} allOption/>
        <TabBar tabs={[
          {k:"tous",l:"Tous",count:ETUDES.length},
          {k:"revue",l:"En revue",count:ETUDES.filter(e=>e.statut==="En revue").length},
          {k:"corriger",l:"À corriger",count:ETUDES.filter(e=>e.statut==="À corriger").length},
          {k:"attendu",l:"Attendus",count:ETUDES.filter(e=>e.statut==="Attendu").length},
          {k:"reception",l:"Réception/DOE",count:ETUDES.filter(e=>["Réception","DOE"].includes(e.phase)).length},
          {k:"valide",l:"Validés",count:ETUDES.filter(e=>e.statut==="Validé").length},
        ]} active={tab} onChange={setTab}/>
      </div>
    </div>

    {/* Arborescence phases */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {phases.map(ph=>{
        const count = ETUDES.filter(e=>(projFilter==="all"||e.projet===projFilter)&&e.phase===ph).length;
        return <div key={ph} style={{padding:"4px 10px",borderRadius:6,background:count>0?C.priL:C.bg2,border:"1px solid "+(count>0?C.pri+"20":C.brd),fontSize:9,fontWeight:600,color:count>0?C.priD:C.lG}}>{ph} ({count})</div>;
      })}
    </div>

    <Tbl cols={[
      { label:"Réf.", render:r=><span style={{fontFamily:"monospace",fontSize:9,color:C.sec,fontWeight:600}}>{r.id}</span> },
      { label:"Livrable", render:r=><div><div style={{fontWeight:600}}>{r.type}</div><div style={{fontSize:9,color:C.g}}>{r.projet}</div></div> },
      { label:"Phase", render:r=><Badge v="purple" s="xs">{r.phase}</Badge> },
      { label:"Cat.", render:r=><Badge v="dark" s="xs">{r.cat}</Badge> },
      { label:"Ver.", render:r=><span style={{fontFamily:"monospace",fontSize:10}}>{r.version}</span> },
      { label:"Auteur", render:r=><span style={{fontSize:10}}>{r.auteur}</span> },
      { label:"Complét.", render:r=><div style={{display:"flex",alignItems:"center",gap:4,minWidth:60}}><Pr value={r.completude} h={4}/><span style={{fontSize:9,fontWeight:600}}>{r.completude}%</span></div> },
      { label:"Statut", render:r=><SB s={r.statut}/> },
      { label:"Obs. AMOA", render:r=><span style={{fontSize:9,color:C.dkG,maxWidth:140,display:"inline-block"}}>{r.obsAMOA}</span> },
    ]} data={filtered} onRowClick={r=>setSelLiv(r.id)}/>

    <Drawer open={!!livrable} onClose={()=>setSelLiv(null)} title={livrable?"Détail livrable":""} width={520}>
      {livrable && <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <h4 style={{fontSize:14,fontWeight:700,margin:0}}>{livrable.type}</h4>
        <DetailRow label="Référence" value={livrable.id}/>
        <DetailRow label="Projet" value={livrable.projet}/>
        <DetailRow label="Phase" value={livrable.phase}/>
        <DetailRow label="Catégorie" value={livrable.cat}/>
        <DetailRow label="Version" value={livrable.version}/>
        <DetailRow label="Auteur" value={livrable.auteur}/>
        <DetailRow label="Date" value={livrable.date}/>
        <DetailRow label="Statut" value={livrable.statut}/>
        <DetailRow label="Complétude" value={livrable.completude+"%"}/>
        <ST>Observation AMOA</ST>
        <div style={{padding:"8px 10px",background:C.bgL,borderRadius:6,fontSize:11,color:C.dkG}}>{livrable.obsAMOA}</div>
        <ST>Historique versions</ST>
        <HistoryTimeline items={[`${livrable.version} — ${livrable.date} — ${livrable.auteur}`,livrable.version!=="v1"?"v1 — Version initiale":""].filter(Boolean)}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {livrable.statut==="En revue" && <><Bt icon={CheckCircle2}>Valider</Bt><Bt icon={XCircle} v="danger">Rejeter</Bt></>}
          {livrable.statut==="À corriger" && <Bt icon={Send} v="ghost">Relancer correction</Bt>}
          {livrable.statut==="Attendu" && <Bt icon={Plus}>Lancer commande</Bt>}
          <Bt icon={Download} v="ghost">Télécharger</Bt>
          <Bt icon={MessageSquare} v="ghost">Commenter</Bt>
          <Bt icon={Eye} v="ghost">Aperçu</Bt>
        </div>
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 4. VALIDATIONS                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function PageValidations() {
  const [tab, setTab] = useState("attente");
  const [projFilter, setProjFilter] = useState("all");
  const [selVal, setSelVal] = useState(null);

  const list = VALIDATIONS.filter(v=>{
    if(projFilter!=="all" && v.projet!==projFilter) return false;
    if(tab==="attente") return v.statut==="En attente";
    if(tab==="critiques") return v.crit;
    if(tab==="validees") return v.statut==="Validée";
    if(tab==="rejetees") return v.statut==="Rejetée";
    return true;
  });

  const val = selVal ? VALIDATIONS.find(v=>v.id===selVal) : null;

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Centre de décision</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Validations</h2>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <ProjectSelector value={projFilter} onChange={setProjFilter} allOption/>
        <TabBar tabs={[
          {k:"attente",l:"En attente",count:VALIDATIONS.filter(v=>v.statut==="En attente").length},
          {k:"critiques",l:"Critiques",count:VALIDATIONS.filter(v=>v.crit).length},
          {k:"validees",l:"Validées",count:VALIDATIONS.filter(v=>v.statut==="Validée").length},
          {k:"rejetees",l:"Rejetées",count:VALIDATIONS.filter(v=>v.statut==="Rejetée").length},
          {k:"toutes",l:"Toutes",count:VALIDATIONS.length},
        ]} active={tab} onChange={setTab}/>
      </div>
    </div>

    {/* Types de validation visibles */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {["validation étude","validation livrable","validation technique chantier","validation corrective","validation avant réception"].map(t=>{
        const count = list.filter(v=>v.typeVal===t).length;
        return <div key={t} style={{padding:"3px 8px",borderRadius:12,background:count>0?C.sec+"14":C.bg2,fontSize:9,fontWeight:600,color:count>0?C.sec:C.lG}}>{t} ({count})</div>;
      })}
    </div>

    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {list.map(v => <Cd key={v.id} accent={v.crit?C.err:v.risque==="Élevé"?C.warn:C.sec} style={v.crit?{background:C.errL+"15"}:{}} onClick={()=>setSelVal(v.id)}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"monospace", fontSize:9, color:C.sec, fontWeight:600 }}>{v.id}</span>
            <Badge v="dark" s="xs">{v.type}</Badge>
            <Badge v="purple" s="xs">{v.typeVal}</Badge>
            <Badge v="dark" s="xs">{v.projet}</Badge>
            {v.crit && <Badge v="danger" s="xs">⚠ Critique</Badge>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <SB s={v.statut}/>
            {v.pj && <Paperclip size={10} color={C.lG}/>}
            <span style={{ fontSize:9, color:C.lG }}>Éch. {v.delai}</span>
            <ChevronRight size={12} color={C.lG}/>
          </div>
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:C.dk, marginBottom:3 }}>{v.objet}</div>
        <div style={{ fontSize:10, color:C.g, marginBottom:2 }}>{v.auteur} · {v.date} · Lot : {v.lot||"—"}</div>
        <div style={{ fontSize:10, color:C.dkG, lineHeight:1.5, padding:"6px 8px", background:C.bgL, borderRadius:5 }}>{v.synthese}</div>
      </Cd>)}
    </div>

    <Drawer open={!!val} onClose={()=>setSelVal(null)} title={val?"Détail validation":""} width={540}>
      {val && <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Badge v="dark">{val.type}</Badge><Badge v="purple">{val.typeVal}</Badge>{val.crit&&<Badge v="danger">Critique</Badge>}</div>
        <h4 style={{fontSize:14,fontWeight:700,margin:0}}>{val.objet}</h4>
        <DetailRow label="Projet" value={val.projet}/>
        <DetailRow label="Lot" value={val.lot||"—"}/>
        <DetailRow label="Demandeur" value={val.demandeur}/>
        <DetailRow label="Auteur" value={val.auteur}/>
        <DetailRow label="Date" value={val.date}/>
        <DetailRow label="Échéance" value={val.delai} color={C.err}/>
        <DetailRow label="Risque" value={val.risque}/>
        <DetailRow label="Pièce jointe" value={val.pj?"Oui — voir document":"Non"}/>
        <ST>Synthèse</ST>
        <div style={{padding:"8px 10px",background:C.bgL,borderRadius:6,fontSize:11,color:C.dkG,lineHeight:1.6}}>{val.synthese}</div>
        {val.avisAMOA && <><ST>Avis AMOA</ST><div style={{padding:"8px 10px",background:C.sec+"08",borderRadius:6,fontSize:11,color:C.dk,fontWeight:600}}>{val.avisAMOA}</div></>}
        <ST>Historique</ST>
        <HistoryTimeline items={val.hist}/>
        {val.statut==="En attente" && <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          <Bt icon={CheckCircle2}>Valider</Bt>
          <Bt icon={XCircle} v="danger">Rejeter</Bt>
          <Bt icon={RotateCcw} v="ghost">Demander complément</Bt>
          <Bt icon={Flag} v="ghost">Escalader</Bt>
        </div>}
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 5. ÉCARTS & RÉSERVES                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function PageEcarts() {
  const [tab, setTab] = useState("ouverts");
  const [projFilter, setProjFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selEc, setSelEc] = useState(null);

  const ouverts = ECARTS.filter(e=>(e.statut==="Ouvert"||e.statut==="En traitement")&&(projFilter==="all"||e.projet===projFilter));
  const critiques = ECARTS.filter(e=>e.gravite==="Critique"&&e.statut!=="Levée"&&(projFilter==="all"||e.projet===projFilter));
  const leves = ECARTS.filter(e=>e.statut==="Levée"&&(projFilter==="all"||e.projet===projFilter));
  const allFiltered = ECARTS.filter(e=>projFilter==="all"||e.projet===projFilter);

  const list = tab==="ouverts"?ouverts:tab==="critiques"?critiques:tab==="leves"?leves:allFiltered;
  const ecart = selEc ? ECARTS.find(e=>e.id===selEc) : null;

  const parLot = {};
  ouverts.forEach(e => { const l = e.lot.split("—")[0].trim(); parLot[l] = (parLot[l]||0)+1; });

  // Kanban
  const kanbanCols = [{k:"Ouvert",c:C.err},{k:"En traitement",c:C.warn},{k:"Levée",c:C.ok}];

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Gouvernance projet</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Écarts & Réserves</h2>
      </div>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <ProjectSelector value={projFilter} onChange={setProjFilter} allOption/>
        <div style={{display:"flex",gap:2,background:C.bg2,borderRadius:6,padding:2}}>
          {[{k:"table",i:List},{k:"kanban",i:Columns3},{k:"lot",i:Layers},{k:"criticite",i:AlertTriangle}].map(v=>
            <button key={v.k} onClick={()=>setViewMode(v.k)} style={{padding:"4px 8px",borderRadius:4,border:"none",cursor:"pointer",background:viewMode===v.k?C.w:"transparent",color:viewMode===v.k?C.dk:C.lG,display:"flex",alignItems:"center",gap:3,fontSize:9,fontWeight:viewMode===v.k?700:400}}>
              <v.i size={10}/>{v.k}
            </button>
          )}
        </div>
        <TabBar tabs={[
          {k:"ouverts",l:"Ouverts",count:ouverts.length},
          {k:"critiques",l:"Critiques",count:critiques.length},
          {k:"leves",l:"Levées",count:leves.length},
          {k:"tous",l:"Tous",count:allFiltered.length},
        ]} active={tab} onChange={setTab}/>
        <Bt icon={Plus}>Nouveau constat</Bt>
      </div>
    </div>

    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      <Kpi icon={AlertTriangle} label="Écarts ouverts" value={String(ouverts.length)} color={C.err} accent/>
      <Kpi icon={AlertOctagon} label="Critiques" value={String(critiques.length)} color={C.err}/>
      <Kpi icon={CheckCircle2} label="Taux résolution" value={allFiltered.length>0?Math.round(leves.length/allFiltered.length*100)+"%":"—"} color={C.ok}/>
      <Kpi icon={Clock} label="Délai moy. levée" value="4.2j" color={C.warn}/>
    </div>

    {/* VIEW: KANBAN */}
    {viewMode==="kanban" && <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
      {kanbanCols.map(col=><div key={col.k} style={{background:C.bgL,borderRadius:8,padding:10,border:"1px solid "+C.brd}}>
        <div style={{fontSize:11,fontWeight:700,color:col.c,marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:col.c}}/>{col.k} ({allFiltered.filter(e=>e.statut===col.k||(col.k==="Levée"&&e.statut==="Levée")).length})
        </div>
        {allFiltered.filter(e=>e.statut===col.k||(col.k==="Levée"&&e.statut==="Levée")).map(e=>
          <div key={e.id} onClick={()=>setSelEc(e.id)} style={{background:C.w,borderRadius:6,padding:8,marginBottom:6,border:"1px solid "+C.brd,cursor:"pointer",borderLeft:"3px solid "+col.c}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"monospace",fontSize:8,color:C.sec}}>{e.id}</span><GravBadge g={e.gravite}/></div>
            <div style={{fontSize:10,fontWeight:600,color:C.dk,marginTop:3}}>{e.constat.substring(0,40)}…</div>
            <div style={{fontSize:8,color:C.g,marginTop:2}}>{e.lot} · {e.resp}</div>
          </div>
        )}
      </div>)}
    </div>}

    {/* VIEW: TABLE */}
    {viewMode==="table" && <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {list.map(e => <Cd key={e.id} accent={e.gravite==="Critique"?C.err:e.gravite==="Majeur"?C.warn:C.info} style={e.gravite==="Critique"&&e.statut!=="Levée"?{background:C.errL+"12"}:{}} onClick={()=>setSelEc(e.id)}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"monospace", fontSize:9, color:C.sec, fontWeight:600 }}>{e.id}</span>
            <GravBadge g={e.gravite}/>
            <Badge v="dark" s="xs">{e.type}</Badge>
            <Badge v="dark" s="xs">{e.projet}</Badge>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <SB s={e.statut}/>
            {e.relance>0 && <span style={{ fontSize:9, color:C.warn, fontWeight:600 }}>{e.relance} relance(s)</span>}
            <ChevronRight size={12} color={C.lG}/>
          </div>
        </div>
        <div style={{ fontSize:11, fontWeight:600, color:C.dk, marginBottom:4 }}>{e.constat}</div>
        <div style={{ display:"flex", gap:12, fontSize:10, color:C.dkG, flexWrap:"wrap" }}>
          <span><b>Lot :</b> {e.lot}</span><span><b>Resp. :</b> {e.resp}</span><span><b>Éch. :</b> {e.ech}</span>
        </div>
      </Cd>)}
    </div>}

    {/* VIEW: PAR LOT */}
    {viewMode==="lot" && Object.entries(parLot).map(([lot,count])=><Cd key={lot}>
      <ST>{lot} <Badge v={count>=3?"danger":"warning"} s="xs">{count} écarts</Badge></ST>
      {list.filter(e=>e.lot.startsWith(lot)).map(e=><div key={e.id} onClick={()=>setSelEc(e.id)} style={{padding:"5px 0",borderBottom:"1px solid "+C.brd,cursor:"pointer",fontSize:10}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}><GravBadge g={e.gravite}/><span style={{fontWeight:600}}>{e.constat.substring(0,55)}…</span></div>
      </div>)}
    </Cd>)}

    {/* VIEW: PAR CRITICITÉ */}
    {viewMode==="criticite" && ["Critique","Majeur","Mineur"].map(g=>{
      const items = list.filter(e=>e.gravite===g);
      if(!items.length) return null;
      return <Cd key={g} accent={g==="Critique"?C.err:g==="Majeur"?C.warn:C.info}>
        <ST><GravBadge g={g}/> ({items.length})</ST>
        {items.map(e=><div key={e.id} onClick={()=>setSelEc(e.id)} style={{padding:"5px 0",borderBottom:"1px solid "+C.brd,cursor:"pointer",fontSize:10}}>
          <span style={{fontWeight:600}}>{e.constat.substring(0,55)}…</span>
          <span style={{color:C.g,marginLeft:8}}>{e.lot}</span>
        </div>)}
      </Cd>;
    })}

    {/* DRAWER DÉTAIL ÉCART */}
    <Drawer open={!!ecart} onClose={()=>setSelEc(null)} title={ecart?"Détail écart / réserve":""} width={540}>
      {ecart && <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}><GravBadge g={ecart.gravite}/><Badge v="dark">{ecart.type}</Badge><SB s={ecart.statut}/></div>
        <h4 style={{fontSize:14,fontWeight:700,margin:0}}>{ecart.constat}</h4>
        <DetailRow label="Référence" value={ecart.id}/>
        <DetailRow label="Projet" value={ecart.projet}/>
        <DetailRow label="Lot" value={ecart.lot}/>
        <DetailRow label="Tâche" value={ecart.tache||"—"}/>
        <DetailRow label="Localisation" value={ecart.loc||"—"}/>
        <DetailRow label="Impact" value={ecart.impact}/>
        <DetailRow label="Responsable" value={ecart.resp}/>
        <DetailRow label="Source" value={ecart.source}/>
        <DetailRow label="Date ouverture" value={ecart.dateOuv}/>
        <DetailRow label="Échéance" value={ecart.ech} color={C.err}/>
        <DetailRow label="Preuve" value={ecart.preuve}/>
        <DetailRow label="Relances" value={String(ecart.relance)}/>
        {ecart.dateLevee && <DetailRow label="Date levée" value={ecart.dateLevee} color={C.ok}/>}
        {ecart.plan && <><ST>Plan d'action</ST><div style={{padding:"8px 10px",background:C.bgL,borderRadius:6,fontSize:11,color:C.dkG}}>{ecart.plan}</div></>}
        {ecart.commentaires.length>0 && <><ST>Commentaires & historique</ST><HistoryTimeline items={ecart.commentaires}/></>}
        {ecart.statut!=="Levée" && <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          <Bt icon={CheckCircle2}>Lever / Clôturer</Bt>
          <Bt icon={Send} v="ghost">Relancer</Bt>
          <Bt icon={Flag} v="ghost">Requalifier</Bt>
          <Bt icon={Upload} v="ghost">Joindre document</Bt>
          <Bt icon={Eye} v="ghost">Demander preuve</Bt>
          <Bt icon={Download} v="ghost">Exporter</Bt>
        </div>}
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 6. RAPPORTS                                                          */
/* ══════════════════════════════════════════════════════════════════════ */
function PageRapports() {
  const [tab, setTab] = useState("avalider");
  const [projFilter, setProjFilter] = useState("all");
  const [selRap, setSelRap] = useState(null);

  const filtered = RAPPORTS.filter(r=>{
    if(projFilter!=="all" && r.projet!==projFilter) return false;
    if(tab==="avalider") return r.statut==="À valider";
    if(tab==="acorriger") return r.statut==="À corriger";
    if(tab==="valides") return r.statut==="Validé";
    return true;
  });

  const typeCounts = {};
  RAPPORTS.forEach(r=>{typeCounts[r.type]=(typeCounts[r.type]||0)+1});
  const rapport = selRap ? RAPPORTS.find(r=>r.id===selRap) : null;

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Contrôle & publication</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Rapports</h2>
      </div>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <ProjectSelector value={projFilter} onChange={setProjFilter} allOption/>
        <TabBar tabs={[
          {k:"avalider",l:"À valider",count:RAPPORTS.filter(r=>r.statut==="À valider").length},
          {k:"acorriger",l:"À corriger",count:RAPPORTS.filter(r=>r.statut==="À corriger").length},
          {k:"valides",l:"Validés",count:RAPPORTS.filter(r=>r.statut==="Validé").length},
          {k:"tous",l:"Tous",count:RAPPORTS.length},
        ]} active={tab} onChange={setTab}/>
        <Bt icon={Plus}>Rapport visite</Bt>
      </div>
    </div>

    {/* Types */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {Object.entries(typeCounts).map(([t,c])=><Badge key={t} v="dark" s="xs">{t} ({c})</Badge>)}
    </div>

    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {filtered.map(r => <Cd key={r.id} accent={r.sensible?C.err:r.statut==="À valider"?C.warn:r.statut==="Validé"?C.ok:C.info} onClick={()=>setSelRap(r.id)}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"monospace", fontSize:9, color:C.sec, fontWeight:600 }}>{r.id}</span>
            <Badge v={r.type.includes("Visite")||r.type==="Contrôle"?"active":"default"} s="xs">{r.type}</Badge>
            <Badge v="dark" s="xs">{r.projet}</Badge>
            {r.sensible && <Badge v="danger" s="xs">Sensible</Badge>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <SB s={r.statut}/>
            {r.transmissible && <Badge v="success" s="xs">Publiable</Badge>}
            <ChevronRight size={12} color={C.lG}/>
          </div>
        </div>
        <div style={{ display:"flex", gap:12, fontSize:10, marginBottom:4, flexWrap:"wrap" }}>
          <span style={{ color:C.g }}>📅 {r.date}</span>
          <span style={{ color:C.g }}>👤 {r.auteur} ({r.role})</span>
          <span style={{ color:C.g }}>☁️ {r.meteo}</span>
          <span style={{ color:C.g }}>🏗️ {r.lot}</span>
          {r.ecarts>0 && <span style={{ color:C.err, fontWeight:600 }}>⚠ {r.ecarts} écart(s)</span>}
        </div>
        <div style={{ fontSize:11, color:C.dk, padding:"6px 8px", background:C.bgL, borderRadius:5 }}>{r.resume}</div>
      </Cd>)}
    </div>

    <Drawer open={!!rapport} onClose={()=>setSelRap(null)} title={rapport?"Détail rapport":""} width={520}>
      {rapport && <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Badge v="dark">{rapport.type}</Badge><SB s={rapport.statut}/>{rapport.sensible&&<Badge v="danger">Sensible</Badge>}{rapport.transmissible&&<Badge v="success">Publiable</Badge>}</div>
        <h4 style={{fontSize:14,fontWeight:700,margin:0}}>{rapport.id} — {rapport.type}</h4>
        <DetailRow label="Projet" value={rapport.projet}/>
        <DetailRow label="Lot" value={rapport.lot}/>
        <DetailRow label="Auteur" value={`${rapport.auteur} (${rapport.role})`}/>
        <DetailRow label="Date" value={rapport.date}/>
        <DetailRow label="Météo" value={rapport.meteo}/>
        <DetailRow label="Écarts constatés" value={String(rapport.ecarts)}/>
        <ST>Résumé</ST>
        <div style={{padding:"8px 10px",background:C.bgL,borderRadius:6,fontSize:11,color:C.dkG,lineHeight:1.6}}>{rapport.resume}</div>
        <ST>Historique</ST>
        <HistoryTimeline items={[`${rapport.date} — Créé par ${rapport.auteur}`,rapport.statut==="Validé"?"Validé par AMOA":"En attente de validation"]}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          {rapport.statut==="À valider"&&<><Bt icon={CheckCircle2}>Valider</Bt><Bt icon={RotateCcw} v="ghost">Renvoyer</Bt><Bt icon={Send} v="ghost">Valider & publier</Bt></>}
          {rapport.statut==="À corriger"&&<Bt icon={Send} v="ghost">Relancer correction</Bt>}
          <Bt icon={Download} v="ghost">Télécharger</Bt>
          <Bt icon={MessageSquare} v="ghost">Commenter</Bt>
          <Bt icon={Flag} v="ghost">Créer réserve</Bt>
          <Bt icon={AlertTriangle} v="ghost">Action corrective</Bt>
          <Bt icon={ExternalLink} v="ghost">Partager</Bt>
        </div>
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 7. DOCUMENTS (ex-GED)                                                */
/* ══════════════════════════════════════════════════════════════════════ */
function PageGED() {
  const [tab, setTab] = useState("tous");
  const [projFilter, setProjFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [selDoc, setSelDoc] = useState(null);

  const cats = [...new Set(DOCS.map(d=>d.cat))];

  const filtered = DOCS.filter(d=>{
    if(projFilter!=="all" && d.projet!==projFilter) return false;
    if(catFilter!=="all" && d.cat!==catFilter) return false;
    if(searchQ && !d.nom.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if(tab==="avalider") return d.statut==="À valider"||d.statut==="En revue";
    if(tab==="manquants") return d.statut==="Manquant";
    return true;
  });

  const doc = selDoc ? DOCS.find(d=>d.id===selDoc) : null;

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Base documentaire</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Documents</h2>
      </div>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <div style={{display:"flex",alignItems:"center",gap:4,background:C.bgL,borderRadius:6,padding:"4px 10px",border:"1px solid "+C.brd,width:180}}>
          <Search size={12} color={C.lG}/><input placeholder="Rechercher..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{border:"none",background:"transparent",outline:"none",fontSize:10,width:"100%"}}/>
        </div>
        <ProjectSelector value={projFilter} onChange={setProjFilter} allOption/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{padding:"5px 8px",borderRadius:6,border:"1px solid "+C.brd,fontSize:10,background:C.w}}>
          <option value="all">Toutes catégories</option>
          {cats.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <TabBar tabs={[
          {k:"tous",l:"Tous",count:DOCS.length},
          {k:"avalider",l:"À valider",count:DOCS.filter(d=>d.statut==="À valider"||d.statut==="En revue").length},
          {k:"manquants",l:"Manquants",count:DOCS.filter(d=>d.statut==="Manquant").length},
        ]} active={tab} onChange={setTab}/>
        <Bt icon={Upload}>Téléverser</Bt>
      </div>
    </div>

    {/* Dossiers */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {["Plans","Devis","Contrats","Rapports","Études","PV","DOE","Photos","Administratif"].map(cat=>{
        const count = DOCS.filter(d=>(projFilter==="all"||d.projet===projFilter)&&d.cat===cat).length;
        return <div key={cat} onClick={()=>setCatFilter(cat===catFilter?"all":cat)} style={{padding:"5px 10px",borderRadius:6,background:catFilter===cat?C.sec+"14":count>0?C.w:C.bg2,border:"1px solid "+(catFilter===cat?C.sec+"30":C.brd),cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
          <FolderOpen size={10} color={catFilter===cat?C.sec:C.lG}/>
          <span style={{fontSize:9,fontWeight:600,color:catFilter===cat?C.sec:C.dkG}}>{cat}</span>
          <span style={{fontSize:8,color:C.lG}}>({count})</span>
        </div>;
      })}
    </div>

    <Tbl cols={[
      { label:"Document", render:r=><div style={{display:"flex",alignItems:"center",gap:6}}><FileText size={12} color={C.sec}/><div><div style={{fontWeight:600,fontSize:11}}>{r.nom}</div><div style={{fontSize:8,color:C.lG}}>{r.taille||"—"}</div></div></div> },
      { label:"Cat.", render:r=><Badge v="dark" s="xs">{r.cat}</Badge> },
      { label:"Projet", key:"projet" },
      { label:"Ver.", key:"version" },
      { label:"Date", key:"date" },
      { label:"Statut", render:r=><SB s={r.statut}/> },
      { label:"Client", render:r=>r.client?<Badge v="success" s="xs">Visible</Badge>:<Badge v="dark" s="xs">Interne</Badge> },
      { label:"Lié à", render:r=>r.lien!=="—"?<span style={{fontFamily:"monospace",fontSize:9,color:C.info}}>{r.lien}</span>:<span style={{color:C.lG}}>—</span> },
    ]} data={filtered.map(d=>({...d,_highlight:d.statut==="Manquant"}))} onRowClick={r=>setSelDoc(r.id)}/>

    <Drawer open={!!doc} onClose={()=>setSelDoc(null)} title={doc?"Détail document":""} width={480}>
      {doc && <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{width:"100%",height:120,background:C.bg2,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <FileText size={32} color={C.lG}/>
          <span style={{fontSize:11,color:C.lG,marginLeft:8}}>Aperçu document</span>
        </div>
        <h4 style={{fontSize:14,fontWeight:700,margin:0}}>{doc.nom}</h4>
        <DetailRow label="Catégorie" value={doc.cat}/>
        <DetailRow label="Projet" value={doc.projet}/>
        <DetailRow label="Version" value={doc.version}/>
        <DetailRow label="Auteur" value={doc.auteur}/>
        <DetailRow label="Date" value={doc.date}/>
        <DetailRow label="Taille" value={doc.taille||"—"}/>
        <DetailRow label="Statut" value={doc.statut}/>
        <DetailRow label="Visibilité" value={doc.client?"Client visible":"Interne uniquement"}/>
        <DetailRow label="Lié à" value={doc.lien}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          <Bt icon={Download} v="ghost">Télécharger</Bt>
          <Bt icon={Eye} v="ghost">Aperçu complet</Bt>
          <Bt icon={MessageSquare} v="ghost">Commenter</Bt>
          <Bt icon={Tag} v="ghost">Taguer</Bt>
          <Bt icon={Archive} v="ghost">Archiver</Bt>
        </div>
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 8. VIDÉOSURVEILLANCE                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function PageVideo() {
  const [projFilter, setProjFilter] = useState("all");
  const [selCam, setSelCam] = useState(0);
  const [viewMode, setViewMode] = useState("mosaic");
  const [selEvt, setSelEvt] = useState(null);

  const filteredCams = CAMS.filter(c=>projFilter==="all"||c.projet===projFilter);
  const cam = filteredCams[selCam] || filteredCams[0];

  const allEvts = filteredCams.flatMap(c=>c.evts.map(e=>({...e,cam:c.nom,camId:c.id,projet:c.projet}))).sort((a,b)=>b.time.localeCompare(a.time));

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Contrôle visuel</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Vidéosurveillance</h2>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <ProjectSelector value={projFilter} onChange={v=>{setProjFilter(v);setSelCam(0)}} allOption/>
        <div style={{display:"flex",gap:2,background:C.bg2,borderRadius:6,padding:2}}>
          <button onClick={()=>setViewMode("mosaic")} style={{padding:"4px 8px",borderRadius:4,border:"none",cursor:"pointer",background:viewMode==="mosaic"?C.w:"transparent",fontSize:9,fontWeight:viewMode==="mosaic"?700:400}}>Mosaïque</button>
          <button onClick={()=>setViewMode("single")} style={{padding:"4px 8px",borderRadius:4,border:"none",cursor:"pointer",background:viewMode==="single"?C.w:"transparent",fontSize:9,fontWeight:viewMode==="single"?700:400}}>Caméra</button>
          <button onClick={()=>setViewMode("events")} style={{padding:"4px 8px",borderRadius:4,border:"none",cursor:"pointer",background:viewMode==="events"?C.w:"transparent",fontSize:9,fontWeight:viewMode==="events"?700:400}}>Événements</button>
        </div>
      </div>
    </div>

    {viewMode==="mosaic" && <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
      {filteredCams.map((c,i)=><Cd key={c.id} onClick={()=>{setSelCam(i);setViewMode("single")}} style={{cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <div><span style={{fontWeight:700,fontSize:11}}>{c.nom}</span> <Badge v="dark" s="xs">{c.projet}</Badge></div>
          <SB s={c.s}/>
        </div>
        <div style={{width:"100%",aspectRatio:"16/9",borderRadius:6,background:c.s==="En ligne"?"linear-gradient(135deg,#1a1a2e,#0f3460)":"#1a1a2e",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",color:"#fff"}}>
          {c.s==="En ligne"?<><div style={{position:"absolute",top:6,left:8,display:"flex",alignItems:"center",gap:3}}><div style={{width:5,height:5,borderRadius:"50%",background:C.err,animation:"blink 1.5s infinite"}}/><span style={{fontSize:8,fontWeight:700}}>LIVE</span></div><Camera size={24} strokeWidth={1} color="rgba(255,255,255,0.1)"/></>:<div style={{textAlign:"center"}}><X size={20} color={C.err}/><div style={{fontSize:8,color:C.lG}}>Hors ligne</div></div>}
        </div>
        <div style={{marginTop:4,fontSize:9,color:C.g}}>{c.evts[0]?.time} — {c.evts[0]?.type}</div>
      </Cd>)}
    </div>}

    {viewMode==="single" && cam && <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:12}}>
      <div>
        <Cd>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <div><span style={{fontWeight:700,fontSize:12}}>{cam.nom}</span> <Badge v="dark" s="xs">{cam.projet}</Badge> <Badge v="dark" s="xs">{cam.zone}</Badge></div>
            <SB s={cam.s}/>
          </div>
          <div style={{width:"100%",aspectRatio:"16/9",borderRadius:8,background:cam.s==="En ligne"?"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)":"#1a1a2e",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",color:"#fff"}}>
            {cam.s==="En ligne"?<><div style={{position:"absolute",top:8,left:10,display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:C.err,animation:"blink 1.5s infinite"}}/><span style={{fontSize:9,fontWeight:700}}>LIVE</span></div><Camera size={40} strokeWidth={1} color="rgba(255,255,255,0.12)"/><div style={{position:"absolute",bottom:8,right:10,fontSize:9,color:"rgba(255,255,255,0.4)"}}>16/04/2026 09:47:32</div></>:<div style={{textAlign:"center"}}><X size={32} color={C.err}/><div style={{fontSize:10,color:C.lG,marginTop:6}}>Flux indisponible</div></div>}
          </div>
          <div style={{marginTop:8,display:"flex",gap:6}}>
            <Bt icon={Camera} v="ghost" small>Capturer</Bt>
            <Bt icon={Flag} v="ghost" small>Rattacher écart</Bt>
            <Bt icon={FileText} v="ghost" small>Créer observation</Bt>
          </div>
        </Cd>
        <Cd style={{marginTop:10}}>
          <ST>Événements — {cam.nom}</ST>
          {cam.evts.map((e,i)=><div key={i} onClick={()=>setSelEvt(e)} style={{padding:"6px 0",borderBottom:"1px solid "+C.brd,cursor:"pointer",fontSize:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600}}>{e.type}</span><span style={{color:C.lG}}>{e.time}</span></div>
            <div style={{color:C.g,marginTop:2}}>{e.desc}</div>
          </div>)}
        </Cd>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <span style={{fontSize:11,fontWeight:700}}>Caméras ({filteredCams.length})</span>
        {filteredCams.map((c,i)=><div key={i} onClick={()=>setSelCam(i)} style={{padding:"8px 10px",borderRadius:7,border:"1px solid "+(i===selCam?C.sec:C.brd),background:i===selCam?C.secL+"40":C.w,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:10,fontWeight:600}}>{c.nom}</span>
            <div style={{width:7,height:7,borderRadius:"50%",background:c.s==="En ligne"?C.ok:C.err}}/>
          </div>
          <div style={{fontSize:8,color:C.lG,marginTop:2}}>{c.projet} · {c.zone}</div>
        </div>)}
      </div>
    </div>}

    {viewMode==="events" && <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {allEvts.map((e,i)=><div key={i} onClick={()=>setSelEvt(e)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.w,borderRadius:6,border:"1px solid "+C.brd,cursor:"pointer"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:e.type.includes("Anomalie")||e.type.includes("sécurité")?C.err:e.type.includes("Baisse")?C.warn:C.ok}}/>
        <span style={{fontSize:10,fontWeight:600,color:C.dk,flex:1}}>{e.type}</span>
        <span style={{fontSize:9,color:C.g}}>{e.cam}</span>
        <Badge v="dark" s="xs">{e.projet}</Badge>
        <span style={{fontSize:9,color:C.lG}}>{e.time}</span>
      </div>)}
    </div>}

    <Modal open={!!selEvt} onClose={()=>setSelEvt(null)} title="Détail événement">
      {selEvt && <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <DetailRow label="Type" value={selEvt.type}/>
        <DetailRow label="Caméra" value={selEvt.cam||"—"}/>
        <DetailRow label="Date/Heure" value={selEvt.time}/>
        <DetailRow label="Description" value={selEvt.desc}/>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <Bt icon={Flag} v="ghost">Créer écart</Bt>
          <Bt icon={FileText} v="ghost">Créer observation</Bt>
          <Bt icon={Download} v="ghost">Capture vidéo</Bt>
        </div>
      </div>}
    </Modal>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 9. MESSAGERIE                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
function PageMsg() {
  const [sel, setSel] = useState(0);
  const [msgTab, setMsgTab] = useState("conversations");
  const conv = MESSAGES[sel];
  const roleColors = { SPOC:C.pri, MOE:C.purp, MOEX:C.warn, AMOA:C.sec, Client:C.info };
  const feedTypeColors = { rapport:C.info, validation:C.warn, reserve:C.err, document:C.purp, camera:C.dk, ia:C.sec, message:C.pri, relance:C.warn };

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Coordination & observation</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Messagerie</h2>
      </div>
      <TabBar tabs={[{k:"conversations",l:"Conversations"},{k:"fil",l:"Fil d'actualité"}]} active={msgTab} onChange={setMsgTab}/>
    </div>

    {msgTab==="fil" && <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {FEED_ITEMS.map((f,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",background:C.w,borderRadius:8,border:"1px solid "+C.brd}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:feedTypeColors[f.type]||C.g,marginTop:4,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:C.dk,fontWeight:500}}>{f.txt}</div>
          <div style={{display:"flex",gap:6,marginTop:3}}>
            <Badge v="dark" s="xs">{f.projet}</Badge>
            <span style={{fontSize:8,color:C.lG}}>{f.time}</span>
          </div>
        </div>
        <Badge v="dark" s="xs">{f.type}</Badge>
      </div>)}
    </div>}

    {msgTab==="conversations" && <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:0, border:"1px solid "+C.brd, borderRadius:10, overflow:"hidden", minHeight:450 }}>
      <div style={{ borderRight:"1px solid "+C.brd, overflowY:"auto", background:C.w }}>
        {MESSAGES.map((m,i) => <div key={i} onClick={()=>setSel(i)} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"10px 12px", borderBottom:"1px solid "+C.brd, cursor:"pointer", background:i===sel?C.sec+"08":"transparent" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:(roleColors[m.role]||C.g)+"14", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:roleColors[m.role]||C.g, flexShrink:0 }}>{m.from[0]}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, fontWeight:600 }}>{m.from}</span>
              <Badge v="dark" s="xs">{m.role}</Badge>
            </div>
            <div style={{ fontSize:9, fontWeight:600, color:C.dkG, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.sujet}</div>
            <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2, flexWrap:"wrap" }}>
              <Badge v="dark" s="xs">{m.projet}</Badge>
              {m.prio==="Haute" && <Badge v="danger" s="xs">Haute</Badge>}
              {m.attente && <Badge v="warning" s="xs">Att.</Badge>}
              <span style={{fontSize:7,color:C.lG}}>{m.canal}</span>
            </div>
          </div>
        </div>)}
      </div>
      <div style={{ display:"flex", flexDirection:"column", background:C.bgL }}>
        <div style={{ padding:"10px 14px", borderBottom:"1px solid "+C.brd, background:C.w }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <div>
              <span style={{ fontWeight:700, fontSize:12 }}>{conv.sujet}</span>
              <div style={{ fontSize:9, color:C.g, marginTop:1 }}>
                {conv.from} · {conv.role} · {conv.projet}
                {conv.lien!=="—" && <> · Lié : <span style={{fontFamily:"monospace",color:C.info}}>{conv.lien}</span></>}
                <span style={{marginLeft:8,color:C.lG}}>{conv.canal}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:4}}>
              {conv.attente && <Badge v="warning">Réponse attendue</Badge>}
              {conv.lien!=="—" && <Bt small v="ghost" icon={ExternalLink}>Ouvrir {conv.lien}</Bt>}
            </div>
          </div>
        </div>
        <div style={{ flex:1, padding:12, display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:6, overflowY:"auto" }}>
          {conv.msgs.map((m,i) => {
            const isMine = m.role==="AMOA";
            return <div key={i} style={{ alignSelf:isMine?"flex-end":"flex-start", maxWidth:"75%" }}>
              <div style={{ fontSize:8, color:C.lG, marginBottom:2, textAlign:isMine?"right":"left", display:"flex", alignItems:"center", gap:4, justifyContent:isMine?"flex-end":"flex-start" }}>
                {m.auteur} · {m.time}
                {m.lu && <CheckCircle2 size={8} color={C.ok}/>}
              </div>
              <div style={{ background:isMine?C.sec:C.w, padding:"8px 11px", borderRadius:isMine?"10px 3px 10px 10px":"3px 10px 10px 10px", fontSize:11, color:isMine?"#fff":C.dk, border:isMine?"none":"1px solid "+C.brd, lineHeight:1.5 }}>{m.txt}</div>
            </div>;
          })}
        </div>
        <div style={{ padding:"8px 12px", borderTop:"1px solid "+C.brd, background:C.w, display:"flex", gap:6, alignItems:"center" }}>
          <Bt small v="ghost" icon={Paperclip}/>
          <input placeholder="Message..." style={{ flex:1, padding:"6px 10px", borderRadius:6, border:"1px solid "+C.brd, fontSize:10, outline:"none" }}/>
          <Bt icon={Send} small>Envoyer</Bt>
        </div>
        <div style={{padding:"4px 12px",borderTop:"1px solid "+C.brd,background:C.w,display:"flex",gap:4}}>
          <Bt small v="ghost" icon={Flag}>Créer action</Bt>
          <Bt small v="ghost" icon={Send}>Relancer</Bt>
          <Bt small v="ghost" icon={Star}>Épingler</Bt>
        </div>
      </div>
    </div>}
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 10. KPI & ANALYTICS                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
function PageKPI() {
  const [level, setLevel] = useState("portefeuille");
  const [projFilter, setProjFilter] = useState(PROJECTS[0].id);
  const [drillKpi, setDrillKpi] = useState(null);

  const proj = PROJECTS.find(p=>p.id===projFilter);

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Performance AMOA</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>KPI & Analytics</h2>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <TabBar tabs={[{k:"portefeuille",l:"Portefeuille"},{k:"projet",l:"Par projet"}]} active={level} onChange={setLevel}/>
        {level==="projet" && <ProjectSelector value={projFilter} onChange={setProjFilter}/>}
      </div>
    </div>

    {level==="portefeuille" && <>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <Kpi icon={CheckCircle2} label="Validations dans les délais" value="78%" color={C.ok} trend={5} accent onClick={()=>setDrillKpi("valid-delai")}/>
        <Kpi icon={AlertTriangle} label="Écarts ouverts / fermés" value="6 / 2" color={C.err} accent onClick={()=>setDrillKpi("ecarts-ratio")}/>
        <Kpi icon={Clock} label="Délai moyen levée" value="4.2j" color={C.warn} trend={-8} accent onClick={()=>setDrillKpi("delai-levee")}/>
        <Kpi icon={Shield} label="Conformité moyenne" value="81%" color={C.sec} accent onClick={()=>setDrillKpi("conformite")}/>
        <Kpi icon={FileCheck} label="Rapports traités / mois" value="24" color={C.info} trend={12} accent onClick={()=>setDrillKpi("rapports")}/>
        <Kpi icon={BarChart3} label="Dérive budget" value="+2.1%" color={C.warn} accent onClick={()=>setDrillKpi("budget")}/>
        <Kpi icon={Calendar} label="Dérive planning" value="+5j" color={C.warn} accent onClick={()=>setDrillKpi("planning")}/>
        <Kpi icon={Eye} label="Fréquence visites" value="2.5/sem" color={C.sec} accent onClick={()=>setDrillKpi("visites")}/>
        <Kpi icon={Activity} label="Taux levée réserves" value="25%" color={C.err} accent onClick={()=>setDrillKpi("taux-levee")}/>
        <Kpi icon={FileText} label="Conformité doc." value="83%" color={C.sec} accent onClick={()=>setDrillKpi("conf-doc")}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Cd>
          <ST>Conformité par projet</ST>
          {PROJECTS.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid "+C.brd}}>
            <span style={{fontSize:10,fontWeight:600,minWidth:100}}>{p.nom}</span>
            <div style={{flex:1}}><Pr value={p.conformite} h={6}/></div>
            <span style={{fontSize:10,fontWeight:700,color:p.conformite>=85?C.ok:p.conformite>=70?C.warn:C.err,minWidth:30,textAlign:"right"}}>{p.conformite}%</span>
          </div>)}
        </Cd>
        <Cd>
          <ST>Partenaires — Fiabilité</ST>
          {[{nom:"BTP Cameroun",fiab:72,ecarts:3},{nom:"Arc. Njoya",fiab:91,ecarts:0},{nom:"Bati-Plus",fiab:42,ecarts:6},{nom:"BET Structure",fiab:78,ecarts:1}].map((p,i)=>
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid "+C.brd}}>
              <span style={{fontSize:10,fontWeight:600,flex:1}}>{p.nom}</span>
              <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:p.fiab>=80?C.okL:p.fiab>=60?C.warnL:C.errL,color:p.fiab>=80?C.okD:p.fiab>=60?C.warnD:C.errD,fontSize:10,fontWeight:800}}>{p.fiab}</div>
              <span style={{fontSize:9,color:C.g}}>{p.ecarts} éc.</span>
            </div>
          )}
        </Cd>
      </div>

      <Cd>
        <ST>Multi-projets : comparaison</ST>
        <Tbl compact cols={[
          { label:"Projet", render:r=><span style={{fontWeight:600}}>{r.nom}</span> },
          { label:"Conform.", render:r=><span style={{fontWeight:700,color:r.conformite>=85?C.ok:r.conformite>=70?C.warn:C.err}}>{r.conformite}%</span> },
          { label:"Av.", render:r=><span>{r.av}%</span> },
          { label:"Écarts", render:r=><span style={{fontWeight:700}}>{r.ecartsOuv}</span> },
          { label:"Réserves", render:r=><span style={{fontWeight:700}}>{r.reservesOuv}</span> },
          { label:"Risque", render:r=><Badge v={r.risque==="Élevé"?"danger":r.risque==="Modéré"?"warning":"success"} s="xs">{r.risque}</Badge> },
          { label:"Maîtrise", render:r=><TempBadge t={r.tempCtrl}/> },
        ]} data={PROJECTS}/>
      </Cd>
    </>}

    {level==="projet" && proj && <>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <Kpi icon={Target} label="Avancement" value={proj.av+"%"} sub={"Plan "+proj.avPlan+"%"} color={C.sec} accent onClick={()=>setDrillKpi("av-projet")}/>
        <Kpi icon={Shield} label="Conformité" value={proj.conformite+"%"} color={proj.conformite>=85?C.ok:C.err} accent onClick={()=>setDrillKpi("conf-projet")}/>
        <Kpi icon={Briefcase} label="Budget engagé" value={fmt(proj.dep)+"/"+fmt(proj.budget)} color={C.warn} accent/>
        <Kpi icon={AlertTriangle} label="Écarts" value={String(proj.ecartsOuv)} color={C.err} accent/>
        <Kpi icon={Flag} label="Réserves" value={String(proj.reservesOuv)} color={C.warn} accent/>
      </div>
      <Cd>
        <ST>Progression par lot</ST>
        {proj.lots.map(l=><div key={l.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid "+C.brd}}>
          <span style={{fontSize:10,fontWeight:600,flex:1}}>{l.nom}</span>
          <SB s={l.statut}/>
          <div style={{width:100}}><Pr value={l.av} h={5}/></div>
          <span style={{fontSize:10,fontWeight:700}}>{l.av}%</span>
        </div>)}
      </Cd>
    </>}

    <Drawer open={!!drillKpi} onClose={()=>setDrillKpi(null)} title={drillKpi?"Détail KPI":""} width={500}>
      {drillKpi && <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <h4 style={{fontSize:14,fontWeight:700,margin:0}}>Drill-down : {drillKpi}</h4>
        <div style={{fontSize:11,color:C.g,marginBottom:4}}>Détail par projet, lot, intervenant et période</div>
        {PROJECTS.map(p=><div key={p.id} style={{padding:"8px 0",borderBottom:"1px solid "+C.brd}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:11}}>{p.nom}</span><span style={{fontWeight:700,fontSize:11,color:C.sec}}>{p.conformite}%</span></div>
          <Pr value={p.conformite} h={4}/>
          <div style={{fontSize:9,color:C.g,marginTop:2}}>Écarts : {p.ecartsOuv} · Réserves : {p.reservesOuv} · Valid. att. : {p.validAttente}</div>
        </div>)}
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 11. IA KOMA                                                          */
/* ══════════════════════════════════════════════════════════════════════ */
function PageIA() {
  const [selCase, setSelCase] = useState(null);

  const useCases = [
    { id:1, type:"photo", titre:"Analyse photo chantier — Ferraillage PRJ-004", entree:"Photo ferraillage poteaux P3-P5 (CAM-006 + visite 15/04)", resultat:"3 anomalies détectées", confiance:92, anomalies:["Espacement HA12 non conforme","Enrobage insuffisant poteau P5","Absence cadre de liaison P3-P5"], recommandation:"Reprise ferraillage avant coulage. Contrôle AMOA obligatoire après correction.", justification:"Comparaison automatique avec plans PRO v2 et DTU 21. Écarts mesurés >20%.", actions:["Créer réserve","Demander correction","Ajouter au rapport","Relancer Bati-Plus"] },
    { id:2, type:"plan", titre:"Analyse plan — Conformité RDC PRJ-001", entree:"Plans RDC v2 (LIV-002) vs référentiel WeCare", resultat:"2 points d'attention", confiance:88, anomalies:["Cotation passage cuisine non conforme norme PMR (78cm vs 90cm min)","Nommage pièce 'Bureau' vs 'Chambre 3' — incohérence avec cahier des charges"], recommandation:"Demander correction au MOE avant validation APD.", justification:"Vérification automatique vs norme WeCare v3.1 et cahier des charges client.", actions:["Rejeter livrable","Demander correction","Notifier MOE"] },
    { id:3, type:"livrable", titre:"Analyse livrables — Cohérence PRJ-004", entree:"Ensemble des livrables PRJ-004 (diagnostic, devis, rapports)", resultat:"4 incohérences détectées", confiance:85, anomalies:["Devis v2 mentionne 'ferraillage conforme' alors que NC documentée","Retard +8j non reflété dans le devis actualisé","Rapport RJ-14 mentionne 'pluie' mais météo indique 'nuageux'","Absence de note de calcul pour reprise structurelle"], recommandation:"Consolidation documentaire nécessaire avant transmission client.", justification:"Croisement automatique rapports/devis/météo/NC.", actions:["Signaler incohérences","Bloquer transmission","Relancer intervenant"] },
    { id:4, type:"relance", titre:"Génération relances automatiques", entree:"Analyse des échéances et retards portefeuille", resultat:"3 relances générées", confiance:95, anomalies:["Bati-Plus : 2 NC critiques non corrigées (+2j)","BET Structure : note sismique manquante (+3j)","BTP Cameroun : DA-005 en attente validation (+1j)"], recommandation:"Envoyer les 3 relances avec escalade pour Bati-Plus.", justification:"Analyse automatique des échéances vs statuts actuels.", actions:["Envoyer relances","Escalader Bati-Plus","Archiver"] },
  ];

  const uc = selCase ? useCases.find(u=>u.id===selCase) : null;

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div>
      <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Assistant de contrôle</div>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>IA KOMA — AMOA</h2>
    </div>

    <Cd style={{ background:"linear-gradient(135deg, "+C.sec+"08, "+C.pri+"06)", border:"1px solid "+C.sec+"20" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <Brain size={16} color={C.sec}/>
        <span style={{ fontSize:13, fontWeight:700, color:C.dk }}>Synthèse IA du jour — 16 avril 2026</span>
      </div>
      <div style={{ fontSize:11, color:C.dkG, lineHeight:1.7 }}>
        <b>4 projets · 6 validations en attente · 6 écarts ouverts dont 2 critiques.</b><br/>
        Priorité absolue : PRJ-004 concentre 80% des risques. Conformité à 58%.
        PRJ-001 stable mais note de calcul incomplète. PRJ-002 et PRJ-006 sous contrôle.
      </div>
    </Cd>

    <ST>Cas d'usage IA — Analyses du jour</ST>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {useCases.map(uc=><Cd key={uc.id} onClick={()=>setSelCase(uc.id)} style={{cursor:"pointer"}} accent={uc.confiance>=90?C.err:uc.confiance>=85?C.warn:C.info}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:28,height:28,borderRadius:7,background:C.sec+"14",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {uc.type==="photo"?<Camera size={13} color={C.sec}/>:uc.type==="plan"?<FileText size={13} color={C.sec}/>:uc.type==="livrable"?<Layers size={13} color={C.sec}/>:<Send size={13} color={C.sec}/>}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:C.dk}}>{uc.titre}</div>
              <div style={{fontSize:9,color:C.g}}>Entrée : {uc.entree}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <Badge v={uc.anomalies.length>=3?"danger":"warning"} s="xs">{uc.resultat}</Badge>
            <div style={{fontSize:9,fontWeight:700,color:uc.confiance>=90?C.ok:C.warn}}>Confiance {uc.confiance}%</div>
            <ChevronRight size={12} color={C.lG}/>
          </div>
        </div>
      </Cd>)}
    </div>

    <ST>Modules IA disponibles</ST>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
      {[
        { t:"Synthèse auto du jour", d:"Résumé consolidé de tous les projets", i:FileText },
        { t:"Détection malfaçons photo", d:"Analyse IA des photos chantier", i:Camera },
        { t:"Conformité plans", d:"Check automatique vs référentiel WeCare", i:Shield },
        { t:"Analyse livrables", d:"Détection incohérences et oublis", i:BookOpen },
        { t:"Relances automatiques", d:"Génération relances aux intervenants", i:Send },
        { t:"Détection contradictions", d:"Croisement rapports, vidéo, planning", i:ScanEye },
        { t:"Préparation visite", d:"Checklist et points de vigilance", i:Eye },
        { t:"Synthèse avant comité", d:"Brief structuré pour réunion projet", i:Target },
        { t:"Pilotage prédictif", d:"Anticipation dérives budget/planning", i:TrendingUp },
      ].map((c,i) => <Cd key={i} style={{ cursor:"pointer" }}>
        <div style={{ width:28, height:28, borderRadius:7, background:C.sec+"14", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:6 }}><c.i size={13} color={C.sec}/></div>
        <div style={{ fontSize:11, fontWeight:700, color:C.dk }}>{c.t}</div>
        <div style={{ fontSize:10, color:C.g, marginTop:2 }}>{c.d}</div>
      </Cd>)}
    </div>

    <Drawer open={!!uc} onClose={()=>setSelCase(null)} title={uc?"Détail analyse IA":""} width={560}>
      {uc && <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <h4 style={{fontSize:14,fontWeight:700,margin:0}}>{uc.titre}</h4>
        <DetailRow label="Type" value={uc.type}/>
        <DetailRow label="Entrée" value={uc.entree}/>
        <DetailRow label="Confiance" value={uc.confiance+"%"} color={uc.confiance>=90?C.ok:C.warn}/>

        <ST>Anomalies détectées</ST>
        {uc.anomalies.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",background:C.errL+"30",borderRadius:5,border:"1px solid "+C.err+"15"}}>
          <AlertTriangle size={10} color={C.err}/>
          <span style={{fontSize:10,color:C.dk}}>{a}</span>
        </div>)}

        <ST>Recommandation IA</ST>
        <div style={{padding:"8px 12px",background:C.sec+"08",borderRadius:6,fontSize:11,color:C.dk,lineHeight:1.6,fontWeight:500}}>{uc.recommandation}</div>

        <ST>Justification</ST>
        <div style={{padding:"8px 10px",background:C.bgL,borderRadius:6,fontSize:10,color:C.g}}>{uc.justification}</div>

        <ST>Actions disponibles</ST>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {uc.actions.map((a,i)=><Bt key={i} icon={i===0?Flag:i===1?RotateCcw:i===2?FileText:Send} v={i===0?"primary":"ghost"} small>{a}</Bt>)}
          <Bt icon={Archive} v="ghost" small>Archiver l'analyse</Bt>
        </div>
      </div>}
    </Drawer>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* NAVIGATION                                                           */
/* ══════════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { k:"cockpit", l:"Cockpit AMOA", i:Gauge },
  { k:"projets", l:"Mes Projets", i:Layers },
  { k:"etudes", l:"Études & Livrables", i:FileText },
  { k:"validations", l:"Validations", i:ClipboardCheck },
  { k:"ecarts", l:"Écarts & Réserves", i:Shield },
  { k:"rapports", l:"Rapports", i:FileCheck },
  { k:"docs", l:"Documents", i:FolderOpen },
  { k:"video", l:"Vidéosurveillance", i:Video },
  { k:"msg", l:"Messagerie", i:MessageSquare },
  { k:"kpi", l:"KPI & Analytics", i:BarChart3 },
  { k:"ia", l:"IA KOMA", i:Brain },
];

function Sidebar({ nav, onNav, collapsed }) {
  const counts = {
    validations: VALIDATIONS.filter(v=>v.statut==="En attente").length,
    ecarts: ECARTS.filter(e=>e.statut==="Ouvert"||e.statut==="En traitement").length,
    rapports: RAPPORTS.filter(r=>r.statut==="À valider").length,
    msg: MESSAGES.filter(m=>m.attente).length,
  };

  return <div style={{ width:collapsed?56:230, minHeight:"100vh", background:C.dk, color:"#fff", display:"flex", flexDirection:"column", transition:"width 0.2s", overflow:"hidden", flexShrink:0 }}>
    <div style={{ padding:collapsed?"14px 10px":"14px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ width:32, height:32, borderRadius:"50%", background:C.sec, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, flexShrink:0 }}>K</div>
      {!collapsed && <div><div style={{ fontSize:12, fontWeight:700 }}>KOMA Expertise</div><div style={{ fontSize:8, color:C.sec, textTransform:"uppercase", letterSpacing:1.5 }}>Portail AMOA</div></div>}
    </div>
    {!collapsed && <div style={{ margin:"8px 10px 4px", padding:"6px 10px", borderRadius:6, background:C.sec+"18", display:"flex", alignItems:"center", gap:6 }}>
      <Shield size={12} color={C.sec}/>
      <span style={{ fontSize:10, fontWeight:700, color:C.sec }}>Conformité · Validation · Contrôle</span>
    </div>}
    <div style={{ flex:1, padding:"6px 6px", display:"flex", flexDirection:"column", gap:1, overflowY:"auto" }}>
      {NAV_ITEMS.map(it => {
        const isAct = nav===it.k;
        const cnt = counts[it.k];
        return <button key={it.k} onClick={()=>onNav(it.k)} style={{ display:"flex", alignItems:"center", gap:8, padding:collapsed?"8px":"7px 10px", borderRadius:6, border:"none", cursor:"pointer", background:isAct?C.sec+"18":"transparent", color:isAct?C.sec:"rgba(255,255,255,0.45)", fontSize:11, fontWeight:isAct?600:400, textAlign:"left", width:"100%" }}>
          <it.i size={14} style={{ flexShrink:0 }}/>
          {!collapsed && <span style={{ flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{it.l}</span>}
          {!collapsed && cnt>0 && <span style={{ fontSize:8, fontWeight:700, padding:"1px 5px", borderRadius:8, background:C.err, color:"#fff" }}>{cnt}</span>}
        </button>;
      })}
    </div>
    {!collapsed && <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:28, height:28, borderRadius:"50%", background:C.sec+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:C.sec }}>SK</div>
        <div><div style={{ fontSize:10, fontWeight:600, color:"#fff" }}>S. Kamga</div><div style={{ fontSize:8, color:C.lG }}>AMOA Senior</div></div>
      </div>
    </div>}
  </div>;
}

function TopBar({ onToggle }) {
  const [showNotif, setShowNotif] = useState(false);
  return <div style={{ height:48, padding:"0 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid "+C.brd, background:C.w, flexShrink:0 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", color:C.g, display:"flex" }}><Menu size={16}/></button>
      <div style={{ display:"flex", alignItems:"center", gap:4, background:C.bgL, borderRadius:6, padding:"4px 10px", border:"1px solid "+C.brd, width:280 }}>
        <Search size={12} color={C.lG}/><input placeholder="Rechercher projet, écart, livrable, document..." style={{ border:"none", background:"transparent", outline:"none", fontSize:11, color:C.dkG, width:"100%" }}/>
      </div>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ fontSize:10, color:C.g }}>Mer. 16 Avril 2026</div>
      <div style={{ position:"relative" }}>
        <button onClick={()=>setShowNotif(!showNotif)} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><Bell size={15} color={C.g}/></button>
        <div style={{ position:"absolute", top:-3, right:-3, width:14, height:14, borderRadius:"50%", background:C.err, color:"#fff", fontSize:7, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>6</div>
        {showNotif && <div style={{position:"absolute",top:24,right:0,width:300,background:C.w,borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",border:"1px solid "+C.brd,zIndex:100,padding:8}}>
          <div style={{fontSize:11,fontWeight:700,marginBottom:6}}>Notifications</div>
          {FEED_ITEMS.slice(0,5).map((f,i)=><div key={i} style={{padding:"5px 0",borderBottom:"1px solid "+C.brd,fontSize:10,color:C.dkG}}>{f.txt}<div style={{fontSize:8,color:C.lG,marginTop:1}}>{f.time}</div></div>)}
        </div>}
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* ROOT                                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
export default function KomaAMOAPortal() {
  const [nav, setNav] = useState("cockpit");
  const [collapsed, setCollapsed] = useState(false);

  const page = () => {
    switch(nav) {
      case "cockpit": return <PageCockpit onNav={setNav}/>;
      case "projets": return <PageProjets/>;
      case "etudes": return <PageEtudes/>;
      case "validations": return <PageValidations/>;
      case "ecarts": return <PageEcarts/>;
      case "rapports": return <PageRapports/>;
      case "docs": return <PageGED/>;
      case "video": return <PageVideo/>;
      case "msg": return <PageMsg/>;
      case "kpi": return <PageKPI/>;
      case "ia": return <PageIA/>;
      default: return <PageCockpit onNav={setNav}/>;
    }
  };

  return <div style={{ display:"flex", height:"100vh", width:"100%", fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:C.bgL, overflow:"hidden" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      * { box-sizing: border-box; margin: 0; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
      button:hover { opacity: 0.88; }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    `}</style>
    <Sidebar nav={nav} onNav={setNav} collapsed={collapsed}/>
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <TopBar onToggle={()=>setCollapsed(p=>!p)}/>
      <div style={{ flex:1, overflow:"auto", padding:18 }}>
        {page()}
      </div>
    </div>
  </div>;
}
