import { loadStaffRecords } from '../src/loadStaffRecords';

describe('loadStaffRecords', () => {
    it('should load staff records from CSV file', () => {
        const csvFilePath = '/path/to/staff.csv';
        const records = loadStaffRecords(csvFilePath);

        // Assert that the records are loaded correctly
        expect(records).toHaveLength(3);
        expect(records[0]).toEqual({ staffId: '001', name: 'John Doe' });
        expect(records[1]).toEqual({ staffId: '002', name: 'Jane Smith' });
        expect(records[2]).toEqual({ staffId: '003', name: 'Bob Johnson' });
    });

    it('should handle empty CSV file', () => {
        const csvFilePath = '/path/to/empty.csv';
        const records = loadStaffRecords(csvFilePath);

        // Assert that no records are loaded
        expect(records).toHaveLength(0);
    });

    it('should handle CSV file with invalid data', () => {
        const csvFilePath = '/path/to/invalid.csv';
        const records = loadStaffRecords(csvFilePath);

        // Assert that only valid records are loaded
        expect(records).toHaveLength(2);
        expect(records[0]).toEqual({ staffId: '001', name: 'John Doe' });
        expect(records[1]).toEqual({ staffId: '003', name: 'Bob Johnson' });
    });
});