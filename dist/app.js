"use strict";
/**
 * Represents the main application file.
 * This file contains the implementation of an Express server that handles redemption requests.
 * It imports various modules and defines routes for checking and processing redemptions.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffRecords = exports.redemptions = void 0;
const express_1 = __importDefault(require("express"));
const updateRedemptionsToCsv_1 = require("./updateRedemptionsToCsv");
const loadRedemptions_1 = require("./loadRedemptions");
const loadStaffRecords_1 = require("./loadStaffRecords");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.static('public'));
// Populate redemptions list on initialization
const redeemedCSVFilePath = './data/redeemed.csv';
exports.redemptions = (0, loadRedemptions_1.populateRedemptionsFromCsv)(redeemedCSVFilePath);
// populate staff records list
const staffID_team_mapping_filepath = './data/staff-id-to-team-mapping-long.csv';
exports.staffRecords = (0, loadStaffRecords_1.loadStaffRecords)(staffID_team_mapping_filepath);
/**
 * Finds the team name by staff ID.
 * @param staffId - The staff ID to search for.
 * @returns The team name associated with the staff ID, or undefined if not found.
 */
function findTeamNameByStaffId(staffId) {
    const record = exports.staffRecords.find(record => record.staff_pass_id === staffId);
    return record ? record.team_name : undefined;
}
/**
 * Handles the '/check-redemption' route.
 * Checks if a redemption can be made for a given staff ID.
 * @param req - The request object.
 * @param res - The response object.
 */
app.get('/check-redemption', (req, res) => {
    let staffID = req.query.staffId.toUpperCase();
    // if staffID does not exist in the staffRecords, send a 404
    if (!findTeamNameByStaffId(staffID)) {
        return res.status(404).send('Staff ID not found');
    }
    let incomingTeamName = findTeamNameByStaffId(staffID);
    //check redemption
    const redeemed = exports.redemptions.find(redemption => redemption.team_name === incomingTeamName);
    if (redeemed) {
        console.log(redeemed);
        console.log('Date:', (new Date(redeemed.collected_at)).toUTCString());
        return res.send(`Cannot collect!\nGift already redeemed by team ${redeemed.team_name} at ${new Date(redeemed.collected_at).toUTCString()}.`);
    }
    else {
        //allow person to redeem on by behalf of team now and add to redemptions list
        // Usage
        const newRedemption = {
            staff_pass_id: staffID,
            team_name: incomingTeamName || '',
            collected_at: Date.now() // Using current timestamp for simplicity
        };
        exports.redemptions.push(newRedemption);
        (0, updateRedemptionsToCsv_1.appendRedemptionToCsv)(redeemedCSVFilePath, newRedemption);
        res.send(`Can Collect!\nYou may redeem for team ${incomingTeamName}!\n Redemptions list updated with ${incomingTeamName} successfully.`);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
