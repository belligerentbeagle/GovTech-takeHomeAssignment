"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStaffRecords = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const loadStaffRecords = (csvFilePath) => {
    const records = [];
    fs_1.default.createReadStream(csvFilePath)
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => {
        records.push(data);
    })
        .on('end', () => {
        console.log('staff file has been processed.');
    });
    return records;
};
exports.loadStaffRecords = loadStaffRecords;
