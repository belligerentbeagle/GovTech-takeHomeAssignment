import express, { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import { Redemption } from './models/redemption';
import { StaffRecord } from './models/staff';
import { writeFileSync, appendFileSync, existsSync } from 'fs';
import { parse } from 'fast-csv';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let redemptions: Redemption[] = [];

const populateRedemptionsFromCsv = (csvFilePath: string) => {
    const results: Redemption[] = [];

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data: any) => {
            // console.log('data:', data.staff_pass_id, data.team_name, data.collected_at);
            const newRedemption: Redemption = {
                staff_pass_id: data.staff_pass_id,
                team_name: data.team_name,
                collected_at: data.collected_at
            };
            redemptions.push(newRedemption);
        })
        .on('end', () => {
            console.log('Redemptions list populated from CSV file.');
        });
};

// Populate redemptions list on initialization
const redeemedCSVFilePath = './data/redeemed.csv';
populateRedemptionsFromCsv(redeemedCSVFilePath);

// Populate staff list from CSV
let staffRecords: StaffRecord[] = [];

const loadStaffRecords = (csvFilePath: string) => {
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (data: StaffRecord) => {
        staffRecords.push(data);
    })
    .on('end', () => {
      console.log('staff file has been processed.');
    });
};

const findTeamNameByStaffId = (staffId: string): string | undefined => {
  const record = staffRecords.find(record => record.staff_pass_id === staffId);
  return record ? record.team_name : undefined;
};

// populate staff records list
const staffID_team_mapping_filepath = './data/staff-id-to-team-mapping-long.csv';
loadStaffRecords(staffID_team_mapping_filepath);


app.get('/check-redemption', (req: Request, res: Response) => {
    let staffID = (req.query.staffId as string).toUpperCase();
    // if staffID does not exist in the staffRecords, send a 404
    if (!findTeamNameByStaffId(staffID)) {
        return res.status(404).send('Staff ID not found');
    }

    let incomingTeamName = findTeamNameByStaffId(staffID);
    
    //check redemption
    const redeemed = redemptions.find(redemption => redemption.team_name === incomingTeamName);

    if (redeemed) {
        return res.send(`Cannot collect!\nGift already redeemed by team ${redeemed.team_name} at ${new Date(redeemed.collected_at).toUTCString()}.`);
    } else {
        //allow person to redeem on by behalf of team now and add to redemptions list

        // Usage
        const newRedemption: Redemption = {
            staff_pass_id: staffID,
            team_name: incomingTeamName || '',
            collected_at: Date.now() // Using current timestamp for simplicity
        };

        redemptions.push(newRedemption);
        appendRedemptionToCsv(redeemedCSVFilePath, newRedemption);
        res.send(`Can Collect!\nYou may redeem for team ${incomingTeamName}!\n Redemptions list updated with ${incomingTeamName} successfully.`);

    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/**
 * 
 * 
 *  Updating CSV file after each new collection 
 * 
 * 
 * */

function appendRedemptionToCsv(filePath: string, redemption: Redemption) {
    // Check if the CSV file exists and has a header
    const fileExists = existsSync(filePath);
    
    // If the file doesn't exist, create it and add a header
    if (!fileExists) {
        writeFileSync(filePath, 'staff_pass_id,team_name,collected_at\n');
    }
    
    // Append the new redemption record to the CSV
    appendFileSync(filePath, `${redemption['staff_pass_id']},${redemption.team_name},${redemption.collected_at}\n`);
}


export default app;
