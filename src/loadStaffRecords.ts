import fs from 'fs';
import csvParser from 'csv-parser';
import { StaffRecord } from './models/staff';

export const loadStaffRecords = (csvFilePath: string): StaffRecord[] => {
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
};
