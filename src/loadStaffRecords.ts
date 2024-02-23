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

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data: StaffRecord) => {
            records.push(data);
        })
        .on('end', () => {
            console.log('staff file has been processed.');
        });

    return records;
}
