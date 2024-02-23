// redemption.test.ts
import fs from 'fs';
import { populateRedemptionsFromCsv } from '../src/loadRedemptions';
import { Redemption } from '../src/models/redemption';

jest.mock('fs');
jest.mock('csv-parser');

describe('populateRedemptionsFromCsv', () => {
  // Mock data to represent a CSV file's content
  const mockCsvData = [
    { staff_pass_id: 'STAFF_1', team_name: 'TeamA', collected_at: '1609459200000' },
    { staff_pass_id: 'STAFF_2', team_name: 'TeamB', collected_at: '1709459200000' },
    { staff_pass_id: 'STAFF_3', team_name: 'TeamC', collected_at: '1509459200000' },
  ];

  const mockCsvFilePath = './mockdata/mock.csv';
  console.log("1");

  beforeAll(() => {
    // Create a mock CSV file
    // fs.writeFileSync(mockCsvFilePath, 'staff_pass_id,team_name,collected_at\n');
    fs.writeFileSync(mockCsvFilePath, mockCsvData.map(row => Object.values(row).join(',')).join('\n'));
    console.log("2");
  });

  it('should populate redemptions from a CSV file', () => {
    console.log("3");
    const csvFilePath = './mockdata/mock.csv';
    const results: Redemption[] = populateRedemptionsFromCsv(csvFilePath);
    
    console.log("4");
    //Check if we have the correct number of redemptions
    expect(results).toHaveLength(mockCsvData.length);
    expect(results[0]).toHaveProperty('staff_pass_id', 'STAFF_1');
    expect(results[0]).toHaveProperty('team_name', 'TeamA');
    expect(results[0]).toHaveProperty('collected_at', expect.any(Number));
  });

});
