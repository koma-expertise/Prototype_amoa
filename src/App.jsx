import { useState, useCallback, useMemo } from "react";
import {
  Shield, FileCheck, AlertTriangle, CheckCircle2, XCircle, Clock, Eye,
  ChevronRight, ChevronDown, Bell, Search, Menu, Plus, Filter,
  Building2, Users, FileText, BarChart3, FolderOpen, Camera,
  MessageSquare, Video, Brain, Layers, Activity, Target, Briefcase,
  MapPin, TrendingUp, TrendingDown, X, Send, Upload, Download,
  Calendar, Zap, AlertOctagon, ClipboardCheck, GitBranch, Archive,
  ExternalLink, Paperclip, Flag, ThumbsUp, ThumbsDown, RotateCcw,
  Maximize2, Minimize2, ChevronLeft, MoreVertical, Star,
  CircleDot, Hash, BookOpen, Gauge, ScanEye, Hammer, CircleAlert
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
  rose: "#E11D48",
};

/* ─── DONNÉES MOCKÉES PROJETS ─── */
const PROJECTS = [
  { id:"PRJ-001", nom:"Villa Éden", loc:"Douala, Bonanjo", client:"J-P Fouda", typo:"neuf", phase:"Construction", phaseIdx:7, statut:"Actif", budget:120e6, dep:52.8e6, av:44, avPlan:48, risque:"Modéré", conformite:82, reservesOuv:3, ecartsOuv:2, validAttente:4, sensClient:"Moyenne", dernCtrl:"16/04/2026", prochJalon:"Fin GO R+1 — 28/04", spoc:"M. Atangana", moe:"Arc. Njoya", moex:"BTP Cameroun", tempCtrl:"stable" },
  { id:"PRJ-002", nom:"Résidence Kotto", loc:"Douala, Kotto", client:"M. Ndiaye", typo:"neuf", phase:"Conception", phaseIdx:4, statut:"En validation", budget:85e6, dep:2.1e6, av:8, avPlan:10, risque:"Faible", conformite:95, reservesOuv:0, ecartsOuv:0, validAttente:2, sensClient:"Faible", dernCtrl:"14/04/2026", prochJalon:"Validation APS — 22/04", spoc:"M. Atangana", moe:"—", moex:"—", tempCtrl:"favorable" },
  { id:"PRJ-004", nom:"Reprise Bali", loc:"Douala, Bali", client:"P. Essomba", typo:"reprise", phase:"Devis", phaseIdx:3, statut:"Actif", budget:45e6, dep:12e6, av:28, avPlan:35, risque:"Élevé", conformite:58, reservesOuv:5, ecartsOuv:4, validAttente:6, sensClient:"Haute", dernCtrl:"15/04/2026", prochJalon:"Devis finalisé — 20/04", spoc:"M. Atangana", moe:"—", moex:"Bati-Plus", tempCtrl:"dégradé" },
  { id:"PRJ-006", nom:"Étude Kribi", loc:"Kribi", client:"J-P Fouda", typo:"etudes", phase:"Pré-faisabilité", phaseIdx:1, statut:"Actif", budget:2.5e6, dep:0.8e6, av:60, avPlan:55, risque:"Faible", conformite:90, reservesOuv:1, ecartsOuv:0, validAttente:1, sensClient:"Faible", dernCtrl:"10/04/2026", prochJalon:"Livraison rapport — 25/04", spoc:"M. Atangana", moe:"—", moex:"—", tempCtrl:"favorable" },
];

/* ─── VALIDATIONS ─── */
const VALIDATIONS = [
  { id:"VAL-001", projet:"PRJ-001", objet:"Rapport journalier RJ-16", type:"Rapport", auteur:"B. Ekambi (MOEX)", date:"16/04", risque:"Moyen", synthese:"Coffrage poteaux R+1 – 8 ouvriers – 75% avancement déclaré. Vérifier cohérence avec vidéo.", delai:"17/04", statut:"En attente", pj:true, crit:false },
  { id:"VAL-002", projet:"PRJ-004", objet:"Devis reprise v2", type:"Devis", auteur:"M. Atangana (SPOC)", date:"14/04", risque:"Élevé", synthese:"Écart +18% vs estimation initiale. Poste ferraillage à requalifier. Impact budget client.", delai:"18/04", statut:"En attente", pj:true, crit:true },
  { id:"VAL-003", projet:"PRJ-001", objet:"Plan RDC v2 — APD", type:"Livrable", auteur:"Arc. Njoya (MOE)", date:"10/04", risque:"Moyen", synthese:"Plan modifié suite réserve AMOA #R-003. Vérifier cotations et conformité normes WeCare.", delai:"20/04", statut:"En attente", pj:true, crit:false },
  { id:"VAL-004", projet:"PRJ-002", objet:"APS — Plans distribution", type:"Étude", auteur:"Arc. Njoya (MOE)", date:"12/04", risque:"Faible", synthese:"Premier lot APS. Vérifier complétude vs référentiel WeCare.", delai:"22/04", statut:"En attente", pj:false, crit:false },
  { id:"VAL-005", projet:"PRJ-004", objet:"Rapport visite AMOA 15/04", type:"Rapport", auteur:"S. Kamga (AMOA)", date:"15/04", risque:"Élevé", synthese:"5 non-conformités identifiées. Ferraillage LOT II non conforme aux plans PRO.", delai:"16/04", statut:"En attente", pj:true, crit:true },
  { id:"VAL-006", projet:"PRJ-001", objet:"Commande ciment CPJ — DA-005", type:"Achat", auteur:"BTP Cameroun (MOEX)", date:"15/04", risque:"Moyen", synthese:"200 sacs × 5 200 FCFA. Vérifier prix vs devis référence. Stock actuel : 245.", delai:"17/04", statut:"En attente", pj:false, crit:false },
  { id:"VAL-007", projet:"PRJ-006", objet:"Rapport faisabilité terrain", type:"Étude", auteur:"S. Kamga (AMOA)", date:"08/04", risque:"Faible", synthese:"Terrain exploitable. Sol porteur. Accès routier OK. Recommandation : G2 AVP.", delai:"12/04", statut:"Validée", pj:true, crit:false },
  { id:"VAL-008", projet:"PRJ-001", objet:"Facture main-d'œuvre Mars", type:"Facture", auteur:"SPOC", date:"01/04", risque:"Faible", synthese:"3.2M FCFA conforme au planning. Aucun écart.", delai:"05/04", statut:"Rejetée", pj:false, crit:false },
];

/* ─── ÉCARTS & RÉSERVES ─── */
const ECARTS = [
  { id:"EC-001", projet:"PRJ-004", lot:"LOT II — Gros Œuvre", type:"Non-conformité", gravite:"Critique", source:"Visite AMOA", constat:"Ferraillage poteaux non conforme au plan PRO. Espacement HA12 > norme.", impact:"Qualité + Sécurité", resp:"Bati-Plus", dateOuv:"15/04", ech:"18/04", statut:"Ouvert", preuve:"Photo + Rapport RV-15", relance:2 },
  { id:"EC-002", projet:"PRJ-001", lot:"LOT II — Gros Œuvre", type:"Écart budgétaire", gravite:"Majeur", source:"Rapport SPOC", constat:"Hausse ciment +8% non anticipée. Impact devis lot II.", impact:"Coût (+4%)", resp:"SPOC / AMOA", dateOuv:"12/04", ech:"20/04", statut:"En traitement", preuve:"Facture fournisseur", relance:1 },
  { id:"EC-003", projet:"PRJ-004", lot:"LOT I — Travaux Prép.", type:"Retard", gravite:"Majeur", source:"Rapport journalier", constat:"Retard +8 jours sur planning. Cause : approvisionnement et pluie.", impact:"Délai (+8j)", resp:"Bati-Plus", dateOuv:"10/04", ech:"22/04", statut:"Ouvert", preuve:"Planning mis à jour", relance:3 },
  { id:"EC-004", projet:"PRJ-004", lot:"LOT III — Clos Couvert", type:"Réserve majeure", gravite:"Majeur", source:"Visite AMOA", constat:"Étanchéité toiture non testée avant pose couverture.", impact:"Qualité", resp:"Bati-Plus", dateOuv:"14/04", ech:"19/04", statut:"Ouvert", preuve:"Photo", relance:1 },
  { id:"EC-005", projet:"PRJ-001", lot:"LOT IV — Second Œuvre", type:"Observation", gravite:"Mineur", source:"Vidéo", constat:"Alignement cloisons RDC à vérifier lors prochaine visite.", impact:"Qualité (mineur)", resp:"BTP Cameroun", dateOuv:"16/04", ech:"25/04", statut:"Ouvert", preuve:"Capture vidéo CAM-003", relance:0 },
  { id:"EC-006", projet:"PRJ-004", lot:"LOT II — Gros Œuvre", type:"Non-conformité", gravite:"Critique", source:"Visite AMOA", constat:"Verticalité poteaux hors tolérance (>2cm). Reprise nécessaire.", impact:"Qualité + Sécurité", resp:"Bati-Plus", dateOuv:"15/04", ech:"18/04", statut:"Ouvert", preuve:"Photo + Mesure", relance:2 },
  { id:"R-001", projet:"PRJ-001", lot:"LOT II — Gros Œuvre", type:"Réserve mineure", gravite:"Mineur", source:"Visite AMOA", constat:"Enrobage ferraillage insuffisant sur 2 poteaux RDC.", impact:"Qualité", resp:"BTP Cameroun", dateOuv:"12/04", ech:"16/04", statut:"Levée", preuve:"Photo avant/après", relance:0 },
  { id:"R-002", projet:"PRJ-006", lot:"—", type:"Observation", gravite:"Mineur", source:"Rapport", constat:"Coordonnées GPS terrain à confirmer avec géomètre.", impact:"Documentation", resp:"AMOA", dateOuv:"08/04", ech:"15/04", statut:"Levée", preuve:"PV géomètre", relance:0 },
];

