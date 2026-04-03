/**
 * rvu-data.js — SIR 2026 CPT / CMS wRVU Reference Data
 *
 * CPT codes sourced from: SIR/ACR 2026 Interventional Radiology Coding Update
 * wRVU values sourced from: CMS 2025 Physician Fee Schedule (work RVU component only)
 *
 * DISCLAIMER: RVU estimates are based on CMS Physician Fee Schedule reference data
 * and may not reflect payer-specific reimbursement, local policy, modifiers,
 * bundled services, or employer compensation formulas.
 */

// ── CMS wRVU table (CPT → { desc, wrvu }) ─────────────────────────────────
const CPT_WRVU = {
  // DRAINAGE
  '49083': { desc: 'Paracentesis w/ imaging',                    wrvu: 1.84 },
  '49082': { desc: 'Paracentesis w/o imaging',                   wrvu: 1.11 },
  '32555': { desc: 'Thoracentesis w/ imaging',                   wrvu: 2.04 },
  '32554': { desc: 'Thoracentesis w/o imaging',                  wrvu: 1.47 },
  '32557': { desc: 'Pleural drain/tube w/ imaging',              wrvu: 3.25 },
  '32556': { desc: 'Pleural drain/tube w/o imaging',             wrvu: 2.66 },
  '32550': { desc: 'Tunneled pleural catheter insertion',        wrvu: 3.44 },
  '10030': { desc: 'Drainage catheter, soft tissue',             wrvu: 2.85 },
  '49405': { desc: 'Drainage catheter, visceral',                wrvu: 5.08 },
  '49406': { desc: 'Drainage catheter, peritoneal/retroperitoneal', wrvu: 5.08 },
  '49407': { desc: 'Drainage catheter, TV/transrectal',          wrvu: 5.08 },
  '49423': { desc: 'Drain exchange over guidewire',              wrvu: 2.02 },
  '47490': { desc: 'Percutaneous cholecystostomy',               wrvu: 9.78 },
  // BILIARY
  '47533': { desc: 'Biliary drainage, external',                 wrvu: 9.67 },
  '47534': { desc: 'Biliary drainage, internal-external',        wrvu: 10.25 },
  '47535': { desc: 'Convert ext to int-ext biliary drain',       wrvu: 5.26 },
  '47536': { desc: 'Exchange biliary drain',                     wrvu: 5.26 },
  '47537': { desc: 'Removal biliary drain',                      wrvu: 2.45 },
  '47538': { desc: 'Biliary stent, existing access',             wrvu: 7.65 },
  '47539': { desc: 'Biliary stent, new, w/o drainage',           wrvu: 9.22 },
  '47540': { desc: 'Biliary stent, new, w/ drainage',            wrvu: 10.82 },
  '47531': { desc: 'Cholangiogram injection, existing access',   wrvu: 1.57 },
  '47532': { desc: 'Cholangiogram injection, new access',        wrvu: 4.83 },
  // GI / GU TUBES
  '49440': { desc: 'G-tube placement, percutaneous',             wrvu: 2.62 },
  '49441': { desc: 'J-tube placement, percutaneous',             wrvu: 3.15 },
  '49446': { desc: 'G-tube to GJ-tube conversion',               wrvu: 3.15 },
  '49450': { desc: 'G-tube replacement (with fluoro)',           wrvu: 1.34 },
  '49451': { desc: 'J-tube replacement, dislodged',              wrvu: 2.15 },
  '49452': { desc: 'GJ-tube replacement, percutaneous',          wrvu: 2.15 },
  // NEPHROSTOMY / URINARY
  '50432': { desc: 'Nephrostomy catheter placement',             wrvu: 5.13 },
  '50433': { desc: 'Nephro-ureteral catheter placement',         wrvu: 6.26 },
  '50434': { desc: 'Convert nephrostomy catheter',               wrvu: 5.13 },
  '50435': { desc: 'Exchange nephrostomy catheter',              wrvu: 3.95 },
  '50436': { desc: 'Dilation existing nephr. tract',             wrvu: 3.95 },
  '50693': { desc: 'Ureteral stent, existing nephrostomy',       wrvu: 5.92 },
  '50694': { desc: 'Ureteral stent, new access w/o nephrostomy', wrvu: 6.86 },
  '50695': { desc: 'Ureteral stent, new access w/ nephrostomy',  wrvu: 7.65 },
  '50389': { desc: 'Nephrostomy tube removal w/ fluoro',         wrvu: 1.57 },
  // BIOPSY
  '49180': { desc: 'Abdominal/retroperitoneal biopsy',           wrvu: 3.22 },
  '47000': { desc: 'Liver biopsy, percutaneous',                 wrvu: 2.58 },
  '50200': { desc: 'Renal biopsy, percutaneous',                 wrvu: 3.67 },
  '32408': { desc: 'Lung biopsy, percutaneous',                  wrvu: 5.57 },
  '48102': { desc: 'Pancreas biopsy, percutaneous',              wrvu: 3.22 },
  '10005': { desc: 'FNA biopsy w/ ultrasound',                   wrvu: 2.22 },
  '10009': { desc: 'FNA biopsy w/ CT',                           wrvu: 2.22 },
  '19083': { desc: 'Breast biopsy, ultrasound-guided',           wrvu: 3.26 },
  '19085': { desc: 'Breast biopsy, MRI-guided',                  wrvu: 3.91 },
  '19081': { desc: 'Breast biopsy, stereotactic',                wrvu: 3.26 },
  // ABLATION
  '47382': { desc: 'Liver RFA, percutaneous',                    wrvu: 11.52 },
  '47383': { desc: 'Liver cryoablation, percutaneous',           wrvu: 11.52 },
  '47380': { desc: 'Liver RFA, open',                            wrvu: 11.52 },
  '47384': { desc: 'Liver IRE, percutaneous',                    wrvu: 11.52 },
  '0944T': { desc: 'Liver microwave ablation',                   wrvu: 11.52 },
  '32998': { desc: 'Lung RFA, percutaneous',                     wrvu: 12.06 },
  '32994': { desc: 'Lung cryoablation, percutaneous',            wrvu: 12.06 },
  '50592': { desc: 'Renal RFA, percutaneous',                    wrvu: 10.50 },
  '50593': { desc: 'Renal cryoablation, percutaneous',           wrvu: 10.50 },
  '20982': { desc: 'Bone tumor RFA, percutaneous',               wrvu:  5.91 },
  '20983': { desc: 'Bone tumor cryoablation, percutaneous',      wrvu:  5.91 },
  '60660': { desc: 'Thyroid RFA, 1 lobe',                        wrvu:  7.50 },
  // VERTEBROPLASTY / KYPHOPLASTY
  '22510': { desc: 'Vertebroplasty, cervicothoracic',            wrvu:  5.04 },
  '22511': { desc: 'Vertebroplasty, lumbosacral',                wrvu:  5.04 },
  '22513': { desc: 'Kyphoplasty, thoracic',                      wrvu: 13.79 },
  '22514': { desc: 'Kyphoplasty, lumbar',                        wrvu: 13.60 },
  // VASCULAR ACCESS
  '36556': { desc: 'Non-tunneled CVC (≥5 yr)',                   wrvu:  2.00 },
  '36555': { desc: 'Non-tunneled CVC (<5 yr)',                   wrvu:  2.00 },
  '36558': { desc: 'Tunneled CVC w/o port (≥5 yr)',              wrvu:  2.71 },
  '36557': { desc: 'Tunneled CVC w/o port (<5 yr)',              wrvu:  2.71 },
  '36561': { desc: 'Tunneled CVC w/ port (≥5 yr)',               wrvu:  4.22 },
  '36560': { desc: 'Tunneled CVC w/ port (<5 yr)',               wrvu:  4.22 },
  '36565': { desc: 'Tunneled CVC, 2 catheters (Tesio/TDC)',      wrvu:  4.22 },
  '36573': { desc: 'PICC w/ imaging (≥5 yr)',                    wrvu:  1.53 },
  '36572': { desc: 'PICC w/ imaging (<5 yr)',                    wrvu:  1.53 },
  '36589': { desc: 'Removal tunneled CVC w/o port',             wrvu:  1.60 },
  '36590': { desc: 'Removal tunneled CVC w/ port',              wrvu:  3.38 },
  '36584': { desc: 'PICC replacement w/ imaging',                wrvu:  1.53 },
  '36580': { desc: 'CVC replacement, non-tunneled',              wrvu:  2.00 },
  '36581': { desc: 'CVC replacement, tunneled w/o port',        wrvu:  2.71 },
  '36582': { desc: 'CVC replacement, tunneled w/ port',         wrvu:  4.22 },
  // DIALYSIS ACCESS
  '36901': { desc: 'Dialysis circuit catheterization',           wrvu:  5.50 },
  '36902': { desc: 'Dialysis circuit + angioplasty',             wrvu:  7.20 },
  '36903': { desc: 'Dialysis circuit + angioplasty + stent',     wrvu:  8.50 },
  '36904': { desc: 'Dialysis thrombectomy/thrombolysis',         wrvu:  7.20 },
  '36905': { desc: 'Dialysis thrombectomy + angioplasty',        wrvu:  8.50 },
  '36906': { desc: 'Dialysis thrombectomy + angioplasty + stent',wrvu:  9.80 },
  '36836': { desc: 'Percutaneous endo AVF creation, single access', wrvu: 9.50 },
  '36837': { desc: 'Percutaneous endo AVF creation, dual access',   wrvu: 9.50 },
  // IVC FILTER
  '37191': { desc: 'IVC filter insertion',                       wrvu:  5.28 },
  '37192': { desc: 'IVC filter repositioning',                   wrvu:  4.50 },
  '37193': { desc: 'IVC filter retrieval',                       wrvu:  6.72 },
  // EMBOLIZATION
  '37241': { desc: 'Venous embolization, non-hemorrhage',        wrvu: 10.08 },
  '37242': { desc: 'Arterial embolization, non-hemorrhage',      wrvu: 10.08 },
  '37243': { desc: 'Tumor/organ ischemia embolization',          wrvu: 10.08 },
  '37244': { desc: 'Hemorrhage/lymphatic embolization',          wrvu: 11.39 },
  '79445': { desc: 'Y-90 radioembolization',                     wrvu:  7.31 },
  // TIPS
  '37182': { desc: 'TIPS creation',                              wrvu: 22.22 },
  '37183': { desc: 'TIPS revision',                              wrvu: 14.92 },
  // ANGIOPLASTY / STENT (non-lower extremity)
  '37246': { desc: 'PTA, initial artery (non-lower extremity)',  wrvu:  7.16 },
  '37247': { desc: 'PTA, each additional artery',                wrvu:  3.26 },
  '37248': { desc: 'PTA, initial vein',                          wrvu:  7.02 },
  '37249': { desc: 'PTA, additional vein',                       wrvu:  3.26 },
  '37236': { desc: 'Stent, initial artery',                      wrvu:  8.79 },
  '37238': { desc: 'Stent, initial vein',                        wrvu:  8.37 },
  // LOWER EXTREMITY ENDOVASCULAR (representative)
  '37254': { desc: 'Iliac angioplasty, straightforward',         wrvu:  7.16 },
  '37256': { desc: 'Iliac angioplasty, complex',                 wrvu:  8.50 },
  '37258': { desc: 'Iliac stent + angioplasty, straightforward', wrvu:  9.22 },
  '37260': { desc: 'Iliac stent + angioplasty, complex',         wrvu: 10.08 },
  '37263': { desc: 'Fem/pop angioplasty, straightforward',       wrvu:  7.16 },
  '37265': { desc: 'Fem/pop angioplasty, complex',               wrvu:  8.50 },
  '37267': { desc: 'Fem/pop stent + angioplasty, straightforward',wrvu:  9.22 },
  '37269': { desc: 'Fem/pop stent + angioplasty, complex',       wrvu: 10.08 },
  // THROMBOLYSIS / THROMBECTOMY
  '37211': { desc: 'Arterial thrombolytic infusion',             wrvu:  5.60 },
  '37212': { desc: 'Venous thrombolytic infusion',               wrvu:  5.60 },
  '37184': { desc: 'Primary arterial mechanical thrombectomy',   wrvu:  7.20 },
  '37187': { desc: 'Venous mechanical thrombectomy, day 1',      wrvu:  7.20 },
  // SPINE / PAIN
  '62270': { desc: 'Lumbar puncture, diagnostic',                wrvu:  1.82 },
  '62272': { desc: 'Lumbar puncture, therapeutic',               wrvu:  1.97 },
  '62328': { desc: 'Lumbar puncture w/ fluoro/CT',               wrvu:  2.02 },
  '64483': { desc: 'Transforaminal epidural injection, L/S',     wrvu:  2.08 },
  '64493': { desc: 'Facet injection, lumbar/sacral, 1st',        wrvu:  1.47 },
  '64635': { desc: 'Facet neurotomy, lumbar/sacral, single',     wrvu:  2.51 },
  // E/M (for completeness)
  '99213': { desc: 'Office visit, established, low',             wrvu:  0.97 },
  '99214': { desc: 'Office visit, established, moderate',        wrvu:  1.50 },
  '99215': { desc: 'Office visit, established, high',            wrvu:  2.11 },
  '99204': { desc: 'Office visit, new patient, moderate',        wrvu:  2.60 },
  '99205': { desc: 'Office visit, new patient, high',            wrvu:  3.17 },
};

