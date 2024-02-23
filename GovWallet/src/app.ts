import express, { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import { Redemption } from './models/redemption';
import { StaffRecord } from './models/staff';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let redemptions: Redemption[] = [];

const populateRedemptionsFromCsv = (csvFilePath: string) => {
    const results: Redemption[] = [];

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data: Redemption) => {
            redemptions.push(data);
        })
        .on('end', () => {
            console.log('Redemptions list populated from CSV file.');
        });
};

// Populate redemptions list on initialization
populateRedemptionsFromCsv('./data/redeemed.csv');

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
    //   staffRecords.forEach(record => {
    //     console.log(record);
    //   });
    });
};

const findTeamNameByStaffId = (staffId: string): string | undefined => {
  const record = staffRecords.find(record => record.staff_pass_id === staffId);
  return record ? record.team_name : undefined;
};

// populate staff records list
const csvFilePath = './data/staff-id-to-team-mapping-long.csv';
loadStaffRecords(csvFilePath);


app.get('/check-redemption', (req: Request, res: Response) => {
    let staffID = (req.query.staffId as string).toUpperCase();
    // if staffID does not exist in the staffRecords, send a 404
    if (!findTeamNameByStaffId(staffID)) {
        return res.status(404).send('Staff ID not found');
    }

    let incomingTeamName = findTeamNameByStaffId(staffID);
    // console.log('incomingTeamName:', req.query.teamName);
    //check redemption
    const redeemed = redemptions.find(redemption => redemption.teamName === incomingTeamName);

    if (redeemed) {
        return res.send('Gift already redeemed by this team.');
    } else {
        //allow person to redeem on by behalf of team now and add to redemptions list
        redemptions.push({ staffId: '1', teamName: (incomingTeamName || '').toString(), redeemedAt: new Date() });
        res.send("Redemptions list updated with " + incomingTeamName?.toString() + " successfully.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/redeem', (req: Request, res: Response) => {
    const { staffId, teamName }: { staffId: string; teamName: string } = req.body; // how then do i make a request to this endpoint?
    
    const alreadyRedeemed = redemptions.find(redemption => redemption.teamName === teamName);

    if (alreadyRedeemed) {
        return res.status(400).send('Gift already redeemed by this team.');
    }

    redemptions.push({ staffId, teamName, redeemedAt: new Date() });
    res.send('Gift redeemed successfully.');
});

export default app;