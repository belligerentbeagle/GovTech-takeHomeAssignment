import { Redemption } from '../src/models/redemption';
import { appendRedemptionToCsv } from '../src/updateRedemptionsToCsv';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

describe('appendRedemptionToCsv', () => {
    const filePath = 'tests/mockcsvs/mock.csv';

    beforeEach(() => {
        // Delete the test CSV file if it exists
        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }
    });

    it('should create a new CSV file with header if file does not exist', () => {
        const redemption: Redemption = {
            staff_pass_id: '123',
            team_name: 'Team A',
            collected_at: 12345678901,
        };

        appendRedemptionToCsv(filePath, redemption);

        const fileContent = readFileSync(filePath, 'utf-8');
        expect(fileContent).toEqual('staff_pass_id,team_name,collected_at\n123,Team A,12345678901\n');
    });

    it('should append the redemption record to an existing CSV file', () => {
        const existingContent = 'staff_pass_id,team_name,collected_at\n456,Team B,2022-02-02\n';
        writeFileSync(filePath, existingContent);

        const redemption = {
            staff_pass_id: '789',
            team_name: 'Team C',
            collected_at: 1234567890,
        };

        appendRedemptionToCsv(filePath, redemption);

        const fileContent = readFileSync(filePath, 'utf-8');
        expect(fileContent).toEqual(`${existingContent}789,Team C,1234567890\n`);
    });
});