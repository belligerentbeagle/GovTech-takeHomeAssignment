"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_2 = require("fs");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.static('public'));
let redemptions = [];
const populateRedemptionsFromCsv = (csvFilePath) => {
    const results = [];
    fs_1.default.createReadStream(csvFilePath)
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => {
        // console.log('data:', data);
        redemptions.push(data);
    })
        .on('end', () => {
        console.log('Redemptions list populated from CSV file.');
    });
};
// Populate redemptions list on initialization
const redeemedCSVFilePath = './data/redeemed.csv';
populateRedemptionsFromCsv(redeemedCSVFilePath);
// Populate staff list from CSV
let staffRecords = [];
const loadStaffRecords = (csvFilePath) => {
    fs_1.default.createReadStream(csvFilePath)
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => {
        staffRecords.push(data);
    })
        .on('end', () => {
        console.log('staff file has been processed.');
    });
};
const findTeamNameByStaffId = (staffId) => {
    const record = staffRecords.find(record => record.staff_pass_id === staffId);
    return record ? record.team_name : undefined;
};
// populate staff records list
const staffID_team_mapping_filepath = './data/staff-id-to-team-mapping-long.csv';
loadStaffRecords(staffID_team_mapping_filepath);
app.get('/check-redemption', (req, res) => {
    let staffID = req.query.staffId.toUpperCase();
    // if staffID does not exist in the staffRecords, send a 404
    if (!findTeamNameByStaffId(staffID)) {
        return res.status(404).send('Staff ID not found');
    }
    let incomingTeamName = findTeamNameByStaffId(staffID);
    // console.log('incomingTeamName:', req.query.teamName);
    //check redemption
    const redeemed = redemptions.find(redemption => redemption.team_name === incomingTeamName);
    if (redeemed) {
        console.log(redeemed);
        return res.send(`Cannot collect!\nGift already redeemed by team ${redeemed.team_name} by ${redeemed['staff_pass_id']} at ${redeemed.collected_at}.`);
    }
    else {
        //allow person to redeem on by behalf of team now and add to redemptions list
        // Usage
        const newRedemption = {
            staff_pass_id: staffID,
            team_name: incomingTeamName || '',
            collected_at: Date.now() // Using current timestamp for simplicity
        };
        redemptions.push(newRedemption);
        appendRedemptionToCsv(redeemedCSVFilePath, newRedemption);
        res.send(`Can Collect!\nYou may redeem for team ${incomingTeamName}!\n Redemptions list updated with ${incomingTeamName} successfully.`);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
/**
 *
 *
 *  Updating CSV file after each new collection
 *
 *
 * */
function appendRedemptionToCsv(filePath, redemption) {
    // Check if the CSV file exists and has a header
    const fileExists = (0, fs_2.existsSync)(filePath);
    // If the file doesn't exist, create it and add a header
    if (!fileExists) {
        (0, fs_2.writeFileSync)(filePath, 'staff_pass_id,team_name,collected_at\n');
    }
    // Append the new redemption record to the CSV
    (0, fs_2.appendFileSync)(filePath, `${redemption['staff_pass_id']},${redemption.team_name},${redemption.collected_at}\n`);
}
exports.default = app;
