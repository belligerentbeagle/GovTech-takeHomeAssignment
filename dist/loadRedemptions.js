"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateRedemptionsFromCsv = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const app_1 = require("./app");
/**
 * Populates the list of redemptions from a CSV file.
 *
 * @param csvFilePath - The path to the CSV file.
 * @returns An array of Redemption objects.
 */
function populateRedemptionsFromCsv(csvFilePath) {
    if (!fs_1.default.existsSync('./data/redeemed.csv')) {
        const headers = 'staff_pass_id,team_name,collected_at\n';
        fs_1.default.open('./data/redeemed.csv', 'w', function (err, file) {
            if (err)
                throw err;
            console.log('File is created successfully.');
        });
        // Write the headers to the file
        fs_1.default.writeFile('./data/redeemed.csv', headers, (err) => {
            if (err)
                throw err;
            console.log('File created with specified headers.');
        });
    }
    const results = [];
    fs_1.default.createReadStream(csvFilePath)
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => {
        // console.log('data:', data.staff_pass_id, data.team_name, data.collected_at);
        const newRedemption = {
            staff_pass_id: data.staff_pass_id,
            team_name: data.team_name,
            collected_at: data.collected_at
        };
        app_1.redemptions.push(newRedemption);
    })
        .on('end', () => {
        console.log('Redemptions list populated from CSV file.');
    });
    return results;
}
exports.populateRedemptionsFromCsv = populateRedemptionsFromCsv;