/* ─── RAPPORTS ─── */
const RAPPORTS = [
  { id:"RJ-16", date:"16/04", type:"Journalier", projet:"PRJ-001", auteur:"B. Ekambi", role:"MOEX", meteo:"Soleil", lot:"LOT II", resume:"Coffrage poteaux R+1. 8 ouvriers. Avancement 75%.", ecarts:0, statut:"À valider", transmissible:false, sensible:false },
  { id:"RJ-15", date:"15/04", type:"Journalier", projet:"PRJ-001", auteur:"B. Ekambi", role:"MOEX", meteo:"Soleil", lot:"LOT II", resume:"Ferraillage R+1 terminé. Attente contrôle AMOA.", ecarts:0, statut:"Validé", transmissible:true, sensible:false },
  { id:"RV-15", date:"15/04", type:"Visite AMOA", projet:"PRJ-004", auteur:"S. Kamga", role:"AMOA", meteo:"Nuageux", lot:"LOT II", resume:"5 non-conformités identifiées. Ferraillage + verticalité.", ecarts:5, statut:"À valider", transmissible:false, sensible:true },
  { id:"RJ-14", date:"14/04", type:"Journalier", projet:"PRJ-004", auteur:"T. Mbede", role:"MOEX", meteo:"Pluie", lot:"LOT I", resume:"Arrêt chantier pour pluie. Jour sans travail justifié.", ecarts:0, statut:"À corriger", transmissible:false, sensible:false },
  { id:"RV-12", date:"12/04", type:"Visite AMOA", projet:"PRJ-001", auteur:"S. Kamga", role:"AMOA", meteo:"Soleil", lot:"LOT II", resume:"Fondations conformes. Réserve mineure enrobage.", ecarts:1, statut:"Validé", transmissible:true, sensible:false },
  { id:"RJ-12", date:"12/04", type:"Journalier", projet:"PRJ-001", auteur:"B. Ekambi", role:"MOEX", meteo:"Soleil", lot:"LOT II", resume:"Coulage semelles. RAS.", ecarts:0, statut:"Validé", transmissible:true, sensible:false },
];

/* ─── ÉTUDES & LIVRABLES ─── */
const ETUDES = [
  { id:"LIV-001", projet:"PRJ-001", type:"Plan de masse", phase:"APS", version:"v2", auteur:"Arc. Njoya", date:"08/04", statut:"Validé", completude:100, obsAMOA:"Conforme référentiel WeCare.", action:"—" },
  { id:"LIV-002", projet:"PRJ-001", type:"Plans RDC 1/50", phase:"APD", version:"v2", auteur:"Arc. Njoya", date:"10/04", statut:"En revue", completude:90, obsAMOA:"Cotations à vérifier. Réserve #R-003 à intégrer.", action:"Valider ou rejeter" },
  { id:"LIV-003", projet:"PRJ-001", type:"Note de calcul structure", phase:"APD", version:"v1", auteur:"BET Structure", date:"13/04", statut:"Reçu", completude:70, obsAMOA:"Incomplet : pas de note sismique.", action:"Demander complément" },
  { id:"LIV-004", projet:"PRJ-002", type:"Plans distribution APS", phase:"APS", version:"v1", auteur:"Arc. Njoya", date:"12/04", statut:"En revue", completude:85, obsAMOA:"Vérifier conformité nommage pièces + surfaces.", action:"Valider ou rejeter" },
  { id:"LIV-005", projet:"PRJ-004", type:"Diagnostic structure existante", phase:"Diagnostic", version:"v1", auteur:"BET Diag.", date:"05/04", statut:"Validé", completude:100, obsAMOA:"RAS. Bon état structural global.", action:"—" },
  { id:"LIV-006", projet:"PRJ-004", type:"Devis reprise v2", phase:"Devis", version:"v2", auteur:"M. Atangana", date:"14/04", statut:"À corriger", completude:60, obsAMOA:"Écart +18%. Poste ferraillage à requalifier.", action:"Correction requise" },
  { id:"LIV-007", projet:"PRJ-006", type:"Rapport faisabilité terrain", phase:"Pré-faisabilité", version:"v1", auteur:"S. Kamga", date:"08/04", statut:"Validé", completude:100, obsAMOA:"Terrain exploitable. Recommandation G2 AVP.", action:"—" },
  { id:"LIV-008", projet:"PRJ-006", type:"Étude géotechnique G2 AVP", phase:"Pré-faisabilité", version:"—", auteur:"—", date:"—", statut:"Attendu", completude:0, obsAMOA:"Non encore commandée. Priorité haute.", action:"Lancer commande" },
];

/* ─── GED ─── */
const DOCS = [
  { id:"DOC-001", nom:"Plan de masse v2.dwg", cat:"Plans", projet:"PRJ-001", version:"v2", date:"08/04", auteur:"Arc. Njoya", statut:"Validé", client:true, lien:"LIV-001" },
  { id:"DOC-002", nom:"Plans RDC 1/50 v2.pdf", cat:"Plans", projet:"PRJ-001", version:"v2", date:"10/04", auteur:"Arc. Njoya", statut:"En revue", client:false, lien:"VAL-003" },
  { id:"DOC-003", nom:"Rapport visite 15-04.pdf", cat:"Rapports", projet:"PRJ-004", version:"v1", date:"15/04", auteur:"S. Kamga", statut:"À valider", client:false, lien:"VAL-005" },
  { id:"DOC-004", nom:"Devis reprise v2.xlsx", cat:"Devis", projet:"PRJ-004", version:"v2", date:"14/04", auteur:"M. Atangana", statut:"À corriger", client:false, lien:"VAL-002" },
  { id:"DOC-005", nom:"PV réception fondations.pdf", cat:"PV", projet:"PRJ-001", version:"v1", date:"05/04", auteur:"S. Kamga", statut:"Validé", client:true, lien:"—" },
  { id:"DOC-006", nom:"Photo ferraillage NC.jpg", cat:"Preuves", projet:"PRJ-004", version:"—", date:"15/04", auteur:"S. Kamga", statut:"Rattaché", client:false, lien:"EC-001" },
  { id:"DOC-007", nom:"Contrat MOE PRJ-001.pdf", cat:"Contrats", projet:"PRJ-001", version:"v1", date:"15/01", auteur:"Admin", statut:"Signé", client:true, lien:"—" },
  { id:"DOC-008", nom:"Faisabilité Kribi.pdf", cat:"Études", projet:"PRJ-006", version:"v1", date:"08/04", auteur:"S. Kamga", statut:"Validé", client:true, lien:"LIV-007" },
  { id:"DOC-MANQ-001", nom:"Étude G2 AVP", cat:"Études", projet:"PRJ-006", version:"—", date:"—", auteur:"—", statut:"Manquant", client:false, lien:"LIV-008" },
  { id:"DOC-MANQ-002", nom:"Note sismique", cat:"Technique", projet:"PRJ-001", version:"—", date:"—", auteur:"—", statut:"Manquant", client:false, lien:"LIV-003" },
];

