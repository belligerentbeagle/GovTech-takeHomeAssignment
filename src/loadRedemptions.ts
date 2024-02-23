import fs from 'fs';
import csvParser from 'csv-parser';
import { Redemption } from './models/redemption';
import { redemptions } from './app';

/**
 * Populates the list of redemptions from a CSV file.
 * 
 * @param csvFilePath - The path to the CSV file.
 * @returns An array of Redemption objects.
 */
export function populateRedemptionsFromCsv(csvFilePath: string) {
    if (!fs.existsSync('./data/redeemed.csv')) {
        const headers = 'staff_pass_id,team_name,collected_at\n';
        fs.open('./data/redeemed.csv', 'w', function (err, file) {
            if (err) throw err;
            console.log('File is created successfully.');
        });

        // Write the headers to the file
        fs.writeFile('./data/redeemed.csv', headers, (err) => {
            if (err) throw err;
            console.log('File created with specified headers.');
        });
    }

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
}
