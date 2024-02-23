"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendRedemptionToCsv = void 0;
const fs_1 = require("fs");
/**
 *
 *
 *  Updating CSV file after each new collection
 *
 *
 * */
function appendRedemptionToCsv(filePath, redemption) {
    // Check if the CSV file exists and has a header
    const fileExists = (0, fs_1.existsSync)(filePath);
    // If the file doesn't exist, create it and add a header
    if (!fileExists) {
        (0, fs_1.writeFileSync)(filePath, 'staff_pass_id,team_name,collected_at\n');
    }
    // Append the new redemption record to the CSV
    (0, fs_1.appendFileSync)(filePath, `${redemption['staff_pass_id']},${redemption.team_name},${redemption.collected_at}\n`);
}
exports.appendRedemptionToCsv = appendRedemptionToCsv;