/* ─── CAMÉRAS ─── */
const CAMS = [
  { id:"CAM-001", nom:"Entrée chantier", zone:"Accès", projet:"PRJ-001", s:"En ligne", evt:"16/04 08:14 — Mouvement détecté", lienEc:"—" },
  { id:"CAM-002", nom:"Zone matériaux", zone:"Stock", projet:"PRJ-001", s:"En ligne", evt:"16/04 07:30 — Livraison détectée", lienEc:"—" },
  { id:"CAM-003", nom:"Front GO R+1", zone:"Gros Œuvre", projet:"PRJ-001", s:"En ligne", evt:"16/04 09:45 — Activité continue", lienEc:"EC-005" },
  { id:"CAM-004", nom:"Panoramique 360", zone:"Vue globale", projet:"PRJ-001", s:"Hors ligne", evt:"14/04 — Coupure réseau", lienEc:"—" },
  { id:"CAM-005", nom:"Entrée chantier Bali", zone:"Accès", projet:"PRJ-004", s:"En ligne", evt:"15/04 16:20 — Fin journée", lienEc:"—" },
  { id:"CAM-006", nom:"Zone GO Bali", zone:"Gros Œuvre", projet:"PRJ-004", s:"En ligne", evt:"15/04 14:10 — Activité réduite", lienEc:"EC-006" },
];

/* ─── MESSAGES ─── */
const MESSAGES = [
  { from:"M. Atangana", role:"SPOC", projet:"PRJ-004", sujet:"Devis reprise — écart +18%", prio:"Haute", attente:true, lien:"VAL-002", msgs:[
    { auteur:"M. Atangana", role:"SPOC", txt:"Le client questionne l'écart de +18% sur le devis. Peux-tu qualifier les postes concernés ?", time:"15/04 09:30" },
    { auteur:"S. Kamga", role:"AMOA", txt:"J'ai identifié le poste ferraillage comme principal facteur. Rapport de visite en cours de finalisation.", time:"15/04 11:15" },
  ]},
  { from:"Arc. Njoya", role:"MOE", projet:"PRJ-001", sujet:"Plans RDC v2 — réserve intégrée", prio:"Moyenne", attente:false, lien:"VAL-003", msgs:[
    { auteur:"Arc. Njoya", role:"MOE", txt:"Plans RDC v2 transmis avec correction de la réserve #R-003. Merci de valider.", time:"10/04 14:00" },
    { auteur:"S. Kamga", role:"AMOA", txt:"Reçu. Vérification en cours. Retour prévu d'ici vendredi.", time:"10/04 16:45" },
  ]},
  { from:"BTP Cameroun", role:"MOEX", projet:"PRJ-001", sujet:"Demande matériaux — 200 sacs ciment", prio:"Moyenne", attente:true, lien:"VAL-006", msgs:[
    { auteur:"B. Ekambi", role:"MOEX", txt:"DA-005 soumise pour 200 sacs ciment CPJ. Besoin urgent pour coulage jeudi.", time:"15/04 17:00" },
  ]},
  { from:"Bati-Plus", role:"MOEX", projet:"PRJ-004", sujet:"Correction ferraillage — plan d'action", prio:"Haute", attente:true, lien:"EC-001", msgs:[
    { auteur:"T. Mbede", role:"MOEX", txt:"Suite à votre constat, nous prévoyons reprise ferraillage poteaux P3 et P5. Délai estimé 3 jours.", time:"16/04 08:00" },
  ]},
  { from:"J-P Fouda", role:"Client", projet:"PRJ-001", sujet:"Questions sur avancement", prio:"Faible", attente:false, lien:"—", msgs:[
    { auteur:"J-P Fouda", role:"Client", txt:"Merci pour le rapport de visite. Tout est conforme ?", time:"13/04 20:00" },
    { auteur:"S. Kamga", role:"AMOA", txt:"Oui, fondations conformes. Réserve mineure levée. Construction en bonne voie.", time:"14/04 09:00" },
  ]},
];

/* ─── COMPOSANTS UI ─── */
function Badge({ children, v = "default", s = "sm" }) {
  const m = {
    default:{bg:C.priL,c:C.priD}, success:{bg:C.okL,c:C.okD}, warning:{bg:C.warnL,c:C.warnD},
    danger:{bg:C.errL,c:C.errD}, info:{bg:C.infoL,c:C.infoD}, purple:{bg:C.purpL,c:C.purpD},
    dark:{bg:C.bg2,c:"#1F2937"}, active:{bg:C.secL,c:C.secD},
    critique:{bg:"#FEE2E2",c:"#991B1B"}, majeur:{bg:"#FEF3C7",c:"#92400E"},
    mineur:{bg:"#DBEAFE",c:"#1E40AF"}, leve:{bg:C.okL,c:C.okD},
  };
  const st = m[v] || m.default;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:3, padding:s==="xs"?"1px 5px":"2px 9px", borderRadius:20, fontSize:s==="xs"?9:10, fontWeight:600, background:st.bg, color:st.c, whiteSpace:"nowrap", letterSpacing:0.2 }}>{children}</span>;
}
function SB({ s }) {
  const m = { "En attente":"warning","À valider":"warning","En revue":"info","Validé":"success","Validée":"success","Rejetée":"danger","Reçu":"default","À corriger":"danger","Attendu":"dark","Ouvert":"danger","En traitement":"warning","Levée":"success","Levé":"success","Signé":"success","Manquant":"danger","Rattaché":"purple","En ligne":"success","Hors ligne":"danger","Actif":"success","Brouillon":"dark","En validation":"warning","Transmissible":"active" };
  return <Badge v={m[s]||"default"}>{s}</Badge>;
}
function GravBadge({ g }) {
  const m = { "Critique":"critique","Majeur":"majeur","Mineur":"mineur","Levée":"leve" };
  return <Badge v={m[g]||"default"} s="xs">{g}</Badge>;
}

function Kpi({ icon:I, label, value, sub, trend, color=C.sec, accent }) {
  return <div style={{ background:C.w, borderRadius:10, padding:"12px 14px", border:"1px solid "+C.brd, flex:1, minWidth:135, position:"relative", overflow:"hidden" }}>
    {accent && <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:color, borderRadius:"10px 0 0 10px" }}/>}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div style={{ width:28, height:28, borderRadius:7, background:color+"14", display:"flex", alignItems:"center", justifyContent:"center" }}><I size={13} color={color}/></div>
      {trend!==undefined && <span style={{ fontSize:10, fontWeight:600, color:trend>=0?C.ok:C.err, display:"flex", alignItems:"center", gap:1 }}>{trend>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{Math.abs(trend)}%</span>}
    </div>
    <div style={{ fontSize:17, fontWeight:800, color:C.dk, marginTop:5 }}>{value}</div>
    <div style={{ fontSize:10, color:C.g, marginTop:1 }}>{label}</div>
    {sub && <div style={{ fontSize:9, color:C.lG }}>{sub}</div>}
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

function Bt({ children, v="primary", icon:I, onClick, small }) {
  const p = v==="primary";
  const d = v==="danger";
  return <button onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:4, borderRadius:6, fontWeight:600, cursor:"pointer", fontSize:small?10:11, padding:small?"3px 8px":"5px 11px", background:p?C.sec:d?C.err:C.bgL, color:p||d?"#fff":C.dkG, border:p||d?"none":"1px solid "+C.brd, transition:"all 0.15s" }}>{I && <I size={small?10:12}/>}{children}</button>;
}

function ST({ children, right }) {
  return <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
    <h3 style={{ fontSize:13, fontWeight:700, color:C.dk, margin:0 }}>{children}</h3>
    {right}
  </div>;
}

