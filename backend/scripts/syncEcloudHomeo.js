const https = require("https");
const fs = require("fs");
const path = require("path");

const BASE = "https://homeo.ecloudinfo.in/HMedicalTry";
const DELAY = 200;
const EXISTING_PATH = path.join(__dirname, "..", "..", "frontend", "src", "data", "oldRepertory.json");

function post(urlPath, body = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(BASE + urlPath);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    }, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error(`Parse error for ${urlPath}`)); }
      });
    });
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error("Timeout")); });
    req.write(data);
    req.end();
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildIndex(data) {
  const repMap = new Map();
  const condMap = new Map();
  const symMap = new Map();
  const medKeys = new Set();

  for (const rep of data.repertories) {
    repMap.set(rep.name.toLowerCase(), rep);
    for (const cond of rep.conditions) {
      const ck = `${rep.name}|${cond.name}`.toLowerCase();
      condMap.set(ck, cond);
      for (const sym of cond.symptoms) {
        const sk = `${rep.name}|${cond.name}|${sym.name}`.toLowerCase();
        symMap.set(sk, sym);
        if (sym.medicines) {
          for (const m of sym.medicines) {
            medKeys.add(`${sk}|${m.name}`.toLowerCase());
          }
        }
        if (sym.subSymptoms) {
          for (const sub of sym.subSymptoms) {
            if (sub.medicines) {
              for (const m of sub.medicines) {
                medKeys.add(`${sk}|${sub.name}|${m.name}`.toLowerCase());
              }
            }
          }
        }
      }
    }
  }
  return { repMap, condMap, symMap, medKeys };
}

