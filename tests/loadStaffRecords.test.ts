import { loadStaffRecords } from '../src/loadStaffRecords';

describe('loadStaffRecords', () => {
    it('should load staff records from CSV file', () => {
        const csvFilePath = 'tests/mockcsvs/realdata.csv';
        const records = loadStaffRecords(csvFilePath);

        // Assert that the records are loaded correctly
        expect(records).toHaveLength(3);
        expect(records[0]).toEqual({ staff_pass_id: 'BOSS_6FDFMJGFV6YM', team_name: 'GRYFFINDOR' });
        expect(records[1]).toEqual({ staff_pass_id: 'MANAGER_P49NK2CS3B5G', team_name: 'GRYFFINDOR' });
        expect(records[2]).toEqual({ staff_pass_id: 'MANAGER_SEK8LLK8R8JL', team_name: 'HUFFLEPUFF' });
    });

    // it('should handle empty CSV file', () => {
    //     const csvFilePath = 'tests/mockcsvs/empty.csv';
    //     const records = loadStaffRecords(csvFilePath);

    //     // Assert that no records are loaded
    //     expect(records).toHaveLength(0);
    // });

    // it('should handle CSV file with invalid data', () => {
    //     const csvFilePath = 'tests/mockcsvs/invalid.csv';
    //     const records = loadStaffRecords(csvFilePath);

    //     // Assert that only valid records are loaded
    //     expect(records).toHaveLength(0);
    // });
});