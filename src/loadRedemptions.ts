import fs from 'fs';
import csvParser from 'csv-parser';
import { Redemption } from './models/redemption';
import { redemptions } from './app';

export const populateRedemptionsFromCsv = (csvFilePath: string) => {
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
    return results;
};