// ── Procedure name → CPT mapping ──────────────────────────────────────────
// Each entry: { pattern (regex or string array), cpt, label }
// Listed most-specific first. estimateWrvu() tries them in order.
const PROC_CPT_PATTERNS = [
  // TIPS
  { kw: ['tips revision', 'tips revise', 'revision of tips'],                cpt: '37183' },
  { kw: ['tips'],                                                             cpt: '37182' },

  // EMBOLIZATION
  { kw: ['y90', 'y-90', 'yttrium', 'radioembolization', 'sirt'],             cpt: '79445' },
  { kw: ['uterine artery embolization', 'uae', 'uterine embolization',
          'uterine fibroid embolization', 'ufe'],                             cpt: '37243' },
  { kw: ['hemorrhage embolization', 'embolization, emergency', 'trauma embo',
          'gi bleed', 'bronchial bleed', 'hemorrhage control'],               cpt: '37244' },
  { kw: ['prostate embolization', 'pae'],                                     cpt: '37243' },
  { kw: ['venous embolization', 'vein embolization', 'varicocele',
          'gonadal embolization', 'pelvic congestion'],                       cpt: '37241' },
  { kw: ['embolization', 'emboli', 'embo'],                                  cpt: '37242' },

  // ABLATION
  { kw: ['liver rfa', 'hepatic rfa', 'liver ablation rfa'],                  cpt: '47382' },
  { kw: ['liver cryo', 'hepatic cryo', 'liver cryoablation'],                cpt: '47383' },
  { kw: ['liver mwa', 'hepatic mwa', 'liver microwave', 'hepatic microwave',
          'liver ablation', 'hepatic ablation', 'liver mass mwa',
          'liver mass rfa', 'liver mass ablation'],                           cpt: '0944T' },
  { kw: ['lung rfa', 'lung ablation rfa', 'pulmonary rfa'],                  cpt: '32998' },
  { kw: ['lung cryo', 'lung cryoablation', 'pulmonary cryo',
          'lung ablation'],                                                   cpt: '32994' },
  { kw: ['renal rfa', 'kidney rfa', 'renal ablation rfa'],                   cpt: '50592' },
  { kw: ['renal cryo', 'kidney cryo', 'renal cryoablation',
          'renal ablation', 'kidney ablation'],                               cpt: '50593' },
  { kw: ['bone ablation', 'bone rfa', 'bone tumor ablation', 'osseous'],     cpt: '20982' },
  { kw: ['tumor ablation', 'ablation', 'rfa', 'microwave ablation',
          'mwa', 'cryoablation', 'cryo ablation'],                           cpt: '47382' },

  // VERTEBROPLASTY / KYPHOPLASTY
  { kw: ['kyphoplasty thorac', 'kypho t'],                                   cpt: '22513' },
  { kw: ['kyphoplasty lumb', 'kypho l'],                                     cpt: '22514' },
  { kw: ['kyphoplasty'],                                                     cpt: '22514' },
  { kw: ['vertebroplasty'],                                                  cpt: '22511' },
  { kw: ['sacroplasty'],                                                     cpt: '22511' },

  // BILIARY
  { kw: ['cholecystostomy', 'perc chole', 'gb drain', 'gallbladder drain'],  cpt: '47490' },
  { kw: ['biliary stent', 'bile duct stent', 'ptbd stent'],                  cpt: '47538' },
  { kw: ['biliary drain exchange', 'ptbd exchange', 'ptbd change',
          'biliary exchange'],                                                cpt: '47536' },
  { kw: ['ptbd', 'biliary drain', 'percutaneous biliary',
          'biliary drainage', 'internal external biliary'],                  cpt: '47534' },
  { kw: ['external biliary', 'external biliary drainage'],                   cpt: '47533' },

  // NEPHROSTOMY / URINARY
  { kw: ['nephrostomy exchange', 'nephrostomy change', 'pcn exchange',
          'pcn change'],                                                     cpt: '50435' },
  { kw: ['ureteral stent', 'ureteral stent placement'],                     cpt: '50693' },
  { kw: ['nephroureteral', 'nephro-ureteral'],                               cpt: '50433' },
  { kw: ['nephrostomy', 'pcn', 'nephro', 'percutaneous nephrostomy'],        cpt: '50432' },

  // GI TUBES
  { kw: ['g tube to gj', 'g to gj', 'convert g tube', 'gastrostomy to gj',
          'gastrostomy tube to gastrojejunostomy', 'gj tube placement'],     cpt: '49446' },
  { kw: ['gastrojejunostomy', 'gj tube change', 'gj replacement'],          cpt: '49452' },
  { kw: ['j tube', 'jejunostomy tube'],                                      cpt: '49441' },
  { kw: ['g tube change', 'g tube replacement', 'g-tube change',
          'gastrostomy tube change'],                                         cpt: '49450' },
  { kw: ['g tube', 'g-tube', 'gastrostomy tube', 'gastrostomy placement',
          'peg tube', 'percutaneous gastrostomy'],                           cpt: '49440' },

  // VASCULAR ACCESS — Port
  { kw: ['port removal', 'port explant', 'port takeout', 'remove port'],     cpt: '36590' },
  { kw: ['port placement', 'port insert', 'port implant',
          'totally implanted port', 'subcutaneous port'],                    cpt: '36561' },
  { kw: ['port revision', 'port repair', 'port replacement'],                cpt: '36582' },

  // VASCULAR ACCESS — TDC / Tunneled
  { kw: ['tdc', 'tunneled dialysis catheter', 'permcath',
          'tunneled hemodialysis'],                                           cpt: '36565' },
  { kw: ['tunneled catheter removal', 'remove tunneled',
          'tunneled line removal'],                                           cpt: '36589' },
  { kw: ['tunneled catheter', 'tunneled cvc', 'tunneled central'],           cpt: '36558' },

  // VASCULAR ACCESS — PICC
  { kw: ['picc'],                                                             cpt: '36573' },

  // VASCULAR ACCESS — Central Line
  { kw: ['central line', 'cvl', 'cvc placement', 'central venous catheter',
          'non-tunneled', 'triple lumen'],                                   cpt: '36556' },

  // DIALYSIS ACCESS INTERVENTIONS
  { kw: ['dialysis access thrombectomy', 'avf thrombectomy', 'avg thrombectomy',
          'dialysis circuit thrombectomy'],                                   cpt: '36904' },
  { kw: ['dialysis access angioplasty', 'avf angioplasty', 'avg angioplasty',
          'dialysis angioplasty'],                                            cpt: '36902' },
  { kw: ['dialysis access', 'avf', 'avg', 'graft intervention',
          'fistula intervention', 'hemodialysis access'],                    cpt: '36901' },

  // IVC FILTER
  { kw: ['ivc filter retrieval', 'ivc filter removal', 'remove ivc filter',
          'filter retrieval'],                                                cpt: '37193' },
  { kw: ['ivc filter', 'inferior vena cava filter', 'filter placement',
          'filter insert'],                                                   cpt: '37191' },

  // ANGIOPLASTY / STENT
  { kw: ['stent', 'angioplasty and stent', 'pta and stent',
          'angioplasty/stent'],                                              cpt: '37236' },
  { kw: ['angioplasty', 'pta', 'balloon dilation', 'percutaneous transluminal'],cpt: '37246'},

  // THROMBOLYSIS / THROMBECTOMY
  { kw: ['mechanical thrombectomy', 'angiojet', 'thrombectomy device'],      cpt: '37184' },
  { kw: ['venous thrombectomy', 'dvt thrombectomy'],                         cpt: '37187' },
  { kw: ['venous thrombolysis', 'catheter directed thrombolysis vein'],      cpt: '37212' },
  { kw: ['thrombolysis', 'tpa infusion', 'catheter directed thrombolysis',
          'cdt'],                                                             cpt: '37211' },

  // BIOPSY
  { kw: ['lung biopsy', 'pulmonary biopsy'],                                 cpt: '32408' },
  { kw: ['renal biopsy', 'kidney biopsy'],                                   cpt: '50200' },
  { kw: ['liver biopsy', 'hepatic biopsy'],                                  cpt: '47000' },
  { kw: ['pancreas biopsy', 'pancreatic biopsy'],                            cpt: '48102' },
  { kw: ['breast biopsy', 'breast core biopsy'],                             cpt: '19083' },
  { kw: ['fna', 'fine needle aspiration'],                                   cpt: '10005' },
  { kw: ['biopsy'],                                                           cpt: '49180' },

  // DRAINAGE
  { kw: ['abscess', 'fluid collection drain', 'pelvic drain', 'perihepatic drain',
          'pericolic drain', 'peritoneal drain', 'abdominal drain',
          'drain placement'],                                                 cpt: '49406' },
  { kw: ['soft tissue drain', 'subcutaneous drain', 'superficial drain'],    cpt: '10030' },
  { kw: ['chest tube', 'pleural drain', 'pleural catheter',
          'pleural space drain'],                                             cpt: '32557' },
  { kw: ['thoracentesis'],                                                    cpt: '32555' },
  { kw: ['paracentesis'],                                                     cpt: '49083' },
  { kw: ['aspiration', 'fluid aspiration'],                                  cpt: '49083' },

  // LUMBAR PUNCTURE
  { kw: ['lumbar puncture', 'lp', 'spinal tap', 'myelogram'],               cpt: '62328' },

  // SPINE / PAIN
  { kw: ['epidural steroid', 'epidural injection', 'esi'],                   cpt: '64483' },
  { kw: ['facet injection', 'facet block'],                                  cpt: '64493' },
  { kw: ['radiofrequency ablation facet', 'facet rfa', 'medial branch'],     cpt: '64635' },

  // ANGIOGRAM (diagnostic) — lower priority
  { kw: ['angiogram', 'arteriogram', 'venogram', 'angiography'],            cpt: '75726' },
];

// ── Resolve CPT → wRVU with fallback ──────────────────────────────────────
function lookupWrvu(cpt) {
  return CPT_WRVU[cpt] || null;
}

/**
 * estimateWrvu(procName)
 * Returns { cpt, desc, wrvu } for the best-matching CPT, or null if no match.
 */
function estimateWrvu(procName) {
  if (!procName) return null;
  const norm = procName.toLowerCase().replace(/[,;()\-\/]+/g, ' ').replace(/\s+/g, ' ').trim();

  for (const entry of PROC_CPT_PATTERNS) {
    for (const kw of entry.kw) {
      if (norm.includes(kw)) {
        const info = CPT_WRVU[entry.cpt];
        if (info) return { cpt: entry.cpt, desc: info.desc, wrvu: info.wrvu };
      }
    }
  }
  return null;
}

/**
 * computeCaseRvu(caseObj)
 * Returns estimated wRVU for a single case row, or null if unmatchable.
 * Uses 'Procedure' field primarily; falls back to 'ACGME Procedure Category'.
 */
function computeCaseRvu(c) {
  return estimateWrvu(c['Procedure']) || estimateWrvu(c['ACGME Procedure Category']);
}
