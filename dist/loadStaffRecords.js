"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStaffRecords = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
/**
 * Loads staff records from a CSV file.
 * @param csvFilePath - The path to the CSV file.
 * @returns An array of staff records.
 */
function loadStaffRecords(csvFilePath) {
    const records = [];
    try {
        if (!fs_1.default.existsSync(csvFilePath)) {
            console.log("File does not exist: " + csvFilePath);
            return records;
        }
        if (fs_1.default.statSync(csvFilePath).size === 0) {
            console.log("File is empty");
            return records;
        }
        if (fs_1.default.readFileSync(csvFilePath, 'utf8').split('\n').length < 2) {
            console.log("File may be corrupt");
            return records;
        }
        console.log("File condition - ok");
        fs_1.default.createReadStream(csvFilePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            records.push(data);
        });
    }
    catch (error) {
        console.error(error);
        return records;
    }
    return records;
}
exports.loadStaffRecords = loadStaffRecords;
