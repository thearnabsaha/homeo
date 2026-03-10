/**
 * Find and re-scrape any missing medicine data from the old app.
 * Targets: symptoms with no medicines and no sub-symptom medicines,
 * and sub-symptoms without medicines.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function postJSON(urlPath, body = {}, retries = 5) {
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
      timeout: 20000,
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          if (retries > 0) {
            setTimeout(() => postJSON(urlPath, JSON.parse(data), retries - 1).then(resolve).catch(reject), 3000);
          } else {
            resolve({ Status: -1 });
          }
        }
      });
    });
    req.on('error', (e) => {
      if (retries > 0) {
        setTimeout(() => postJSON(urlPath, JSON.parse(data), retries - 1).then(resolve).catch(reject), 3000);
      } else {
        resolve({ Status: -1 });
      }
    });
    req.on('timeout', () => req.destroy());
    req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const dataPath = path.join(__dirname, 'data', 'oldRepertory.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  let fixedSymptoms = 0;
  let fixedSubs = 0;
  let retrySubs = [];

  // Find all symptoms that have sub-symptoms but sub-symptoms lack medicines
  for (const rep of data.repertories) {
    for (const cond of rep.conditions) {
      for (const symp of cond.symptoms) {
        // Check sub-symptoms without medicines
        for (const sub of (symp.subSymptoms || [])) {
          if (!sub.medicines || sub.medicines.length === 0) {
            retrySubs.push({ rep, cond, symp, sub });
          }
        }

        // Check symptoms with no medicines and no sub-symptoms
        const hasMeds = symp.medicines && symp.medicines.length > 0;
        const hasSubs = symp.subSymptoms && symp.subSymptoms.length > 0;
        if (!hasMeds && !hasSubs) {
          // Try to fetch medicine data
          console.log('Re-fetching: ' + rep.name + ' > ' + cond.name + ' > ' + symp.name);
          await sleep(300);
          const res = await postJSON('/HMedicalTry/SubSymptomsOrResultList', {
            ConditionTypeID: cond.id,
            SymptomsTypeID: symp.id,
            SubSymptomsTypeID: 0,
          });
          if (res.Status === 2 && res.SymptomsRankListResult) {
            symp.medicines = res.SymptomsRankListResult.map(m => ({
              id: m.MedicineID, name: m.MedicineName, rank: m.Rank,
              repertory: m.RepertoryType, condition: m.ConditionType,
              symptom: m.SymptomsType, subSymptom: m.SubSymptomsType,
            }));
            fixedSymptoms++;
            console.log('  -> Got ' + symp.medicines.length + ' medicines');
          } else if (res.Status === 1 && res.SubSymptomsListResult) {
            symp.subSymptoms = res.SubSymptomsListResult.map(s => ({
              id: s.SubSymptomsTypeID, name: s.SubSymptomsType, symptomsTypeID: s.SymptomsTypeID,
            }));
            // Now fetch medicines for each sub-symptom
            for (const sub of symp.subSymptoms) {
              await sleep(200);
              const subRes = await postJSON('/HMedicalTry/SubSymptomsOrResultList', {
                ConditionTypeID: cond.id,
                SymptomsTypeID: sub.symptomsTypeID || symp.id,
                SubSymptomsTypeID: sub.id,
              });
              if (subRes.Status === 2 && subRes.SymptomsRankListResult) {
                sub.medicines = subRes.SymptomsRankListResult.map(m => ({
                  id: m.MedicineID, name: m.MedicineName, rank: m.Rank,
                  repertory: m.RepertoryType, condition: m.ConditionType,
                  symptom: m.SymptomsType, subSymptom: m.SubSymptomsType,
                }));
              }
            }
            fixedSymptoms++;
            console.log('  -> Got ' + symp.subSymptoms.length + ' sub-symptoms with medicines');
          } else {
            console.log('  -> Still no data (Status=' + res.Status + ')');
          }
        }
      }
    }
  }

  // Fix sub-symptoms without medicines
  for (const { rep, cond, symp, sub } of retrySubs) {
    console.log('Re-fetching sub: ' + rep.name + ' > ' + cond.name + ' > ' + symp.name + ' > ' + sub.name);
    await sleep(300);
    const res = await postJSON('/HMedicalTry/SubSymptomsOrResultList', {
      ConditionTypeID: cond.id,
      SymptomsTypeID: sub.symptomsTypeID || symp.id,
      SubSymptomsTypeID: sub.id,
    });
    if (res.Status === 2 && res.SymptomsRankListResult) {
      sub.medicines = res.SymptomsRankListResult.map(m => ({
        id: m.MedicineID, name: m.MedicineName, rank: m.Rank,
        repertory: m.RepertoryType, condition: m.ConditionType,
        symptom: m.SymptomsType, subSymptom: m.SubSymptomsType,
      }));
      fixedSubs++;
      console.log('  -> Got ' + sub.medicines.length + ' medicines');
    } else {
      console.log('  -> Still no data');
    }
  }

  console.log('\nFixed symptoms: ' + fixedSymptoms);
  console.log('Fixed sub-symptoms: ' + fixedSubs);

  // Also find symptoms that have sub-symptoms but NO direct medicines
  // These need sub-symptom drill-down, which we already have

  // Now count how many symptoms still have issues
  let stillEmpty = 0;
  let subsStillEmpty = 0;
  let totalMeds = 0;
  for (const rep of data.repertories) {
    for (const cond of rep.conditions) {
      for (const symp of cond.symptoms) {
        const hasMeds = symp.medicines && symp.medicines.length > 0;
        const hasSubs = symp.subSymptoms && symp.subSymptoms.length > 0;
        let subsHaveMeds = false;
        for (const sub of (symp.subSymptoms || [])) {
          if (sub.medicines && sub.medicines.length > 0) {
            subsHaveMeds = true;
            totalMeds += sub.medicines.length;
          } else if (hasSubs) {
            subsStillEmpty++;
          }
        }
        if (hasMeds) totalMeds += symp.medicines.length;
        if (!hasMeds && !subsHaveMeds) stillEmpty++;
      }
    }
  }

  console.log('Still empty symptoms: ' + stillEmpty);
  console.log('Still empty sub-symptoms: ' + subsStillEmpty);
  console.log('Total medicine entries: ' + totalMeds);

  // Save
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(path.join(__dirname, '../frontend/src/data/oldRepertory.json'), JSON.stringify(data, null, 2));
  console.log('Saved');
}

main().catch(console.error);