function Tbl({ cols, data, compact }) {
  return <div style={{ overflowX:"auto", borderRadius:8, border:"1px solid "+C.brd }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
      <thead><tr style={{ background:C.bgL }}>{cols.map((c,i) => <th key={i} style={{ padding:compact?"5px 8px":"7px 10px", textAlign:"left", fontWeight:600, color:C.g, fontSize:9, textTransform:"uppercase", letterSpacing:0.5, borderBottom:"1px solid "+C.brd }}>{c.label}</th>)}</tr></thead>
      <tbody>{data.map((r,ri) => <tr key={ri} style={{ borderBottom:"1px solid "+C.brd, background:r._highlight?C.errL+"40":"transparent" }}>{cols.map((c,ci) => <td key={ci} style={{ padding:compact?"5px 8px":"7px 10px", color:C.dkG, verticalAlign:"top" }}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function TabBar({ tabs, active, onChange }) {
  return <div style={{ display:"flex", gap:2, background:C.bg2, borderRadius:7, padding:2 }}>
    {tabs.map(t => <button key={t.k} onClick={()=>onChange(t.k)} style={{ padding:"5px 12px", borderRadius:5, border:"none", cursor:"pointer", fontSize:10, fontWeight:active===t.k?700:500, background:active===t.k?C.w:"transparent", color:active===t.k?C.dk:C.g, boxShadow:active===t.k?"0 1px 3px rgba(0,0,0,0.06)":"none", transition:"all 0.15s" }}>{t.l}{t.count!==undefined && <span style={{ marginLeft:4, fontSize:8, fontWeight:700, padding:"0 4px", borderRadius:8, background:active===t.k?C.sec+"18":C.bg2, color:active===t.k?C.sec:C.lG }}>{t.count}</span>}</button>)}
  </div>;
}

function TempBadge({ t }) {
  const cfg = { favorable:{c:C.ok,l:"Favorable",i:"●"}, stable:{c:C.warn,l:"Stable",i:"●"}, "dégradé":{c:C.err,l:"Dégradé",i:"●"} };
  const s = cfg[t]||cfg.stable;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:9, fontWeight:600, color:s.c }}><span style={{ fontSize:7 }}>{s.i}</span>{s.l}</span>;
}

function fmt(n) { return (n/1e6).toFixed(n>=1e6?1:2)+"M"; }

/* ══════════════════════════════════════════════════════════════════════ */
/* 1. COCKPIT AMOA                                                      */
/* ══════════════════════════════════════════════════════════════════════ */
function PageCockpit({ onNav }) {
  const vEnAttente = VALIDATIONS.filter(v=>v.statut==="En attente");
  const ecOuverts = ECARTS.filter(e=>e.statut==="Ouvert"||e.statut==="En traitement");
  const rapAVal = RAPPORTS.filter(r=>r.statut==="À valider");
  const pjRisque = PROJECTS.filter(p=>p.risque==="Élevé"||p.conformite<70);
  const actCorr = ECARTS.filter(e=>e.statut==="Ouvert"&&new Date("2026-04-"+e.ech.split("/")[0])<new Date("2026-04-18"));

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    {/* HEADER */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Cockpit AMOA</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Tour de contrôle</h2>
        <div style={{ fontSize:10, color:C.g }}>Mercredi 16 avril 2026 · S. Kamga</div>
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <Bt icon={Plus} v="ghost">Nouvelle réserve</Bt>
        <Bt icon={FileCheck}>Valider en lot</Bt>
      </div>
    </div>

    {/* KPI EXÉCUTIF */}
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      <Kpi icon={Briefcase} label="Projets suivis" value="4" color={C.sec} accent/>
      <Kpi icon={Clock} label="Validations en attente" value={String(vEnAttente.length)} color={C.warn} accent/>
      <Kpi icon={AlertTriangle} label="Écarts ouverts" value={String(ecOuverts.length)} color={C.err} accent/>
      <Kpi icon={Shield} label="Réserves critiques" value={String(ECARTS.filter(e=>e.gravite==="Critique"&&e.statut!=="Levée").length)} color={C.err} accent/>
      <Kpi icon={FileCheck} label="Rapports à relire" value={String(rapAVal.length)} color={C.info} accent/>
      <Kpi icon={CircleAlert} label="Actions correctives en retard" value={String(actCorr.length)} color={C.rose} accent/>
    </div>

    {/* ACTIONS URGENTES */}
    <Cd accent={C.err} style={{ background:C.errL+"18" }}>
      <ST right={<Badge v="danger" s="xs">{6} actions</Badge>}>⚡ Actions urgentes AMOA</ST>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {[
          { m:"Valider rapport RJ-16 — Coffrage R+1 (PRJ-001)", t:"Validation", c:C.warn, dl:"Aujourd'hui" },
          { m:"Qualifier écart +18% devis reprise (PRJ-004)", t:"Contrôle budget", c:C.err, dl:"18/04" },
          { m:"Documenter NC ferraillage — 2 constats critiques (PRJ-004)", t:"Non-conformité", c:C.err, dl:"18/04" },
          { m:"Vérifier cohérence rapport RV-15 vs vidéo CAM-006 (PRJ-004)", t:"Corroboration", c:C.warn, dl:"17/04" },
          { m:"Plan RDC v2 en revue depuis 6 jours (PRJ-001)", t:"Livrable", c:C.info, dl:"20/04" },
          { m:"Remonter situation PRJ-004 au SPOC — escalade recommandée", t:"Escalade", c:C.err, dl:"Aujourd'hui" },
        ].map((a,i) => <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:6, background:C.w, border:"1px solid "+C.brd, borderLeft:"3px solid "+a.c }}>
          <div style={{ flex:1 }}><span style={{ fontSize:11, color:C.dk, fontWeight:500 }}>{a.m}</span></div>
          <Badge v={a.c===C.err?"danger":a.c===C.warn?"warning":"info"} s="xs">{a.t}</Badge>
          <span style={{ fontSize:9, color:C.lG, minWidth:60, textAlign:"right" }}>{a.dl}</span>
        </div>)}
      </div>
    </Cd>

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
      {/* VALIDATIONS À TRAITER */}
      <Cd accent={C.warn}>
        <ST right={<span onClick={()=>onNav("validations")} style={{ fontSize:10, color:C.sec, cursor:"pointer", fontWeight:600 }}>Voir tout →</span>}>Validations à traiter</ST>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {vEnAttente.slice(0,4).map(v => <div key={v.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:5, background:v.crit?C.errL+"30":C.bgL, border:"1px solid "+(v.crit?C.err+"20":C.brd) }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:600, color:C.dk }}>{v.objet}</div>
              <div style={{ fontSize:9, color:C.g }}>{v.projet} · {v.auteur} · {v.date}</div>
            </div>
            <Badge v={v.risque==="Élevé"?"danger":v.risque==="Moyen"?"warning":"default"} s="xs">{v.risque}</Badge>
            <span style={{ fontSize:9, color:C.lG }}>{v.delai}</span>
          </div>)}
        </div>
      </Cd>

      {/* ÉCARTS CRITIQUES */}
      <Cd accent={C.err}>
        <ST right={<span onClick={()=>onNav("ecarts")} style={{ fontSize:10, color:C.sec, cursor:"pointer", fontWeight:600 }}>Voir tout →</span>}>Écarts critiques</ST>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {ECARTS.filter(e=>e.gravite==="Critique"&&e.statut!=="Levée").map(e => <div key={e.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:5, background:C.errL+"20", border:"1px solid "+C.err+"15" }}>
            <AlertOctagon size={12} color={C.err}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:600, color:C.dk }}>{e.constat.substring(0,65)}…</div>
              <div style={{ fontSize:9, color:C.g }}>{e.projet} · {e.lot} · {e.resp}</div>
            </div>
            <span style={{ fontSize:9, color:C.err, fontWeight:600 }}>Éch. {e.ech}</span>
          </div>)}
        </div>
      </Cd>
    </div>

    {/* PROJETS SOUS SURVEILLANCE */}
    <ST>Projets sous surveillance</ST>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10 }}>
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
          <span style={{ fontSize:10, fontWeight:700, color:C.sec }}>{p.av}% <span style={{color:C.lG,fontWeight:400}}>/ {p.avPlan}% planifié</span></span>
        </div>
        <Pr value={p.av} plan={p.avPlan}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4, marginTop:8 }}>
          {[
            { l:"Budget", v:fmt(p.budget) },
            { l:"Conformité", v:p.conformite+"%", c:p.conformite<70?C.err:p.conformite<85?C.warn:C.ok },
            { l:"Réserves", v:String(p.reservesOuv), c:p.reservesOuv>2?C.err:C.g },
            { l:"Validations", v:String(p.validAttente), c:p.validAttente>3?C.warn:C.g },
          ].map((k,i) => <div key={i} style={{ padding:"3px 5px", borderRadius:3, background:C.bgL, fontSize:9, textAlign:"center" }}>
            <div style={{ color:C.g }}>{k.l}</div>
            <div style={{ fontWeight:700, color:k.c||C.dk }}>{k.v}</div>
          </div>)}
        </div>
        <div style={{ marginTop:6, fontSize:9, color:C.g }}>Prochain jalon : <b style={{color:C.dk}}>{p.prochJalon}</b></div>
      </Cd>)}
    </div>

    {/* SYNTHÈSE AMOA DU JOUR */}
    <Cd style={{ background:C.sec+"06", border:"1px solid "+C.sec+"20" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
        <Brain size={14} color={C.sec}/>
        <span style={{ fontSize:13, fontWeight:700, color:C.dk }}>Synthèse AMOA du jour</span>
      </div>
      <div style={{ fontSize:11, color:C.dkG, lineHeight:1.7 }}>
        <b>Attention prioritaire :</b> PRJ-004 concentre 6 écarts ouverts dont 2 critiques (ferraillage + verticalité). Escalade au SPOC recommandée. 
        Le devis reprise présente un écart de +18% nécessitant requalification du poste ferraillage avant transmission au client.<br/>
        <b>PRJ-001 :</b> Avancement conforme. Pluie vendredi 18/04 (35mm) — coulage avancé à jeudi. Rapport RJ-16 à valider.<br/>
        <b>Publiable au client :</b> Rapport visite RV-12, rapport RJ-15, plan de masse v2, PV fondations.<br/>
        <b>Prudence :</b> Ne pas transmettre rapport RV-15 (PRJ-004) avant consolidation des corrections.
      </div>
    </Cd>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 2. MES PROJETS                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function PageProjets() {
  const [filtre, setFiltre] = useState("tous");
  const filtered = filtre==="tous"?PROJECTS:filtre==="critique"?PROJECTS.filter(p=>p.risque==="Élevé"||p.conformite<70):filtre==="validation"?PROJECTS.filter(p=>p.validAttente>0):PROJECTS;
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
      { label:"Conformité", render:r=><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:r.conformite>=85?C.okL:r.conformite>=70?C.warnL:C.errL,color:r.conformite>=85?C.okD:r.conformite>=70?C.warnD:C.errD,fontSize:10,fontWeight:800}}>{r.conformite}</div></div> },
      { label:"Réserves", render:r=><span style={{fontWeight:700,color:r.reservesOuv>2?C.err:r.reservesOuv>0?C.warn:C.ok}}>{r.reservesOuv}</span> },
      { label:"Écarts", render:r=><span style={{fontWeight:700,color:r.ecartsOuv>2?C.err:r.ecartsOuv>0?C.warn:C.ok}}>{r.ecartsOuv}</span> },
      { label:"Validations", render:r=><Badge v={r.validAttente>3?"danger":r.validAttente>0?"warning":"success"}>{r.validAttente} en att.</Badge> },
      { label:"Risque", render:r=><Badge v={r.risque==="Élevé"?"danger":r.risque==="Modéré"?"warning":"success"}>{r.risque}</Badge> },
      { label:"Contrôle", render:r=><TempBadge t={r.tempCtrl}/> },
      { label:"Prochain jalon", render:r=><span style={{fontSize:9,color:C.g}}>{r.prochJalon}</span> },
    ]} data={filtered.map(p=>({...p,_highlight:p.risque==="Élevé"}))}/>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 3. ÉTUDES & LIVRABLES                                                */