async function sync() {
  console.log("Loading existing data...");
  const existing = JSON.parse(fs.readFileSync(EXISTING_PATH, "utf-8"));
  const idx = buildIndex(existing);
  const repLookup = new Map(existing.repertories.map((r) => [r.name.toLowerCase(), r]));

  console.log(`Existing: ${existing.repertories.length} repertories, ${idx.medKeys.size} medicine entries\n`);

  console.log("Fetching remote repertory list...");
  const repRes = await post("/RepertoryList");
  const remoteReps = repRes.RepertoryListResult || [];
  console.log(`Remote: ${remoteReps.length} repertories\n`);

  let newReps = 0, newConds = 0, newSyms = 0, newMeds = 0, updatedMeds = 0;
  let nextId = 900000;

  for (const remoteRep of remoteReps) {
    const repKey = remoteRep.RepertoryType.toLowerCase();
    let localRep = repLookup.get(repKey);

    if (!localRep) {
      localRep = { id: nextId++, name: remoteRep.RepertoryType, conditions: [] };
      existing.repertories.push(localRep);
      repLookup.set(repKey, localRep);
      newReps++;
      console.log(`+ NEW REPERTORY: ${remoteRep.RepertoryType}`);
    }

    await sleep(DELAY);
    let condRes;
    try {
      condRes = await post("/ConditionList", { RepertoryTypeID: remoteRep.RepertoryTypeID });
    } catch { continue; }
    const remoteConds = condRes.ConditionListResult || [];
    const condLookup = new Map(localRep.conditions.map((c) => [c.name.toLowerCase(), c]));

    for (const remoteCond of remoteConds) {
      const condKey = remoteCond.ConditionType.toLowerCase();
      let localCond = condLookup.get(condKey);

      if (!localCond) {
        localCond = { id: nextId++, name: remoteCond.ConditionType, symptoms: [] };
        localRep.conditions.push(localCond);
        condLookup.set(condKey, localCond);
        newConds++;
        console.log(`  + NEW CONDITION: ${remoteRep.RepertoryType} > ${remoteCond.ConditionType}`);
      }

      await sleep(DELAY);
      let symRes;
      try {
        symRes = await post("/SymptomsList", { ConditionTypeID: remoteCond.ConditionTypeID });
      } catch { continue; }
      const remoteSyms = symRes.SymptomsListResult || [];
      const symLookup = new Map(localCond.symptoms.map((s) => [s.name.toLowerCase(), s]));

      for (const remoteSym of remoteSyms) {
        const symKey = remoteSym.SymptomsType.toLowerCase();
        let localSym = symLookup.get(symKey);

        if (!localSym) {
          localSym = { id: nextId++, name: remoteSym.SymptomsType, subSymptoms: [], medicines: [] };
          localCond.symptoms.push(localSym);
          symLookup.set(symKey, localSym);
          newSyms++;
          console.log(`    + NEW SYMPTOM: ${remoteCond.ConditionType} > ${remoteSym.SymptomsType}`);
        }

        await sleep(DELAY);
        let subRes;
        try {
          subRes = await post("/SubSymptomsOrResultList", {
            ConditionTypeID: remoteCond.ConditionTypeID,
            SymptomsTypeID: remoteSym.SymptomsTypeID,
            SubSymptomsTypeID: 0,
          });
        } catch { continue; }

        if (subRes.Status === 2) {
          const remoteMeds = subRes.SymptomsRankListResult || [];
          const existingMedMap = new Map((localSym.medicines || []).map((m) => [m.name.toLowerCase(), m]));

          for (const rm of remoteMeds) {
            const existingMed = existingMedMap.get(rm.MedicineName.toLowerCase());
            if (!existingMed) {
              if (!localSym.medicines) localSym.medicines = [];
              localSym.medicines.push({
                id: rm.MedicineID,
                name: rm.MedicineName,
                rank: rm.Rank,
                repertory: remoteRep.RepertoryType,
                condition: remoteCond.ConditionType,
                symptom: remoteSym.SymptomsType,
                subSymptom: "",
              });
              newMeds++;
            } else if (existingMed.rank !== rm.Rank) {
              existingMed.rank = rm.Rank;
              updatedMeds++;
            }
          }
        } else if (subRes.Status === 1 && subRes.SubSymptomsListResult) {
          const remoteSubs = subRes.SubSymptomsListResult;
          const subLookup = new Map((localSym.subSymptoms || []).map((s) => [s.name.toLowerCase(), s]));

          for (const remoteSub of remoteSubs) {
            const subKey = remoteSub.SubSymptomsType.toLowerCase();
            let localSub = subLookup.get(subKey);

            if (!localSub) {
              localSub = { id: nextId++, name: remoteSub.SubSymptomsType, medicines: [] };
              if (!localSym.subSymptoms) localSym.subSymptoms = [];
              localSym.subSymptoms.push(localSub);
              subLookup.set(subKey, localSub);
              newSyms++;
            }

            await sleep(DELAY);
            let subSubRes;
            try {
              subSubRes = await post("/SubSymptomsOrResultList", {
                ConditionTypeID: remoteCond.ConditionTypeID,
                SymptomsTypeID: remoteSym.SymptomsTypeID,
                SubSymptomsTypeID: remoteSub.SubSymptomsTypeID,
              });
            } catch { continue; }

            if (subSubRes.Status === 2) {
              const remoteMeds = subSubRes.SymptomsRankListResult || [];
              const existingMedMap = new Map((localSub.medicines || []).map((m) => [m.name.toLowerCase(), m]));

              for (const rm of remoteMeds) {
                const existingMed = existingMedMap.get(rm.MedicineName.toLowerCase());
                if (!existingMed) {
                  if (!localSub.medicines) localSub.medicines = [];
                  localSub.medicines.push({
                    id: rm.MedicineID,
                    name: rm.MedicineName,
                    rank: rm.Rank,
                    repertory: remoteRep.RepertoryType,
                    condition: remoteCond.ConditionType,
                    symptom: remoteSym.SymptomsType,
                    subSymptom: remoteSub.SubSymptomsType,
                  });
                  newMeds++;
                } else if (existingMed.rank !== rm.Rank) {
                  existingMed.rank = rm.Rank;
                  updatedMeds++;
                }
              }
            }
          }
        }
      }
    }

    process.stdout.write(`  [${remoteRep.RepertoryTypeID}] ${remoteRep.RepertoryType} - synced\n`);
  }

  console.log("\n=== SYNC COMPLETE ===");
  console.log(`New repertories: ${newReps}`);
  console.log(`New conditions: ${newConds}`);
  console.log(`New symptoms/sub-symptoms: ${newSyms}`);
  console.log(`New medicine links: ${newMeds}`);
  console.log(`Updated medicine ranks: ${updatedMeds}`);

  if (newReps + newConds + newSyms + newMeds + updatedMeds > 0) {
    fs.writeFileSync(EXISTING_PATH, JSON.stringify(existing, null, 2));
    console.log(`\nUpdated ${EXISTING_PATH}`);
  } else {
    console.log("\nNo changes detected - data is already up to date.");
  }
}

sync().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
