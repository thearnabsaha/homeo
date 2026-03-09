/**
 * Scrape all data from the old homeo app at homeo.ecloudinfo.in
 * Endpoints:
 *   POST /HMedicalTry/RepertoryList  → repertory types
 *   POST /HMedicalTry/ConditionList  {RepertoryTypeID} → conditions
 *   POST /HMedicalTry/SymptomsList   {ConditionTypeID} → symptoms
 *   POST /HMedicalTry/SubSymptomsOrResultList {ConditionTypeID, SymptomsTypeID, SubSymptomsTypeID:0} → sub-symptoms or results
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function postJSON(urlPath, body = {}, retries = 3) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'homeo.ecloudinfo.in',
      port: 443,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 15000,
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          if (retries > 0) {
            setTimeout(() => postJSON(urlPath, JSON.parse(data), retries - 1).then(resolve).catch(reject), 2000);
          } else {
            console.log('  [WARN] Parse error after retries for ' + urlPath);
            resolve({ Status: -1 });
          }
        }
      });
    });
    req.on('error', (e) => {
      if (retries > 0) {
        setTimeout(() => postJSON(urlPath, JSON.parse(data), retries - 1).then(resolve).catch(reject), 2000);
      } else {
        console.log('  [WARN] Network error after retries for ' + urlPath);
        resolve({ Status: -1 });
      }
    });
    req.on('timeout', () => { req.destroy(); });
    req.write(data);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const allData = {
    repertories: [],
  };

  // Step 1: Get all repertory types
  console.log('=== Step 1: Fetching repertory types ===');
  const repRes = await postJSON('/HMedicalTry/RepertoryList');
  if (repRes.Status !== 1 || !repRes.RepertoryListResult) {
    console.error('Failed to get repertories:', JSON.stringify(repRes).substring(0, 500));
    return;
  }
  const repertories = repRes.RepertoryListResult;
  console.log('Found ' + repertories.length + ' repertory types:');
  repertories.forEach((r) => console.log('  ' + r.RepertoryTypeID + ': ' + r.RepertoryType));

  // Step 2: For each repertory, get conditions
  for (const rep of repertories) {
    console.log('\n=== Repertory: ' + rep.RepertoryType + ' (ID=' + rep.RepertoryTypeID + ') ===');
    await sleep(300);

    const condRes = await postJSON('/HMedicalTry/ConditionList', {
      RepertoryTypeID: rep.RepertoryTypeID,
    });

    if (condRes.Status !== 1 || !condRes.ConditionListResult) {
      console.log('  No conditions found');
      continue;
    }

    const conditions = condRes.ConditionListResult;
    console.log('  ' + conditions.length + ' conditions');

    const repData = {
      id: rep.RepertoryTypeID,
      name: rep.RepertoryType,
      conditions: [],
    };

    // Step 3: For each condition, get symptoms
    for (const cond of conditions) {
      await sleep(200);

      const sympRes = await postJSON('/HMedicalTry/SymptomsList', {
        ConditionTypeID: cond.ConditionTypeID,
      });

      if (sympRes.Status !== 1 || !sympRes.SymptomsListResult) {
        console.log('    Condition ' + cond.ConditionType + ': no symptoms');
        continue;
      }

      const symptoms = sympRes.SymptomsListResult;
      const condData = {
        id: cond.ConditionTypeID,
        name: cond.ConditionType,
        symptoms: [],
      };

      // Step 4: For each symptom, get sub-symptoms or results
      for (const symp of symptoms) {
        await sleep(150);

        const subRes = await postJSON('/HMedicalTry/SubSymptomsOrResultList', {
          ConditionTypeID: cond.ConditionTypeID,
          SymptomsTypeID: symp.SymptomsTypeID,
          SubSymptomsTypeID: 0,
        });

        const sympData = {
          id: symp.SymptomsTypeID,
          name: symp.SymptomsType,
          subSymptoms: [],
          medicines: [],
        };

        if (subRes.Status === 1 && subRes.SubSymptomsListResult) {
          // Has sub-symptoms, get results for each
          sympData.subSymptoms = subRes.SubSymptomsListResult.map((sub) => ({
            id: sub.SubSymptomsTypeID,
            name: sub.SubSymptomsType,
            symptomsTypeID: sub.SymptomsTypeID,
          }));

          // Get medicines for each sub-symptom
          for (const sub of subRes.SubSymptomsListResult) {
            await sleep(150);
            const medRes = await postJSON('/HMedicalTry/SubSymptomsOrResultList', {
              ConditionTypeID: cond.ConditionTypeID,
              SymptomsTypeID: sub.SymptomsTypeID,
              SubSymptomsTypeID: sub.SubSymptomsTypeID,
            });

            if (medRes.Status === 2 && medRes.SymptomsRankListResult) {
              const subSym = sympData.subSymptoms.find((s) => s.id === sub.SubSymptomsTypeID);
              if (subSym) {
                subSym.medicines = medRes.SymptomsRankListResult.map((m) => ({
                  id: m.MedicineID,
                  name: m.MedicineName,
                  rank: m.Rank,
                  repertory: m.RepertoryType,
                  condition: m.ConditionType,
                  symptom: m.SymptomsType,
                  subSymptom: m.SubSymptomsType,
                }));
              }
            }
          }
        } else if (subRes.Status === 2 && subRes.SymptomsRankListResult) {
          // Direct results (no sub-symptoms)
          sympData.medicines = subRes.SymptomsRankListResult.map((m) => ({
            id: m.MedicineID,
            name: m.MedicineName,
            rank: m.Rank,
            repertory: m.RepertoryType,
            condition: m.ConditionType,
            symptom: m.SymptomsType,
            subSymptom: m.SubSymptomsType,
          }));
        }

        condData.symptoms.push(sympData);
      }

      console.log('    ' + cond.ConditionType + ': ' + condData.symptoms.length + ' symptoms');
      repData.conditions.push(condData);
    }

    allData.repertories.push(repData);
  }

  // Save
  const outPath = path.join(__dirname, 'data', 'oldRepertory.json');
  fs.writeFileSync(outPath, JSON.stringify(allData, null, 2));
  console.log('\n=== DONE ===');
  console.log('Saved to ' + outPath);

  // Print summary
  let totalConds = 0,
    totalSymps = 0,
    totalSubs = 0,
    totalMeds = 0;
  for (const rep of allData.repertories) {
    totalConds += rep.conditions.length;
    for (const cond of rep.conditions) {
      totalSymps += cond.symptoms.length;
      for (const symp of cond.symptoms) {
        totalSubs += symp.subSymptoms.length;
        totalMeds += symp.medicines.length;
        for (const sub of symp.subSymptoms) {
          if (sub.medicines) totalMeds += sub.medicines.length;
        }
      }
    }
  }
  console.log('Repertories: ' + allData.repertories.length);
  console.log('Conditions: ' + totalConds);
  console.log('Symptoms: ' + totalSymps);
  console.log('Sub-symptoms: ' + totalSubs);
  console.log('Medicine entries: ' + totalMeds);
}

main().catch(console.error);