/* ══════════════════════════════════════════════════════════════════════ */
function PageEtudes() {
  const [tab, setTab] = useState("tous");
  const tabs = [
    { k:"tous", l:"Tous", count:ETUDES.length },
    { k:"revue", l:"En revue", count:ETUDES.filter(e=>e.statut==="En revue").length },
    { k:"corriger", l:"À corriger", count:ETUDES.filter(e=>e.statut==="À corriger").length },
    { k:"attendu", l:"Attendu", count:ETUDES.filter(e=>e.statut==="Attendu").length },
    { k:"valide", l:"Validés", count:ETUDES.filter(e=>e.statut==="Validé").length },
  ];
  const filtered = tab==="tous"?ETUDES:tab==="revue"?ETUDES.filter(e=>e.statut==="En revue"):tab==="corriger"?ETUDES.filter(e=>e.statut==="À corriger"):tab==="attendu"?ETUDES.filter(e=>e.statut==="Attendu"):ETUDES.filter(e=>e.statut==="Validé");

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Centre de contrôle</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Études & Livrables</h2>
      </div>
      <TabBar tabs={tabs} active={tab} onChange={setTab}/>
    </div>
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      <Kpi icon={FileText} label="Livrables total" value={String(ETUDES.length)} color={C.sec}/>
      <Kpi icon={Eye} label="En revue" value={String(ETUDES.filter(e=>e.statut==="En revue").length)} color={C.info}/>
      <Kpi icon={AlertTriangle} label="À corriger" value={String(ETUDES.filter(e=>e.statut==="À corriger").length)} color={C.err}/>
      <Kpi icon={CircleAlert} label="Attendus" value={String(ETUDES.filter(e=>e.statut==="Attendu").length)} color={C.warn}/>
    </div>
    <Tbl cols={[
      { label:"Réf.", render:r=><span style={{fontFamily:"monospace",fontSize:9,color:C.sec,fontWeight:600}}>{r.id}</span> },
      { label:"Livrable", render:r=><div><div style={{fontWeight:600}}>{r.type}</div><div style={{fontSize:9,color:C.g}}>{r.projet}</div></div> },
      { label:"Phase", render:r=><Badge v="purple" s="xs">{r.phase}</Badge> },
      { label:"Version", render:r=><span style={{fontFamily:"monospace",fontSize:10}}>{r.version}</span> },
      { label:"Auteur", render:r=><span style={{fontSize:10}}>{r.auteur}</span> },
      { label:"Date", key:"date" },
      { label:"Complétude", render:r=><div style={{display:"flex",alignItems:"center",gap:4,minWidth:60}}><Pr value={r.completude} h={4}/><span style={{fontSize:9,fontWeight:600}}>{r.completude}%</span></div> },
      { label:"Statut", render:r=><SB s={r.statut}/> },
      { label:"Observation AMOA", render:r=><span style={{fontSize:9,color:C.dkG,maxWidth:160,display:"inline-block"}}>{r.obsAMOA}</span> },
      { label:"Action", render:r=>r.action!=="—"?<Bt small v="ghost">{r.action}</Bt>:<span style={{fontSize:9,color:C.lG}}>—</span> },
    ]} data={filtered}/>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 4. VALIDATIONS                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function PageValidations() {
  const [tab, setTab] = useState("attente");
  const tabs = [
    { k:"attente", l:"En attente", count:VALIDATIONS.filter(v=>v.statut==="En attente").length },
    { k:"critiques", l:"Critiques", count:VALIDATIONS.filter(v=>v.crit).length },
    { k:"toutes", l:"Toutes", count:VALIDATIONS.length },
  ];
  const list = tab==="attente"?VALIDATIONS.filter(v=>v.statut==="En attente"):tab==="critiques"?VALIDATIONS.filter(v=>v.crit):VALIDATIONS;

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Centre de décision</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Validations</h2>
      </div>
      <TabBar tabs={tabs} active={tab} onChange={setTab}/>
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {list.map(v => <Cd key={v.id} accent={v.crit?C.err:v.risque==="Élevé"?C.warn:C.sec} style={v.crit?{background:C.errL+"15",border:"1px solid "+C.err+"18"}:{}}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontFamily:"monospace", fontSize:9, color:C.sec, fontWeight:600 }}>{v.id}</span>
            <Badge v="dark" s="xs">{v.type}</Badge>
            <Badge v="dark" s="xs">{v.projet}</Badge>
            {v.crit && <Badge v="danger" s="xs">⚠ Critique</Badge>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <SB s={v.statut}/>
            {v.pj && <Paperclip size={10} color={C.lG}/>}
            <span style={{ fontSize:9, color:C.lG }}>Éch. {v.delai}</span>
          </div>
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:C.dk, marginBottom:3 }}>{v.objet}</div>
        <div style={{ fontSize:10, color:C.g, marginBottom:2 }}>{v.auteur} · {v.date}</div>
        <div style={{ fontSize:10, color:C.dkG, lineHeight:1.5, padding:"6px 8px", background:C.bgL, borderRadius:5, marginBottom:8 }}>{v.synthese}</div>
        {v.statut==="En attente" && <div style={{ display:"flex", gap:6 }}>
          <Bt icon={CheckCircle2}>Valider</Bt>
          <Bt icon={XCircle} v="danger">Rejeter</Bt>
          <Bt icon={RotateCcw} v="ghost">Demander correction</Bt>
          <Bt icon={Flag} v="ghost">Poser réserve</Bt>
        </div>}
      </Cd>)}
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 5. ÉCARTS & RÉSERVES                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function PageEcarts() {
  const [tab, setTab] = useState("ouverts");
  const ouverts = ECARTS.filter(e=>e.statut==="Ouvert"||e.statut==="En traitement");
  const critiques = ECARTS.filter(e=>e.gravite==="Critique"&&e.statut!=="Levée");
  const leves = ECARTS.filter(e=>e.statut==="Levée");

  const list = tab==="ouverts"?ouverts:tab==="critiques"?critiques:tab==="leves"?leves:ECARTS;
  const tabs = [
    { k:"ouverts", l:"Ouverts", count:ouverts.length },
    { k:"critiques", l:"Critiques", count:critiques.length },
    { k:"leves", l:"Levées", count:leves.length },
    { k:"tous", l:"Tous", count:ECARTS.length },
  ];

  // Stats
  const parLot = {};
  ouverts.forEach(e => { const l = e.lot.split("—")[0].trim(); parLot[l] = (parLot[l]||0)+1; });

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Gouvernance projet</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Écarts & Réserves</h2>
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <TabBar tabs={tabs} active={tab} onChange={setTab}/>
        <Bt icon={Plus}>Nouveau constat</Bt>
      </div>
    </div>

    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      <Kpi icon={AlertTriangle} label="Écarts ouverts" value={String(ouverts.length)} color={C.err} accent/>
      <Kpi icon={AlertOctagon} label="Critiques" value={String(critiques.length)} color={C.err}/>
      <Kpi icon={CheckCircle2} label="Taux de résolution" value={Math.round(leves.length/ECARTS.length*100)+"%"} color={C.ok}/>
      <Kpi icon={Clock} label="Délai moyen levée" value="4.2j" color={C.warn}/>
    </div>

    {/* Résumé par lot */}
    {tab==="ouverts" && Object.keys(parLot).length>0 && <Cd>
      <ST>Répartition par lot</ST>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {Object.entries(parLot).map(([lot,count]) => <div key={lot} style={{ padding:"6px 12px", borderRadius:6, background:count>=3?C.errL:count>=2?C.warnL:C.bgL, border:"1px solid "+(count>=3?C.err+"20":count>=2?C.warn+"20":C.brd) }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.dk }}>{lot}</div>
          <div style={{ fontSize:16, fontWeight:800, color:count>=3?C.err:count>=2?C.warn:C.dk }}>{count}</div>
          <div style={{ fontSize:9, color:C.g }}>écarts ouverts</div>
        </div>)}
      </div>
    </Cd>}

    {/* Liste détaillée */}
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {list.map(e => <Cd key={e.id} accent={e.gravite==="Critique"?C.err:e.gravite==="Majeur"?C.warn:C.info} style={e.gravite==="Critique"&&e.statut!=="Levée"?{background:C.errL+"12"}:{}}>
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
          </div>
        </div>
        <div style={{ fontSize:10, fontWeight:600, color:C.g, marginBottom:2 }}>{e.lot} · Source : {e.source}</div>
        <div style={{ fontSize:11, fontWeight:600, color:C.dk, marginBottom:4 }}>{e.constat}</div>
        <div style={{ display:"flex", gap:12, fontSize:10, color:C.dkG, marginBottom:6 }}>
          <span><b>Impact :</b> {e.impact}</span>
          <span><b>Resp. :</b> {e.resp}</span>
          <span><b>Ouvert :</b> {e.dateOuv}</span>
          <span><b>Échéance :</b> {e.ech}</span>
          <span><b>Preuve :</b> {e.preuve}</span>
        </div>
        {e.statut!=="Levée" && <div style={{ display:"flex", gap:6 }}>
          <Bt icon={CheckCircle2} small>Lever</Bt>
          <Bt icon={Send} small v="ghost">Relancer</Bt>
          <Bt icon={Flag} small v="ghost">Escalader</Bt>
        </div>}
      </Cd>)}
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 6. RAPPORTS                                                          */
/* ══════════════════════════════════════════════════════════════════════ */
function PageRapports() {
  const [tab, setTab] = useState("avalider");
  const tabs = [
    { k:"avalider", l:"À valider", count:RAPPORTS.filter(r=>r.statut==="À valider").length },
    { k:"acorriger", l:"À corriger", count:RAPPORTS.filter(r=>r.statut==="À corriger").length },
    { k:"valides", l:"Validés", count:RAPPORTS.filter(r=>r.statut==="Validé").length },
    { k:"tous", l:"Tous", count:RAPPORTS.length },
  ];
  const list = tab==="avalider"?RAPPORTS.filter(r=>r.statut==="À valider"):tab==="acorriger"?RAPPORTS.filter(r=>r.statut==="À corriger"):tab==="valides"?RAPPORTS.filter(r=>r.statut==="Validé"):RAPPORTS;

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Contrôle & publication</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Rapports</h2>
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <TabBar tabs={tabs} active={tab} onChange={setTab}/>
        <Bt icon={Plus}>Rapport visite</Bt>
      </div>
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {list.map(r => <Cd key={r.id} accent={r.sensible?C.err:r.statut==="À valider"?C.warn:r.statut==="Validé"?C.ok:C.info}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"monospace", fontSize:9, color:C.sec, fontWeight:600 }}>{r.id}</span>
            <Badge v={r.type.includes("Visite")?"active":"default"} s="xs">{r.type}</Badge>
            <Badge v="dark" s="xs">{r.projet}</Badge>
            {r.sensible && <Badge v="danger" s="xs">Sensible</Badge>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <SB s={r.statut}/>
            {r.transmissible && <Badge v="success" s="xs">Publiable client</Badge>}
          </div>
        </div>
        <div style={{ display:"flex", gap:12, fontSize:10, marginBottom:4 }}>
          <span style={{ color:C.g }}>📅 {r.date}</span>
          <span style={{ color:C.g }}>👤 {r.auteur} ({r.role})</span>
          <span style={{ color:C.g }}>☁️ {r.meteo}</span>
          <span style={{ color:C.g }}>🏗️ {r.lot}</span>
          {r.ecarts>0 && <span style={{ color:C.err, fontWeight:600 }}>⚠ {r.ecarts} écart(s)</span>}
        </div>
        <div style={{ fontSize:11, color:C.dk, padding:"6px 8px", background:C.bgL, borderRadius:5, marginBottom:6 }}>{r.resume}</div>
        {r.statut==="À valider" && <div style={{ display:"flex", gap:6 }}>
          <Bt icon={CheckCircle2} small>Valider</Bt>
          <Bt icon={RotateCcw} small v="ghost">Renvoyer avec commentaire</Bt>
          <Bt icon={Send} small v="ghost">Valider & publier client</Bt>
        </div>}
        {r.statut==="À corriger" && <div style={{ display:"flex", gap:6 }}>
          <Bt icon={RotateCcw} small v="ghost">Relancer correction</Bt>
        </div>}
      </Cd>)}
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 7. GED                                                               */
/* ══════════════════════════════════════════════════════════════════════ */
function PageGED() {
  const [tab, setTab] = useState("tous");
  const tabs = [
    { k:"tous", l:"Tous", count:DOCS.length },
    { k:"avalider", l:"À valider", count:DOCS.filter(d=>d.statut==="À valider"||d.statut==="En revue").length },
    { k:"manquants", l:"Manquants", count:DOCS.filter(d=>d.statut==="Manquant").length },
    { k:"preuves", l:"Preuves", count:DOCS.filter(d=>d.cat==="Preuves").length },
  ];
  const list = tab==="tous"?DOCS:tab==="avalider"?DOCS.filter(d=>d.statut==="À valider"||d.statut==="En revue"):tab==="manquants"?DOCS.filter(d=>d.statut==="Manquant"):DOCS.filter(d=>d.cat==="Preuves");

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Contrôle documentaire</div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>GED</h2>
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <TabBar tabs={tabs} active={tab} onChange={setTab}/>
        <Bt icon={Upload}>Téléverser</Bt>
      </div>
    </div>
    <Tbl cols={[
      { label:"Réf.", render:r=><span style={{fontFamily:"monospace",fontSize:9,color:C.sec}}>{r.id}</span> },
      { label:"Document", render:r=><div><div style={{fontWeight:600,fontSize:11}}>{r.nom}</div></div> },
      { label:"Catégorie", render:r=><Badge v="dark" s="xs">{r.cat}</Badge> },
      { label:"Projet", key:"projet" },
      { label:"Ver.", key:"version" },
      { label:"Date", key:"date" },
      { label:"Auteur", key:"auteur" },
      { label:"Statut", render:r=><SB s={r.statut}/> },
      { label:"Client", render:r=>r.client?<Badge v="success" s="xs">Visible</Badge>:<Badge v="dark" s="xs">Interne</Badge> },
      { label:"Lié à", render:r=>r.lien!=="—"?<span style={{fontFamily:"monospace",fontSize:9,color:C.info}}>{r.lien}</span>:<span style={{color:C.lG}}>—</span> },
    ]} data={list.map(d=>({...d,_highlight:d.statut==="Manquant"}))}/>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 8. VIDÉOSURVEILLANCE                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function PageVideo() {
  const [selCam, setSelCam] = useState(0);
  const cam = CAMS[selCam];
  const on = cam.s==="En ligne";

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div>
      <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Contrôle visuel</div>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Vidéosurveillance</h2>
      <div style={{ fontSize:10, color:C.g }}>Objectiver · Corroborer · Lever le doute</div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:12 }}>
      <div>
        <Cd>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <div><span style={{ fontWeight:700, fontSize:12, color:C.dk }}>{cam.nom}</span> <Badge v="dark" s="xs">{cam.projet}</Badge> <Badge v="dark" s="xs">{cam.zone}</Badge></div>
            <SB s={cam.s}/>
          </div>
          <div style={{ width:"100%", aspectRatio:"16/9", borderRadius:8, background:on?"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)":"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", color:"#fff" }}>
            {on ? <>
              <div style={{ position:"absolute", top:8, left:10, display:"flex", alignItems:"center", gap:4 }}><div style={{ width:6, height:6, borderRadius:"50%", background:C.err, animation:"blink 1.5s infinite" }}/><span style={{ fontSize:9, fontWeight:700 }}>LIVE</span></div>
              <Camera size={40} strokeWidth={1} color="rgba(255,255,255,0.12)"/>
              <div style={{ position:"absolute", bottom:8, left:10, fontSize:9, color:"rgba(255,255,255,0.4)" }}>{cam.id} · {cam.zone}</div>
              <div style={{ position:"absolute", bottom:8, right:10, fontSize:9, color:"rgba(255,255,255,0.4)" }}>16/04/2026 09:47:32</div>
            </> : <div style={{ textAlign:"center" }}><X size={32} color={C.err}/><div style={{ fontSize:10, color:C.lG, marginTop:6 }}>Flux indisponible</div></div>}
          </div>
          {cam.lienEc!=="—" && <div style={{ marginTop:8, padding:"6px 10px", borderRadius:5, background:C.warnL, border:"1px solid "+C.warn+"20", fontSize:10 }}>
            <b>Lié à écart :</b> <span style={{ fontFamily:"monospace", color:C.info }}>{cam.lienEc}</span> — Observation AMOA rattachée à cette vue.
          </div>}
        </Cd>
        <div style={{ marginTop:8, display:"flex", gap:6 }}>
          <Bt icon={Camera} v="ghost" small>Capturer</Bt>
          <Bt icon={Flag} v="ghost" small>Rattacher à un écart</Bt>
          <Bt icon={FileText} v="ghost" small>Créer observation AMOA</Bt>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.dk }}>Caméras ({CAMS.length})</span>
        {CAMS.map((c,i) => <div key={i} onClick={()=>setSelCam(i)} style={{ padding:"8px 10px", borderRadius:7, border:"1px solid "+(i===selCam?C.sec:C.brd), background:i===selCam?C.secL+"40":C.w, cursor:"pointer", transition:"all 0.15s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:10, fontWeight:600, color:C.dk }}>{c.nom}</span>
            <div style={{ width:7, height:7, borderRadius:"50%", background:c.s==="En ligne"?C.ok:C.err }}/>
          </div>
          <div style={{ fontSize:8, color:C.lG, marginTop:2 }}>{c.projet} · {c.zone}</div>
          <div style={{ fontSize:8, color:C.g, marginTop:1 }}>{c.evt}</div>
          {c.lienEc!=="—" && <div style={{ fontSize:8, color:C.warn, marginTop:1 }}>⚠ Lié : {c.lienEc}</div>}
        </div>)}
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 9. MESSAGERIE                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
function PageMsg() {
  const [sel, setSel] = useState(0);
  const conv = MESSAGES[sel];
  const roleColors = { SPOC:C.pri, MOE:C.purp, MOEX:C.warn, AMOA:C.sec, Client:C.info };

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div>
      <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Coordination & observation</div>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>Messagerie</h2>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:0, border:"1px solid "+C.brd, borderRadius:10, overflow:"hidden", minHeight:420 }}>
      <div style={{ borderRight:"1px solid "+C.brd, overflowY:"auto", background:C.w }}>
        {MESSAGES.map((m,i) => <div key={i} onClick={()=>setSel(i)} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"10px 12px", borderBottom:"1px solid "+C.brd, cursor:"pointer", background:i===sel?C.sec+"08":"transparent" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:(roleColors[m.role]||C.g)+"14", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:roleColors[m.role]||C.g, flexShrink:0 }}>{m.from[0]}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, fontWeight:600, color:C.dk }}>{m.from}</span>
              <Badge v="dark" s="xs">{m.role}</Badge>
            </div>
            <div style={{ fontSize:9, fontWeight:600, color:C.dkG, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.sujet}</div>
            <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
              <Badge v="dark" s="xs">{m.projet}</Badge>
              {m.prio==="Haute" && <Badge v="danger" s="xs">Haute</Badge>}
              {m.attente && <Badge v="warning" s="xs">Réponse att.</Badge>}
            </div>
          </div>
        </div>)}
      </div>
      <div style={{ display:"flex", flexDirection:"column", background:C.bgL }}>
        <div style={{ padding:"10px 14px", borderBottom:"1px solid "+C.brd, background:C.w }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <div>
              <span style={{ fontWeight:700, fontSize:12, color:C.dk }}>{conv.sujet}</span>
              <div style={{ fontSize:9, color:C.g, marginTop:1 }}>{conv.from} · {conv.role} · {conv.projet} {conv.lien!=="—" && <span>· Lié : <span style={{fontFamily:"monospace",color:C.info}}>{conv.lien}</span></span>}</div>
            </div>
            {conv.attente && <Badge v="warning">Réponse attendue</Badge>}
          </div>
        </div>
        <div style={{ flex:1, padding:12, display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:6, overflowY:"auto" }}>
          {conv.msgs.map((m,i) => {
            const isMine = m.role==="AMOA";
            return <div key={i} style={{ alignSelf:isMine?"flex-end":"flex-start", maxWidth:"75%" }}>
              <div style={{ fontSize:8, color:C.lG, marginBottom:2, textAlign:isMine?"right":"left" }}>{m.auteur} · {m.time}</div>
              <div style={{ background:isMine?C.sec:C.w, padding:"8px 11px", borderRadius:isMine?"10px 3px 10px 10px":"3px 10px 10px 10px", fontSize:11, color:isMine?"#fff":C.dk, border:isMine?"none":"1px solid "+C.brd, lineHeight:1.5 }}>{m.txt}</div>
            </div>;
          })}
        </div>
        <div style={{ padding:"8px 12px", borderTop:"1px solid "+C.brd, background:C.w, display:"flex", gap:6 }}>
          <input placeholder="Message..." style={{ flex:1, padding:"6px 10px", borderRadius:6, border:"1px solid "+C.brd, fontSize:10, outline:"none" }}/>
          <Bt icon={Send}>Envoyer</Bt>
        </div>
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 10. KPI & ANALYTICS                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
function PageKPI() {
  const kpis = [
    { icon:CheckCircle2, label:"Validations dans les délais", value:"78%", color:C.ok, trend:5 },
    { icon:AlertTriangle, label:"Écarts ouverts / fermés", value:"6 / 2", color:C.err },
    { icon:Clock, label:"Délai moyen de levée", value:"4.2j", color:C.warn, trend:-8 },
    { icon:Shield, label:"Conformité moyenne", value:"81%", color:C.sec },
    { icon:FileCheck, label:"Rapports traités / mois", value:"24", color:C.info, trend:12 },
    { icon:BarChart3, label:"Ratio validés / corrigés", value:"3.5:1", color:C.ok },
  ];

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div>
      <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Performance AMOA</div>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>KPI & Analytics</h2>
    </div>
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      {kpis.map((k,i) => <Kpi key={i} {...k} accent/>)}
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
      <Cd>
        <ST>Conformité par projet</ST>
        {PROJECTS.map(p => <div key={p.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid "+C.brd }}>
          <span style={{ fontSize:10, fontWeight:600, color:C.dk, minWidth:100 }}>{p.nom}</span>
          <div style={{ flex:1 }}><Pr value={p.conformite} h={6}/></div>
          <span style={{ fontSize:10, fontWeight:700, color:p.conformite>=85?C.ok:p.conformite>=70?C.warn:C.err, minWidth:30, textAlign:"right" }}>{p.conformite}%</span>
        </div>)}
      </Cd>
      <Cd>
        <ST>Lots les plus sensibles</ST>
        {[
          { lot:"LOT II — Gros Œuvre", ecarts:4, res:2, score:85 },
          { lot:"LOT III — Clos Couvert", ecarts:1, res:1, score:45 },
          { lot:"LOT I — Travaux Prép.", ecarts:1, res:0, score:30 },
          { lot:"LOT IV — Second Œuvre", ecarts:1, res:0, score:15 },
        ].map((l,i) => <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid "+C.brd }}>
          <span style={{ fontSize:10, fontWeight:600, color:C.dk, flex:1 }}>{l.lot}</span>
          <Badge v={l.ecarts>=3?"danger":l.ecarts>=1?"warning":"success"} s="xs">{l.ecarts} éc.</Badge>
          <Badge v={l.res>=2?"danger":l.res>=1?"warning":"success"} s="xs">{l.res} rés.</Badge>
          <div style={{ width:40 }}><Pr value={l.score} h={3}/></div>
        </div>)}
      </Cd>
    </div>

    <Cd>
      <ST>Partenaires — Indice de fiabilité</ST>
      <div style={{ display:"flex", gap:8 }}>
        {[
          { nom:"BTP Cameroun", fiab:72, ecarts:3, delai:"3.8j" },
          { nom:"Arc. Njoya", fiab:91, ecarts:0, delai:"—" },
          { nom:"Bati-Plus", fiab:42, ecarts:6, delai:"5.1j" },
          { nom:"BET Structure", fiab:78, ecarts:1, delai:"4.0j" },
        ].map((p,i) => <div key={i} style={{ flex:1, padding:10, borderRadius:8, background:p.fiab>=80?C.okL+"40":p.fiab>=60?C.warnL+"40":C.errL+"40", border:"1px solid "+(p.fiab>=80?C.ok+"20":p.fiab>=60?C.warn+"20":C.err+"20"), textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dk }}>{p.nom}</div>
          <div style={{ fontSize:22, fontWeight:800, color:p.fiab>=80?C.ok:p.fiab>=60?C.warn:C.err, margin:"4px 0" }}>{p.fiab}</div>
          <div style={{ fontSize:9, color:C.g }}>{p.ecarts} écarts · Délai moy. {p.delai}</div>
        </div>)}
      </div>
    </Cd>

    <Cd>
      <ST>Multi-projets : comparaison</ST>
      <Tbl compact cols={[
        { label:"Projet", render:r=><span style={{fontWeight:600}}>{r.nom}</span> },
        { label:"Conform.", render:r=><span style={{fontWeight:700,color:r.conformite>=85?C.ok:r.conformite>=70?C.warn:C.err}}>{r.conformite}%</span> },
        { label:"Écarts", render:r=><span style={{fontWeight:700}}>{r.ecartsOuv}</span> },
        { label:"Réserves", render:r=><span style={{fontWeight:700}}>{r.reservesOuv}</span> },
        { label:"Valid. att.", render:r=><span>{r.validAttente}</span> },
        { label:"Risque", render:r=><Badge v={r.risque==="Élevé"?"danger":r.risque==="Modéré"?"warning":"success"} s="xs">{r.risque}</Badge> },
        { label:"Maîtrise", render:r=><TempBadge t={r.tempCtrl}/> },
      ]} data={PROJECTS}/>
    </Cd>
  </div>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/* 11. IA KOMA — AMOA                                                   */
/* ══════════════════════════════════════════════════════════════════════ */
function PageIA() {
  const insights = [
    { type:"critical", txt:"3 validations critiques en attente sur PRJ-004. Ferraillage et verticalité à traiter en priorité. Risque d'immobilisation chantier si non résolu sous 48h." },
    { type:"pattern", txt:"Écart récurrent détecté sur lot Gros Œuvre (PRJ-004) : ferraillage, alignement, verticalité. Recommandation : audit structurel complet du prestataire Bati-Plus." },
    { type:"warning", txt:"Risque de dérive documentaire sur PRJ-001 : note de calcul structure (LIV-003) incomplète depuis 3 jours. Pas de note sismique. Demander complément au BET." },
    { type:"corroboration", txt:"Les constats vidéo (CAM-006) et le rapport de visite RV-15 du 15/04 sur PRJ-004 semblent cohérents : activité réduite confirmée. Mais le rapport journalier RJ-14 mentionne un 'arrêt pluie' alors que la météo indiquait 'nuageux' — incohérence à vérifier." },
    { type:"positive", txt:"PRJ-006 (Étude Kribi) : avancement à 60%, supérieur au planifié (55%). Rapport de faisabilité validé. Prochaine étape : commande G2 AVP." },
  ];
  const typeConf = { critical:{c:C.err,l:"Alerte critique",i:AlertOctagon}, pattern:{c:C.warn,l:"Pattern détecté",i:GitBranch}, warning:{c:C.warn,l:"Attention",i:AlertTriangle}, corroboration:{c:C.info,l:"Corroboration",i:ScanEye}, positive:{c:C.ok,l:"Point positif",i:CheckCircle2} };

  return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div>
      <div style={{ fontSize:10, color:C.sec, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Assistant de contrôle</div>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.dk, margin:"2px 0 0" }}>IA KOMA — AMOA</h2>
    </div>

    {/* Synthèse IA */}
    <Cd style={{ background:"linear-gradient(135deg, "+C.sec+"08, "+C.pri+"06)", border:"1px solid "+C.sec+"20" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <Brain size={16} color={C.sec}/>
        <span style={{ fontSize:13, fontWeight:700, color:C.dk }}>Synthèse IA du jour — 16 avril 2026</span>
      </div>
      <div style={{ fontSize:11, color:C.dkG, lineHeight:1.7 }}>
        <b>4 projets suivis · 6 validations en attente · 6 écarts ouverts dont 2 critiques.</b><br/>
        Priorité absolue : PRJ-004 (Reprise Bali) concentre 80% des risques actifs. Conformité à 58%, très en-dessous du seuil (85%). 
        PRJ-001 est stable mais nécessite validation du rapport RJ-16 et suivi de la note de calcul incomplète.
        PRJ-002 et PRJ-006 sont sous contrôle, sans alerte.
      </div>
    </Cd>

    {/* Insights */}
    <ST>Insights & détections</ST>
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {insights.map((ins,i) => {
        const cfg = typeConf[ins.type];
        return <Cd key={i} accent={cfg.c} style={{ background:cfg.c+"06" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <cfg.i size={12} color={cfg.c}/>
            <Badge v={ins.type==="critical"?"danger":ins.type==="positive"?"success":"warning"} s="xs">{cfg.l}</Badge>
          </div>
          <div style={{ fontSize:11, color:C.dkG, lineHeight:1.6 }}>{ins.txt}</div>
        </Cd>;
      })}
    </div>

    {/* Modules IA */}
    <ST>Modules IA disponibles</ST>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
      {[
        { t:"Synthèse auto du jour", d:"Résumé consolidé de tous les projets", i:FileText },
        { t:"Détection écarts récurrents", d:"Patterns par lot, partenaire, type", i:GitBranch },
        { t:"Résumé de rapports", d:"Extraction des points clés et anomalies", i:BookOpen },
        { t:"Aide rédaction réserve", d:"Formulation structurée d'un constat", i:ClipboardCheck },
        { t:"Pré-analyse conformité", d:"Check automatique vs référentiel WeCare", i:Shield },
        { t:"Détection contradictions", d:"Croisement rapports, vidéo, planning", i:ScanEye },
        { t:"Préparation visite AMOA", d:"Checklist et points de vigilance", i:Eye },
        { t:"Synthèse avant comité", d:"Brief structuré pour réunion projet", i:Target },
        { t:"Priorisation validations", d:"Tri intelligent par urgence et risque", i:Gauge },
      ].map((c,i) => <Cd key={i} style={{ cursor:"pointer" }}>
        <div style={{ width:28, height:28, borderRadius:7, background:C.sec+"14", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:6 }}><c.i size={13} color={C.sec}/></div>
        <div style={{ fontSize:11, fontWeight:700, color:C.dk }}>{c.t}</div>
        <div style={{ fontSize:10, color:C.g, marginTop:2 }}>{c.d}</div>
      </Cd>)}
    </div>
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
  { k:"ged", l:"GED", i:FolderOpen },
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
        return <button key={it.k} onClick={()=>onNav(it.k)} style={{ display:"flex", alignItems:"center", gap:8, padding:collapsed?"8px":"7px 10px", borderRadius:6, border:"none", cursor:"pointer", background:isAct?C.sec+"18":"transparent", color:isAct?C.sec:"rgba(255,255,255,0.45)", fontSize:11, fontWeight:isAct?600:400, textAlign:"left", width:"100%", position:"relative" }}>
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
  return <div style={{ height:48, padding:"0 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid "+C.brd, background:C.w, flexShrink:0 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", color:C.g, display:"flex" }}><Menu size={16}/></button>
      <div style={{ display:"flex", alignItems:"center", gap:4, background:C.bgL, borderRadius:6, padding:"4px 10px", border:"1px solid "+C.brd, width:260 }}>
        <Search size={12} color={C.lG}/><input placeholder="Rechercher projet, écart, livrable..." style={{ border:"none", background:"transparent", outline:"none", fontSize:11, color:C.dkG, width:"100%" }}/>
      </div>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ fontSize:10, color:C.g }}>Mer. 16 Avril 2026</div>
      <div style={{ position:"relative" }}><Bell size={15} color={C.g} style={{ cursor:"pointer" }}/><div style={{ position:"absolute", top:-3, right:-3, width:14, height:14, borderRadius:"50%", background:C.err, color:"#fff", fontSize:7, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>6</div></div>
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
      case "ged": return <PageGED/>;
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
