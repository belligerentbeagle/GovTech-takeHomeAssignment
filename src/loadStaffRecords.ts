import fs from 'fs';
import csvParser from 'csv-parser';
import { StaffRecord } from './models/staff';

/**
 * Loads staff records from a CSV file.
 * @param csvFilePath - The path to the CSV file.
 * @returns An array of staff records.
 */
export function loadStaffRecords(csvFilePath: string): StaffRecord[] {
    const records: StaffRecord[] = [];

    try {
        if (!fs.existsSync(csvFilePath)) {
            console.log("File does not exist: " + csvFilePath);
            return records;
        } 
        if (fs.statSync(csvFilePath).size === 0) {
            console.log("File is empty");
            return records;
        }

        if (fs.readFileSync(csvFilePath, 'utf8').split('\n').length < 2) {
            console.log("File may be corrupt");
            return records;
        }

        console.log("File condition - ok");
        fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data: StaffRecord) => {
            records.push(data);
        });


    } catch (error) {
        console.error(error);
        return records;
    }


    return records;
}
