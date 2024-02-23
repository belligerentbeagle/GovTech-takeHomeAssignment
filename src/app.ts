import express, { Request, Response } from 'express';
import { Redemption } from './models/redemption';
import { StaffRecord } from './models/staff';
import { parse } from 'fast-csv';
import { appendRedemptionToCsv } from './updateRedemptionsToCsv';
import { populateRedemptionsFromCsv } from './loadRedemptions';
import { loadStaffRecords } from './loadStaffRecords';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Populate redemptions list on initialization
const redeemedCSVFilePath = './data/redeemed.csv';
export let redemptions: Redemption[] = populateRedemptionsFromCsv(redeemedCSVFilePath);

// populate staff records list
const staffID_team_mapping_filepath = './data/staff-id-to-team-mapping-long.csv';
export let staffRecords: StaffRecord[] = loadStaffRecords(staffID_team_mapping_filepath);

// Find team name by staff ID
function findTeamNameByStaffId(staffId: string): string | undefined {
    const record = staffRecords.find(record => record.staff_pass_id === staffId);
    return record ? record.team_name : undefined;
}


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
        console.log(redeemed); 
        console.log('Date:', (new Date(redeemed.collected_at)).toUTCString());
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

export default app;
