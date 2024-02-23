import { loadStaffRecords } from '../src/loadStaffRecords';

describe('loadStaffRecords', () => {


    it('should handle empty CSV file', () => {
        const csvFilePath = 'tests/mockcsvs/empty.csv';
        const records = loadStaffRecords(csvFilePath);

        // Assert that no records are loaded
        expect(records).toHaveLength(0);
    });

    it('should handle CSV file with invalid data', () => {
        const csvFilePath = 'tests/mockcsvs/invalid.csv';
        const records = loadStaffRecords(csvFilePath);

        // Assert that only valid records are loaded
        expect(records).toHaveLength(0);
    });
});