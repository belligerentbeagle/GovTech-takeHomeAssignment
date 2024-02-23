import express, { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import { Redemption } from './models/redemption';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


const populateRedemptionsFromCsv = (csvFilePath: string) => {
    const results: Redemption[] = [];

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data) => results.push({
            staffId: data.staffId,
            teamName: data.teamName,
            redeemedAt: new Date(data.redeemedAt)  // Assuming 'redeemedAt' is in a suitable format
        }))
        .on('end', () => {
            redemptions = results;
            console.log('Redemptions list populated from CSV file.');
        });
};

// Populate redemptions list on initialization
populateRedemptionsFromCsv('./data/staff-id-to-team-mapping.csv');

app.get('/', (req: Request, res: Response) => {
    res.send("Hello there from Redemption checker!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


let redemptions: Redemption[] = [];

// const populateRedemptionsFromCsv = (csvFilePath)

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