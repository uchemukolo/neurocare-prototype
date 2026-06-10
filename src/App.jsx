import { useState, useEffect, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const SERVICE_USERS = [
  { id:1, name:"Jason Campton", age:27, gender:"M", diagnoses:"ASD, ADHD, LD, Tourettes", room:"A1", triggers:["No structure","Waiting","Staff change"], warnings:["Tics","Questioning","Pacing"], risks:"Verbal aggression; property damage; refusal", iot:"Motion sensor, smart watch HRV, noise sensor", tags:["routine","tics","pacing","structure","waiting"], riskLevel:"medium", fluidTarget:1.5, foodLevel:"Regular" },
  { id:2, name:"Michelle Davids", age:22, gender:"F", diagnoses:"ASD, LD, Epilepsy, Asthma, Anxiety", room:"A2", triggers:["Not understood","Loud noise","Change"], warnings:["Hand-wringing","Withdrawal","Rocking"], risks:"Seizure; aggression; med refusal", iot:"Seizure wearable, smart bed, rescue med alert", tags:["communication","seizure","withdrawal"], riskLevel:"high", fluidTarget:1.8, foodLevel:"Regular soft" },
  { id:3, name:"Oliver Baxter", age:34, gender:"M", diagnoses:"ASD, LD, T2DM, Hypertension", room:"B1", triggers:["BG out of range","Meal delay","Unfamiliar staff"], warnings:["Sweating","Pallor","Irritability"], risks:"Hypoglycaemia; verbal aggression", iot:"CGM integration, smart scales, activity tracker", tags:["glucose","hypo","metformin","meal","delay"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular 1800kcal diabetic" },
  { id:4, name:"Sasha Nwosu", age:19, gender:"F", diagnoses:"ASD, ADHD, PDA, Depression", room:"A3", triggers:["Direct demands","Loss of control","Transition"], warnings:["Humming","Gaze avoidance","Laughter"], risks:"Refusal; self-isolation; outburst", iot:"Sleep tracker, noise sensor", tags:["demand","PDA","avoidance","choice","control"], riskLevel:"medium", fluidTarget:1.5, foodLevel:"Regular sensory" },
  { id:5, name:"Reuben Kamara", age:41, gender:"M", diagnoses:"ASD, Schizophrenia, Epilepsy, LD", room:"B2", triggers:["Missed meds","Isolation","Sleep deprivation"], warnings:["Muttering","Meal refusal","TV messages"], risks:"Seizure; psychotic episode; aggression", iot:"Seizure wearable, smart bed, location sensor", tags:["valproate","seizure","risperidone","delusion","isolation"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular" },
  { id:6, name:"Priya Patel", age:29, gender:"F", diagnoses:"ASD, T1DM, OCD, Anxiety", room:"C1", triggers:["Pump alarm","Plan change","Meal delay"], warnings:["List-writing","Room refusal","Checking"], risks:"Hypoglycaemia; anxiety crisis", iot:"CGM API, smart watch, pump alarm relay", tags:["pump","insulin","OCD","glucose","CGM"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular CHO-counted" },
  { id:7, name:"Tyler Forsythe", age:16, gender:"M", diagnoses:"ASD, ADHD, Conduct Disorder, Trauma", room:"C2", triggers:["Cancelled family contact","Night staff change"], warnings:["Foot tapping","Jaw clenching","Isolation"], risks:"Physical aggression; self-harm; property damage", iot:"Wearable HR, motion sensor, smart door", tags:["trauma","family","contact","PBS","methylphenidate"], riskLevel:"high", fluidTarget:1.5, foodLevel:"Regular high-cal" },
  { id:8, name:"Eleanor Walsh", age:52, gender:"F", diagnoses:"ASD, LD, CKD Stage 3, Hypothyroid", room:"C3", triggers:["Rushed interaction","Consecutive appts"], warnings:["I want to go home","Tearfulness","Thyroxine refusal"], risks:"Falls; fluid non-compliance; med refusal", iot:"Smart fluid vessel, smart scales, sleep sensor", tags:["kidney","fluid","levothyroxine","depression","CKD"], riskLevel:"medium", fluidTarget:1.2, foodLevel:"Low K/P diet" },
  { id:9, name:"Callum McBride", age:23, gender:"M", diagnoses:"ASD, LD severe, Pica, Epilepsy, GORD", room:"D1", triggers:["Unsafe object access","Free time >30min"], warnings:["Hand to mouth","Floor picking","Rapid eye"], risks:"Pica ingestion; seizure; GORD", iot:"Motion sensor, environmental audit, seizure wearable", tags:["pica","seizure","PECS","lamotrigine","midazolam"], riskLevel:"high", fluidTarget:1.8, foodLevel:"IDDSI Level 5" },
  { id:10, name:"Danielle Bright", age:38, gender:"F", diagnoses:"ASD, Bipolar T1, LD, Obesity", room:"D2", triggers:["Sleep <5hrs","Stopping lithium","Spending urges"], warnings:["Fast talking","Grandiosity","Giving possessions"], risks:"Manic episode; financial harm; aggression", iot:"Sleep tracker, smart watch speech, smart door", tags:["lithium","bipolar","mania","mood","spending"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular 1500kcal" },
  { id:11, name:"Harriet Ogden", age:45, gender:"F", diagnoses:"ASD, LD, Cancer remission, Lymphoedema", room:"D3", triggers:["Cancer media","Unexpected health appt"], warnings:["Body-checking","Googling","Meal refusal"], risks:"Anxiety crisis; appointment refusal", iot:"Wearable body-check proxy, smart watch HR", tags:["cancer","tamoxifen","lymphoedema","anxiety","health"], riskLevel:"medium", fluidTarget:1.8, foodLevel:"Regular" },
  { id:12, name:"Leon Asante", age:31, gender:"M", diagnoses:"ASD, ADHD, LD, Sickle Cell Disease", room:"E1", triggers:["Cold <18C","Dehydration","Infection"], warnings:["Bone pain","Pallor","Requesting blankets"], risks:"Sickle cell crisis; pain episode; infection", iot:"Smart thermometer, smart fluid vessel, wearable SpO2", tags:["sickle","crisis","pain","cold","dehydration"], riskLevel:"high", fluidTarget:3.0, foodLevel:"Regular high-cal" },
  { id:13, name:"Grace Runcie", age:26, gender:"F", diagnoses:"ASD, Anorexia recovery, Depression, Osteopenia", room:"E2", triggers:["Being weighed in front of others","Skipped meals"], warnings:["Rearranging food","Water loading","Exercise attempts"], risks:"BMI alert; falls; meal refusal", iot:"Smart scales nurse-only, motion sensor, posture sensor", tags:["MARSIPAN","BMI","anorexia","fluoxetine","osteopenia"], riskLevel:"high", fluidTarget:1.8, foodLevel:"Meal plan dietitian" },
  { id:14, name:"Winston Okafor", age:55, gender:"M", diagnoses:"LD severe, ASD, T2DM, COPD, Dysphagia", room:"E3", triggers:["Respiratory infection","Unfamiliar staff","Lying flat"], warnings:["Secretion increase","Chest tapping","Fluid refusal"], risks:"Aspiration; COPD exacerbation; hypoglycaemia", iot:"Smart bed, pulse oximeter, humidity sensor", tags:["dysphagia","IDDSI","COPD","PAINAD","thickened"], riskLevel:"high", fluidTarget:1.5, foodLevel:"IDDSI Level 4 Pureed" },
  { id:15, name:"Aisha Ibrahim", age:21, gender:"F", diagnoses:"ASD, PTSD, Selective Mutism, Anxiety, UTI", room:"F1", triggers:["Male staff without knock","Family reference","Touch"], warnings:["AAC drop-off","Increased blinking","Sleeve-pulling"], risks:"Trauma response; dissociation; refusal", iot:"Smart door female-only, wearable HR, weekly urinalysis", tags:["PTSD","trauma","mutism","AAC","UTI"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular sensory" },
  { id:16, name:"Benjamin Novak", age:48, gender:"M", diagnoses:"Down Syndrome, ASD, Alzheimers early, Coeliac", room:"F2", triggers:["Morning confusion","Room rearrangement","Sundowning"], warnings:["Calling for mother","Hand-wringing","Bed refusal"], risks:"Wandering; confusion; falls", iot:"Smart door wandering, lighting automation, GPS", tags:["dementia","sundowning","Alzheimers","gluten-free","coeliac"], riskLevel:"high", fluidTarget:1.5, foodLevel:"Strictly gluten-free" },
  { id:17, name:"Zara Collins", age:18, gender:"F", diagnoses:"ASD, ADHD, EUPD emerging, Self-harm history", room:"F3", triggers:["Cancelled plans","Perceived rejection","Social media"], warnings:["Long sleeves warm weather","Appetite decrease","Rapid topic change"], risks:"Self-harm; crisis; absconding", iot:"Wearable HRV, sleep tracker, motion sensor", tags:["self-harm","EUPD","DBT","rejection","fluoxetine"], riskLevel:"high", fluidTarget:1.5, foodLevel:"Regular" },
  { id:18, name:"Freddie Hassan", age:36, gender:"M", diagnoses:"ASD, LD severe, Cerebral Palsy, Epilepsy, PEG fed", room:"G1", triggers:["Feed interruption","Cold causing spasm","Constipation"], warnings:["Grimacing","AAC disengagement","Tube redness"], risks:"Seizure; PEG infection; constipation crisis", iot:"Seizure wearable, smart bed, PEG smart pump", tags:["PEG","gastrostomy","levetiracetam","midazolam","seizure"], riskLevel:"high", fluidTarget:1.8, foodLevel:"PEG only" },
  { id:19, name:"Nadia Chukwu", age:43, gender:"F", diagnoses:"ASD, LD, Bipolar T2, PCOS, Obesity", room:"G2", triggers:["Sleep disruption","Skipped meals","Luteal phase"], warnings:["Spending requests","Fast speech","Meal skipping"], risks:"Hypomanic episode; financial harm", iot:"Wearable HR, smart scales, cycle app integration", tags:["PCOS","quetiapine","lamotrigine","bipolar","hypomania"], riskLevel:"medium", fluidTarget:2.0, foodLevel:"Regular low GI" },
  { id:20, name:"Kevin Adeyemi", age:30, gender:"M", diagnoses:"ASD, Moderate LD, Challenging Behaviour, Severe Eczema", room:"G3", triggers:["Eczema flare","Non-preferred activity demands"], warnings:["Escalating scratching","Forehead tapping","Narrowing eyes"], risks:"Physical aggression; property damage; refusal", iot:"Wearable scratch sensor, humidity sensor, smart fabric", tags:["eczema","Betnovate","PBS","scratch","skin"], riskLevel:"medium", fluidTarget:1.8, foodLevel:"Regular" },
  { id:21, name:"Dylan Walsh", age:24, gender:"M", diagnoses:"ASD, ADHD, GAD, Hypermobility Syndrome", room:"H1", triggers:["Joint pain flare","Unplanned schedule change","Crowds"], warnings:["Repetitive questioning","Rubbing joints","Meal skipping"], risks:"Anxiety crisis; joint dislocation; refusal", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["anxiety","joint","pain","hypermobility","schedule"], riskLevel:"medium", fluidTarget:1.8, foodLevel:"Regular" },
  { id:22, name:"Rosa Pham", age:33, gender:"F", diagnoses:"ASD, LD, Cerebral Palsy hemiplegia, Seizure Disorder", room:"H2", triggers:["Not being understood","Task requiring both hands","Fatigue"], warnings:["Slurred speech worsening","Left arm spasm increase","Yawning"], risks:"Tonic-clonic seizure; fall; communication frustration", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["hemiplegia","dysarthria","AAC","seizure","lamotrigine"], riskLevel:"high", fluidTarget:1.8, foodLevel:"Level 6 Soft" },
  { id:23, name:"Marcus Thompson", age:28, gender:"M", diagnoses:"ASD, LD, Intermittent Explosive Disorder, PTSD", room:"H3", triggers:["Perceived injustice","Physical proximity during escalation","Loud music"], warnings:["Fist clenching","Jaw tightening","Pacing increasing speed"], risks:"Physical aggression; property destruction", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["explosive","aggression","IED","PBS","injustice"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular" },
  { id:24, name:"Fatima Osei", age:39, gender:"F", diagnoses:"ASD, LD, Hypothyroidism, Iron Deficiency Anaemia, Dyspraxia", room:"I1", triggers:["Complex multi-step instructions","Fatigue from anaemia","Crowded noisy environments"], warnings:["Pallor increase","Excessive fatigue","Coordination worsening"], risks:"Falls; fatigue episode; medication timing error", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["anaemia","iron","fatigue","hypothyroid","dyspraxia"], riskLevel:"medium", fluidTarget:1.8, foodLevel:"Regular iron-rich" },
  { id:25, name:"Jamie Reid", age:21, gender:"NB", diagnoses:"ASD, Gender Dysphoria, Major Depressive Disorder, Self-harm history", room:"I2", triggers:["Misgendering by staff","Deadnaming","Cancelled gender clinic appt"], warnings:["Long sleeve clothing warm weather","Meal refusal","Social withdrawal"], risks:"Self-harm; crisis; refusal of care", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["gender","pronoun","dysphoria","depression","self-harm"], riskLevel:"high", fluidTarget:1.8, foodLevel:"Regular" },
  { id:26, name:"Charlie Brooks", age:44, gender:"M", diagnoses:"ASD, Moderate LD, Chronic Pain Syndrome, Fibromyalgia", room:"I3", triggers:["Cold weather","Extended sitting without position change","Sudden noise"], warnings:["Pain scale above 5/10","Refusal to get out of bed","Facial grimacing"], risks:"Pain crisis; falls; refusal of care", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["pain","fibromyalgia","chronic","fatigue","amitriptyline"], riskLevel:"medium", fluidTarget:2.0, foodLevel:"Regular anti-inflammatory" },
  { id:27, name:"Abigail Okonkwo", age:17, gender:"F", diagnoses:"ASD, ARFID, Anxiety, Developmental Coordination Disorder", room:"J1", triggers:["Unexpected food presented","Food touching other food","Wrong brand substituted"], warnings:["Sitting away from food","Hand over nose at smell","Escalating food refusal"], risks:"Meal refusal requiring escalation; weight loss alert", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["ARFID","safe food","neophobia","sensory","restricted"], riskLevel:"medium", fluidTarget:1.5, foodLevel:"ARFID protocol safe foods" },
  { id:28, name:"Steven Lowe", age:58, gender:"M", diagnoses:"ASD, LD, T2DM, Heart Failure NYHA II, Sleep Apnoea", room:"J2", triggers:["CPAP discomfort","High-sodium meal","Exertion causing breathlessness"], warnings:["Ankle oedema visible","Breathlessness on minimal exertion","CPAP refusal"], risks:"Heart failure decompensation; CPAP non-compliance; hypoglycaemia", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["heart failure","CPAP","apnoea","oedema","furosemide"], riskLevel:"high", fluidTarget:1.5, foodLevel:"Cardiac diabetic low sodium" },
  { id:29, name:"Leona Marsh", age:25, gender:"F", diagnoses:"ASD, LD, Mast Cell Activation Syndrome, Anxiety", room:"J3", triggers:["MCAS trigger foods","Fragrances or perfumes","Sudden temperature change"], warnings:["Facial flushing","Hives appearing","GI cramping complaint"], risks:"Anaphylaxis; anxiety crisis; community incident", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["MCAS","mast cell","histamine","allergy","flushing"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Low histamine MCAS protocol" },
  { id:30, name:"Thomas Obi", age:35, gender:"M", diagnoses:"ASD, Moderate LD, T1DM, Coeliac Disease, Hypoglycaemia Unawareness", room:"K1", triggers:["Missed meal disrupting insulin","Hypo unawareness","Gluten cross-contamination"], warnings:["CGM alarm below 4.0","Behaviour change without trigger","Agitation or confusion"], risks:"Severe hypoglycaemia; gluten exposure reaction; behavioural escalation", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["T1D","hypo","unawareness","CGM","insulin"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Gluten-free CHO-counted" },
  { id:31, name:"Kemi Saunders", age:29, gender:"F", diagnoses:"ASD, LD, IBD Crohn's, Anxiety, Vitamin B12 Deficiency", room:"K2", triggers:["High-fibre or spicy foods","Stress exacerbating IBD","Public toilet unavailability"], warnings:["Increased toilet urgency","Abdominal guarding posture","Meal refusal"], risks:"IBD flare; toileting dignity incident; anxiety crisis", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["Crohns","IBD","flare","toilet","urgency"], riskLevel:"medium", fluidTarget:2.0, foodLevel:"Low-residue IBD protocol" },
  { id:32, name:"Patrick Webb", age:50, gender:"M", diagnoses:"ASD, LD, Parkinson's Disease early, Depression", room:"K3", triggers:["Levodopa wearing-off period","Rushed morning routine","High-protein meal near levodopa"], warnings:["Tremor increase","Freezing at doorways","Voice softening further"], risks:"Falls during off period; aspiration risk; depression episode", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["Parkinsons","levodopa","tremor","freezing","hypophonia"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular protein timing" },
  { id:33, name:"Iris Mensah", age:32, gender:"F", diagnoses:"ASD, LD, Epilepsy, T2DM, Depression", room:"L1", triggers:["Missed antiepileptic dose","Sleep deprivation","Hypoglycaemia lowering seizure threshold"], warnings:["Staring spells","Lip smacking","Hand automatisms"], risks:"Tonic-clonic seizure; hypoglycaemia; fall post-ictal", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["seizure","levetiracetam","catamenial","menstrual","aura"], riskLevel:"high", fluidTarget:1.8, foodLevel:"Regular diabetic 1600kcal" },
  { id:34, name:"Aaron Singh", age:26, gender:"M", diagnoses:"ASD, ADHD, Tourette Syndrome, OCD", room:"L2", triggers:["Attention drawn to tics","Stress increasing tic frequency","OCD ritual interrupted"], warnings:["Tic frequency surge","Ritualistic behaviour extending","Hyperfocus signs"], risks:"OCD escalation; tic-related minor injury; conflict from tic misinterpretation", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["tics","Tourette","OCD","ritual","compulsion"], riskLevel:"medium", fluidTarget:1.8, foodLevel:"Regular" },
  { id:35, name:"Evelyn Oduya", age:47, gender:"F", diagnoses:"ASD, LD, Multiple Sclerosis relapsing-remitting, Anxiety", room:"L3", triggers:["Heat exposure Uhthoff phenomenon","Fatigue exceeding tolerance","Infection or fever"], warnings:["Leg weakness increase","Visual blurring complaint","Extreme fatigue"], risks:"MS relapse; falls; UTI due to bladder dysfunction", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["MS","relapse","DMT","fatigue","Uhthoff"], riskLevel:"high", fluidTarget:2.0, foodLevel:"Regular anti-inflammatory Mediterranean" },
  { id:36, name:"Nathan Kim", age:22, gender:"M", diagnoses:"ASD, Severe LD, Non-Epileptic Attack Disorder, Anxiety", room:"M1", triggers:["Emotional overwhelm from anxiety","Unexpected routine change","Loud sudden noises"], warnings:["Increased anxiety stimming","Withdrawal before episode","Hand flapping increase"], risks:"NEAD episode; anxiety crisis; environmental overwhelm", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["NEAD","psychogenic","episode","anxiety","routine"], riskLevel:"high", fluidTarget:1.8, foodLevel:"Level 6 Soft" },
  { id:37, name:"Chloe James", age:36, gender:"F", diagnoses:"ASD, LD, Bipolar T2, PMDD", room:"M2", triggers:["Luteal phase days 14-28","Sleep disruption","Interpersonal conflict"], warnings:["Crying without cause 7-10 days before period","Increased irritability cyclically","Sleep disruption cyclically"], risks:"Depressive episode; interpersonal conflict during PMDD; medication confusion", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["PMDD","luteal","bipolar","mood","cycle"], riskLevel:"medium", fluidTarget:1.8, foodLevel:"Regular" },
  { id:38, name:"Michael Obeng", age:40, gender:"M", diagnoses:"ASD, Severe LD, Stereotypic Movement Disorder, SIB, Hypothyroidism", room:"M3", triggers:["Head banging on hard surface access","Environmental overstimulation","Denied preferred sensory activity"], warnings:["Hand biting increasing","Head banging rhythm accelerating","Body rocking increasing speed"], risks:"SIB head injury; SIB hand injury; sensory crisis", iot:"Motion sensor, smart watch HRV, environmental sensor", tags:["SIB","head-banging","hand-biting","stereotypy","sensory"], riskLevel:"high", fluidTarget:1.8, foodLevel:"Level 5 Minced & Moist" }
];

// Simulate live alert data
const LIVE_ALERTS = [
  { id:"a1", userId:2, name:"Michelle Davids", room:"A2", time:"08:14", severity:"critical", message:"HRV dropped 22% in last 10 min. Hand-wringing observed. Matches pre-seizure pattern.", action:"Check rescue med availability. Alert on-call nurse.", sensor:"Seizure wearable" },
  { id:"a2", userId:5, name:"Reuben Kamara", room:"B2", time:"08:09", severity:"critical", message:"Missed morning medication. Isolation behaviour for 35 mins. Sleep was 3.2hrs last night.", action:"Keyworker check-in now. Do not leave unobserved.", sensor:"Smart bed + location" },
  { id:"a3", userId:3, name:"Oliver Baxter", room:"B1", time:"08:22", severity:"high", message:"Breakfast delayed 25 mins past scheduled time. BG reading 4.1 — approaching low threshold.", action:"Prioritise meal delivery. Offer glucose gel standby.", sensor:"CGM integration" },
  { id:"a4", userId:12, name:"Leon Asante", room:"E1", time:"07:55", severity:"high", message:"Room temperature recorded at 17.2°C. Fluid intake at 0.4L vs 3.0L daily target.", action:"Increase room heating. Prompt fluid intake immediately.", sensor:"Smart thermometer + fluid vessel" },
  { id:"a5", userId:17, name:"Zara Collins", room:"F3", time:"08:31", severity:"high", message:"Long-sleeved clothing in warm conditions noted on entry. Appetite low at breakfast. Minimal engagement.", action:"Low-arousal approach. Do not draw attention to clothing. Keyworker check-in privately.", sensor:"Wearable HRV + motion" },
  { id:"a6", userId:10, name:"Danielle Bright", room:"D2", time:"07:48", severity:"high", message:"Sleep duration 4.1hrs. Speech rate elevated during morning greeting. Pattern matches pre-manic indicators.", action:"Confirm lithium was taken last night. Alert psychiatry if pattern continues by 10:00.", sensor:"Sleep tracker + smart watch speech" },
  { id:"a7", userId:16, name:"Benjamin Novak", room:"F2", time:"06:58", severity:"medium", message:"Sundowning pattern detected. Twice called for 'mother'. Room found partially rearranged.", action:"Reorient gently. Consistent familiar staff only. Check breakfast nutrition.", sensor:"Smart door + lighting" },
  { id:"a8", userId:9, name:"Callum McBride", room:"D1", time:"08:44", severity:"medium", message:"Unstructured time exceeding 28 minutes. Motion pattern consistent with object investigation.", action:"Provide structured activity now. Environmental safety sweep.", sensor:"Motion sensor + environmental" },
];

const SHIFT_HANDOVER = [
  { userId:2, name:"Michelle Davids", room:"A2", outgoing:"Night staff — unsettled night, two rocking episodes at 02:00 and 04:30. No seizure activity. Took all meds. Morning HRV dropping — flagged to day team.", incoming:"Aware of elevated risk. Rescue med checked and accessible. Low-stimulus morning planned.", flag:"WATCH CLOSELY" },
  { userId:5, name:"Reuben Kamara", room:"B2", outgoing:"Refused dinner. Minimal conversation. Went to bed 21:15. Did not take evening meds — recorded in eMAR. Sleep 3.2hrs total.", incoming:"Missed meds noted. Keyworker-only approach today. No group activities until stable.", flag:"MED ALERT" },
  { userId:3, name:"Oliver Baxter", room:"B1", outgoing:"Good evening, ate well, BG stable at 7.4 at 21:00. Morning BG 4.1 — borderline low.", incoming:"Breakfast priority. Glucose gel on person. Activity monitor on today.", flag:"GLUCOSE WATCH" },
  { userId:10, name:"Danielle Bright", room:"D2", outgoing:"Sleep 4.1hrs. Fast speech on night check at 01:00. Gave possessions to night staff — received back by distraction.", incoming:"Lithium compliance check urgent. Psychiatry contact number pinned in office.", flag:"MOOD ESCALATION" },
  { userId:16, name:"Benjamin Novak", room:"F2", outgoing:"Confused at 03:00, wandered toward front door. Smart door alert triggered. Redirected successfully. Settled by 04:00.", incoming:"Consistent familiar staff today. No room rearrangements. Breakfast in bedroom.", flag:"WANDERING RISK" },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const riskColor = { high:"#E53E3E", medium:"#D69E2E", low:"#38A169" };
const riskBg = { high:"#FFF5F5", medium:"#FFFAF0", low:"#F0FFF4" };
const riskBadgeBg = { high:"#FED7D7", medium:"#FEFCBF", low:"#C6F6D5" };
const severityColor = { critical:"#E53E3E", high:"#DD6B20", medium:"#D69E2E", low:"#38A169" };
const severityBg = { critical:"#FFF5F5", high:"#FFFAF0", medium:"#FEFCE8", low:"#F0FFF4" };

function Avatar({ name, size=36, riskLevel }) {
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2);
  const bg = riskLevel === "high" ? "#FED7D7" : riskLevel === "medium" ? "#FEFCBF" : "#C6F6D5";
  const color = riskLevel === "high" ? "#C53030" : riskLevel === "medium" ? "#B7791F" : "#276749";
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*0.35, flexShrink:0, fontFamily:"'DM Sans', sans-serif" }}>
      {initials}
    </div>
  );
}

function Badge({ label, color="#2B6CB0", bg="#EBF8FF", size=11 }) {
  return (
    <span style={{ background:bg, color, borderRadius:4, padding:"2px 7px", fontSize:size, fontWeight:600, fontFamily:"'DM Mono', monospace", letterSpacing:"0.01em" }}>
      {label}
    </span>
  );
}

function PulsingDot({ color="#E53E3E" }) {
  return (
    <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:color, marginRight:6, boxShadow:`0 0 0 3px ${color}33`, animation:"pulse 1.8s infinite" }} />
  );
}

// ─── VIEWS ─────────────────────────────────────────────────────────────────────

function AlertDashboard({ onSelect }) {
  const criticalAlerts = LIVE_ALERTS.filter(a => a.severity === "critical");
  const highAlerts = LIVE_ALERTS.filter(a => a.severity === "high");
  const mediumAlerts = LIVE_ALERTS.filter(a => a.severity === "medium");

  const summary = [
    { label:"Critical", count:criticalAlerts.length, color:"#E53E3E", bg:"#FFF5F5", border:"#FC8181" },
    { label:"High", count:highAlerts.length, color:"#DD6B20", bg:"#FFFAF0", border:"#F6AD55" },
    { label:"Monitoring", count:mediumAlerts.length, color:"#D69E2E", bg:"#FFFFF0", border:"#ECC94B" },
    { label:"Stable", count:SERVICE_USERS.length - LIVE_ALERTS.length, color:"#38A169", bg:"#F0FFF4", border:"#68D391" },
  ];

  return (
    <div style={{ padding:"0 0 32px" }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Instrument Serif', serif", fontSize:22, fontWeight:400, color:"#1A202C", marginBottom:4 }}>Morning Shift Overview</h2>
        <p style={{ color:"#718096", fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>Tuesday 08:47 · 38 residents · 3 staff on shift</p>
      </div>

      {/* Summary strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
        {summary.map(s => (
          <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:28, fontWeight:700, color:s.color, fontFamily:"'DM Sans', sans-serif", lineHeight:1 }}>{s.count}</div>
            <div style={{ fontSize:12, color:s.color, fontFamily:"'DM Mono', monospace", marginTop:4, letterSpacing:"0.04em" }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Alert feed */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {LIVE_ALERTS.map(alert => {
          const user = SERVICE_USERS.find(u => u.id === alert.userId);
          return (
            <div key={alert.id} onClick={() => onSelect && onSelect(user)} style={{ background:severityBg[alert.severity] || "#fff", border:`1px solid ${severityColor[alert.severity]}44`, borderLeft:`4px solid ${severityColor[alert.severity]}`, borderRadius:10, padding:"14px 16px", cursor:"pointer", transition:"box-shadow 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <Avatar name={alert.name} size={38} riskLevel={user?.riskLevel} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#1A202C", fontFamily:"'DM Sans', sans-serif" }}>{alert.name}</span>
                    <Badge label={`Room ${alert.room}`} color="#4A5568" bg="#EDF2F7" />
                    <Badge label={alert.severity.toUpperCase()} color={severityColor[alert.severity]} bg={severityBg[alert.severity]} />
                    <span style={{ fontSize:12, color:"#718096", fontFamily:"'DM Mono', monospace", marginLeft:"auto" }}>{alert.time}</span>
                  </div>
                  <p style={{ fontSize:13, color:"#2D3748", margin:"0 0 6px", fontFamily:"'DM Sans', sans-serif", lineHeight:1.5 }}>{alert.message}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:12, color:"#4A5568", fontFamily:"'DM Mono', monospace" }}>⚡ {alert.action}</span>
                  </div>
                  <div style={{ marginTop:6 }}>
                    <Badge label={`📡 ${alert.sensor}`} color="#553C9A" bg="#FAF5FF" size={10} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResidentDirectory({ onSelect, searchQuery }) {
  const [filter, setFilter] = useState("all");
  const filtered = SERVICE_USERS.filter(u => {
    const matchRisk = filter === "all" || u.riskLevel === filter;
    const q = searchQuery?.toLowerCase() || "";
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.diagnoses.toLowerCase().includes(q) || u.room.toLowerCase().includes(q);
    return matchRisk && matchSearch;
  });

  return (
    <div style={{ paddingBottom:32 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <h2 style={{ fontFamily:"'Instrument Serif', serif", fontSize:22, fontWeight:400, color:"#1A202C", margin:0 }}>All Residents</h2>
        <span style={{ color:"#718096", fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>— {filtered.length} shown</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          {["all","high","medium","low"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"5px 12px", borderRadius:20, border:"1px solid", borderColor: filter===f ? riskColor[f] || "#2B6CB0" : "#E2E8F0", background: filter===f ? (riskBadgeBg[f] || "#EBF8FF") : "#fff", color: filter===f ? (riskColor[f] || "#2B6CB0") : "#4A5568", fontSize:12, fontWeight:600, fontFamily:"'DM Mono', monospace", cursor:"pointer", letterSpacing:"0.03em" }}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:12 }}>
        {filtered.map(user => (
          <div key={user.id} onClick={() => onSelect(user)} style={{ background:"#fff", border:`1px solid #E2E8F0`, borderLeft:`4px solid ${riskColor[user.riskLevel]}`, borderRadius:10, padding:"14px 16px", cursor:"pointer", transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <Avatar name={user.name} size={40} riskLevel={user.riskLevel} />
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"#1A202C", fontFamily:"'DM Sans', sans-serif" }}>{user.name}</div>
                <div style={{ fontSize:12, color:"#718096", fontFamily:"'DM Mono', monospace" }}>Room {user.room} · Age {user.age} · {user.gender}</div>
              </div>
              <div style={{ marginLeft:"auto" }}>
                <Badge label={user.riskLevel.toUpperCase()} color={riskColor[user.riskLevel]} bg={riskBadgeBg[user.riskLevel]} />
              </div>
            </div>
            <p style={{ fontSize:12, color:"#4A5568", margin:"0 0 8px", fontFamily:"'DM Sans', sans-serif", lineHeight:1.5 }}>{user.diagnoses}</p>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {user.tags.slice(0,4).map(tag => (
                <Badge key={tag} label={tag} color="#553C9A" bg="#FAF5FF" size={10} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResidentProfile({ user, onBack, apiKey }) {
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const hasAlert = LIVE_ALERTS.find(a => a.userId === user.id);

  async function generateInsight() {
    setAiLoading(true);
    setAiInsight("");
    try {
      const prompt = `You are NeuroCare AI's behavioural analysis engine. Based on the following service user profile, provide a concise clinical insight (3-4 sentences) covering: (1) the most likely escalation pathway today based on their triggers and current alerts, (2) one specific proactive recommendation for the care team, and (3) a key thing to monitor in the next 4 hours. Write in plain English for frontline care workers, not clinicians. Do not use jargon. Be direct and specific.

Service User: ${user.name}, Age ${user.age}
Diagnoses: ${user.diagnoses}
Key Triggers: ${user.triggers.join("; ")}
Early Warnings: ${user.warnings.join("; ")}
Known Risks: ${user.risks}
IoT Sensors: ${user.iot}
Current Alert: ${hasAlert ? hasAlert.message : "No active alert"}

Respond in 3-4 plain English sentences only.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{ role:"user", content:prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "Unable to generate insight.";
      setAiInsight(text);
    } catch(e) {
      setAiInsight("AI analysis temporarily unavailable.");
    }
    setAiLoading(false);
  }

  return (
    <div style={{ paddingBottom:40 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#2B6CB0", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600, padding:"0 0 16px", display:"flex", alignItems:"center", gap:4 }}>
        ← Back to residents
      </button>

      {hasAlert && (
        <div style={{ background:severityBg[hasAlert.severity], border:`1px solid ${severityColor[hasAlert.severity]}66`, borderLeft:`4px solid ${severityColor[hasAlert.severity]}`, borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <PulsingDot color={severityColor[hasAlert.severity]} />
            <span style={{ fontWeight:700, fontSize:13, color:severityColor[hasAlert.severity], fontFamily:"'DM Mono', monospace" }}>LIVE ALERT · {hasAlert.time}</span>
          </div>
          <p style={{ margin:"0 0 6px", fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif", lineHeight:1.5 }}>{hasAlert.message}</p>
          <p style={{ margin:0, fontSize:12, color:"#4A5568", fontFamily:"'DM Mono', monospace" }}>⚡ {hasAlert.action}</p>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
        <Avatar name={user.name} size={56} riskLevel={user.riskLevel} />
        <div>
          <h2 style={{ fontFamily:"'Instrument Serif', serif", fontSize:26, fontWeight:400, color:"#1A202C", margin:"0 0 4px" }}>{user.name}</h2>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <Badge label={`Room ${user.room}`} color="#4A5568" bg="#EDF2F7" />
            <Badge label={`Age ${user.age}`} color="#4A5568" bg="#EDF2F7" />
            <Badge label={user.gender} color="#4A5568" bg="#EDF2F7" />
            <Badge label={user.riskLevel.toUpperCase() + " RISK"} color={riskColor[user.riskLevel]} bg={riskBadgeBg[user.riskLevel]} />
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Diagnoses */}
        <div style={{ background:"#F7FAFC", border:"1px solid #E2E8F0", borderRadius:10, padding:"16px" }}>
          <div style={{ fontSize:11, color:"#718096", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em", marginBottom:8 }}>DIAGNOSES</div>
          <p style={{ fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif", margin:0, lineHeight:1.7 }}>{user.diagnoses}</p>
        </div>

        {/* Care needs */}
        <div style={{ background:"#F7FAFC", border:"1px solid #E2E8F0", borderRadius:10, padding:"16px" }}>
          <div style={{ fontSize:11, color:"#718096", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em", marginBottom:8 }}>DAILY CARE</div>
          <p style={{ fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif", margin:"0 0 4px", lineHeight:1.5 }}>Food: {user.foodLevel}</p>
          <p style={{ fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif", margin:0, lineHeight:1.5 }}>Fluid target: {user.fluidTarget}L daily</p>
        </div>
      </div>

      {/* Triggers */}
      <div style={{ background:"#FFF5F5", border:"1px solid #FC818166", borderRadius:10, padding:"16px", marginBottom:12 }}>
        <div style={{ fontSize:11, color:"#C53030", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em", marginBottom:10 }}>KEY TRIGGERS</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {user.triggers.map((t,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#E53E3E", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Early warnings */}
      <div style={{ background:"#FFFAF0", border:"1px solid #F6AD5566", borderRadius:10, padding:"16px", marginBottom:12 }}>
        <div style={{ fontSize:11, color:"#C05621", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em", marginBottom:10 }}>EARLY WARNINGS — act before escalation</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {user.warnings.map((w,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#DD6B20", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif" }}>{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* IoT sensors */}
      <div style={{ background:"#FAF5FF", border:"1px solid #D6BCFA", borderRadius:10, padding:"16px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#553C9A", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em", marginBottom:8 }}>CONNECTED SENSORS</div>
        <p style={{ fontSize:13, color:"#44337A", fontFamily:"'DM Sans', sans-serif", margin:0 }}>📡 {user.iot}</p>
      </div>

      {/* AI Analysis */}
      <div style={{ background:"#EBF8FF", border:"1px solid #90CDF4", borderRadius:10, padding:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <div style={{ fontSize:11, color:"#2B6CB0", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em" }}>AI BEHAVIOURAL INSIGHT</div>
          <button onClick={generateInsight} disabled={aiLoading} style={{ background:"#2B6CB0", color:"#fff", border:"none", borderRadius:6, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:aiLoading?"wait":"pointer", fontFamily:"'DM Sans', sans-serif", opacity:aiLoading?0.7:1 }}>
            {aiLoading ? "Analysing..." : "Generate insight"}
          </button>
        </div>
        {aiInsight ? (
          <p style={{ fontSize:13, color:"#1A365D", fontFamily:"'DM Sans', sans-serif", margin:0, lineHeight:1.7 }}>{aiInsight}</p>
        ) : (
          <p style={{ fontSize:13, color:"#4A5568", fontFamily:"'DM Sans', sans-serif", margin:0, fontStyle:"italic" }}>
            Click "Generate insight" to get an AI analysis of today's risk patterns for {user.name.split(" ")[0]}.
          </p>
        )}
      </div>
    </div>
  );
}

function ShiftHandover() {
  const [expandedId, setExpandedId] = useState(null);
  const [handoverInsights, setHandoverInsights] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  async function generateHandoverBriefing(item) {
    setLoadingId(item.userId);
    const user = SERVICE_USERS.find(u => u.id === item.userId);
    const prompt = `You are NeuroCare AI generating a shift handover briefing for an incoming care worker. Be direct, plain, and practical. 2-3 sentences maximum.

Resident: ${item.name}
What night staff reported: ${item.outgoing}
What day staff plan: ${item.incoming}
Current flag: ${item.flag}
Known triggers: ${user?.triggers?.join("; ")}
Known early warnings: ${user?.warnings?.join("; ")}

Give the incoming carer exactly what they need to know in the first 60 minutes of their shift. No jargon.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:prompt }] })
      });
      const data = await res.json();
      const text = data.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      setHandoverInsights(prev => ({ ...prev, [item.userId]: text }));
    } catch(e) {
      setHandoverInsights(prev => ({ ...prev, [item.userId]: "AI briefing unavailable." }));
    }
    setLoadingId(null);
  }

  return (
    <div style={{ paddingBottom:40 }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Instrument Serif', serif", fontSize:22, fontWeight:400, color:"#1A202C", marginBottom:4 }}>Shift Handover</h2>
        <p style={{ color:"#718096", fontSize:13, fontFamily:"'DM Sans', sans-serif" }}>Night shift → Day shift · Tuesday 08:00 · Priority residents shown</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {SHIFT_HANDOVER.map(item => {
          const user = SERVICE_USERS.find(u => u.id === item.userId);
          const expanded = expandedId === item.userId;
          const flagColors = { "WATCH CLOSELY":"#E53E3E", "MED ALERT":"#E53E3E", "GLUCOSE WATCH":"#DD6B20", "MOOD ESCALATION":"#DD6B20", "WANDERING RISK":"#D69E2E" };
          const flagColor = flagColors[item.flag] || "#4A5568";

          return (
            <div key={item.userId} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:12, overflow:"hidden" }}>
              <div onClick={() => setExpandedId(expanded ? null : item.userId)} style={{ padding:"16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                <Avatar name={item.name} size={40} riskLevel={user?.riskLevel} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#1A202C", fontFamily:"'DM Sans', sans-serif" }}>{item.name}</span>
                    <Badge label={`Room ${item.room}`} color="#4A5568" bg="#EDF2F7" />
                    <span style={{ background:`${flagColor}22`, color:flagColor, border:`1px solid ${flagColor}44`, borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700, fontFamily:"'DM Mono', monospace", letterSpacing:"0.04em" }}>
                      {item.flag}
                    </span>
                  </div>
                  <p style={{ margin:"4px 0 0", fontSize:12, color:"#718096", fontFamily:"'DM Sans', sans-serif" }}>
                    {item.outgoing.slice(0, 80)}{item.outgoing.length > 80 ? "..." : ""}
                  </p>
                </div>
                <span style={{ color:"#A0AEC0", fontSize:18 }}>{expanded ? "▲" : "▼"}</span>
              </div>

              {expanded && (
                <div style={{ borderTop:"1px solid #E2E8F0", padding:"16px", background:"#FAFAFA" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    <div>
                      <div style={{ fontSize:11, color:"#718096", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em", marginBottom:6 }}>NIGHT STAFF NOTES</div>
                      <p style={{ fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif", margin:0, lineHeight:1.6 }}>{item.outgoing}</p>
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:"#2B6CB0", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em", marginBottom:6 }}>DAY TEAM PLAN</div>
                      <p style={{ fontSize:13, color:"#2D3748", fontFamily:"'DM Sans', sans-serif", margin:0, lineHeight:1.6 }}>{item.incoming}</p>
                    </div>
                  </div>

                  <div style={{ background:"#EBF8FF", border:"1px solid #90CDF4", borderRadius:8, padding:"12px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:11, color:"#2B6CB0", fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em" }}>AI HANDOVER BRIEFING</span>
                      <button onClick={() => generateHandoverBriefing(item)} disabled={loadingId === item.userId} style={{ background:"#2B6CB0", color:"#fff", border:"none", borderRadius:5, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", opacity:loadingId===item.userId?0.6:1 }}>
                        {loadingId===item.userId ? "Generating..." : "Get briefing"}
                      </button>
                    </div>
                    {handoverInsights[item.userId] ? (
                      <p style={{ fontSize:13, color:"#1A365D", fontFamily:"'DM Sans', sans-serif", margin:0, lineHeight:1.6 }}>{handoverInsights[item.userId]}</p>
                    ) : (
                      <p style={{ fontSize:12, color:"#4A5568", fontFamily:"'DM Sans', sans-serif", margin:0, fontStyle:"italic" }}>AI-generated handover summary for the incoming carer.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function NeuroCareApp() {
  const [view, setView] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { id:"dashboard", label:"Live Alerts", icon:"⚡" },
    { id:"residents", label:"All Residents", icon:"👥" },
    { id:"handover", label:"Shift Handover", icon:"🔄" },
  ];

  function handleSelectUser(user) {
    setSelectedUser(user);
    setView("profile");
  }

  return (
    <div style={{ minHeight:"100vh", background:"#F7FAFC", fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes pulse { 0%,100% { opacity:1; box-shadow:0 0 0 3px rgba(229,62,62,0.3); } 50% { opacity:0.7; box-shadow:0 0 0 6px rgba(229,62,62,0.1); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#F7FAFC; } ::-webkit-scrollbar-thumb { background:#CBD5E0; border-radius:3px; }
      `}</style>

      {/* Header */}
      <div style={{ background:"#1A202C", padding:"0 24px", display:"flex", alignItems:"center", gap:16, height:56, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#4299E1,#9F7AEA)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🧠</div>
          <span style={{ color:"#fff", fontFamily:"'Instrument Serif', serif", fontSize:18, fontWeight:400, letterSpacing:"0.01em" }}>NeuroCare AI</span>
          <span style={{ color:"#4A5568", fontSize:12, fontFamily:"'DM Mono', monospace" }}>v0.1 · Prototype</span>
        </div>

        <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
          {navItems.map(nav => (
            <button key={nav.id} onClick={() => { setView(nav.id); setSelectedUser(null); }} style={{ background: view===nav.id || (nav.id==="residents" && view==="profile") ? "#2D3748" : "none", color: view===nav.id || (nav.id==="residents" && view==="profile") ? "#fff" : "#A0AEC0", border:"none", borderRadius:8, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", gap:6 }}>
              <span>{nav.icon}</span>{nav.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft:16, display:"flex", alignItems:"center", gap:8 }}>
          <PulsingDot color="#48BB78" />
          <span style={{ color:"#68D391", fontSize:12, fontFamily:"'DM Mono', monospace" }}>LIVE</span>
        </div>
      </div>

      {/* Search bar — only on residents/dashboard views */}
      {(view === "residents" || view === "dashboard") && (
        <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"12px 24px" }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search residents by name, diagnosis, or room number..."
            style={{ width:"100%", maxWidth:500, padding:"8px 14px", border:"1px solid #E2E8F0", borderRadius:8, fontSize:13, fontFamily:"'DM Sans', sans-serif", color:"#2D3748", outline:"none", background:"#F7FAFC" }}
          />
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"24px 24px" }}>
        {view === "dashboard" && <AlertDashboard onSelect={handleSelectUser} />}
        {view === "residents" && <ResidentDirectory onSelect={handleSelectUser} searchQuery={searchQuery} />}
        {view === "profile" && selectedUser && <ResidentProfile user={selectedUser} onBack={() => setView("residents")} />}
        {view === "handover" && <ShiftHandover />}
      </div>
    </div>
  );
}
