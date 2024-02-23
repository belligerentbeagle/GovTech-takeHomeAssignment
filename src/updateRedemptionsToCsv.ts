import { Redemption } from './models/redemption';
import { writeFileSync, appendFileSync, existsSync } from 'fs';

/**
 * Appends a redemption record to a CSV file.
 * If the file doesn't exist, it creates the file and adds a header.
 *
 * @param filePath - The path to the CSV file.
 * @param redemption - The redemption record to append to the CSV.
 */
export function appendRedemptionToCsv(filePath: string, redemption: Redemption) {
    // Check if the CSV file exists and has a header
    const fileExists = existsSync(filePath);

    // If the file doesn't exist, create it and add a header
    if (!fileExists) {
        writeFileSync(filePath, 'staff_pass_id,team_name,collected_at\n');
    }

    // Append the new redemption record to the CSV
    appendFileSync(filePath, `${redemption['staff_pass_id']},${redemption.team_name},${redemption.collected_at}\n`);
}
