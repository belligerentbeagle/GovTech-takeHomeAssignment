"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const axios_1 = __importDefault(require("axios"));
describe('POST /redeem', () => {
    it('should redeem a gift', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/redeem')
            .send({
            staffId: '1',
            teamName: 'Team A'
        });
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Gift redeemed successfully');
    }));
});
// Make a request to the /redeem endpoint
axios_1.default.post('http://localhost:3000/redeem', {
    staffId: 'your-staff-id',
    teamName: 'your-team-name' // this will not be present
})
    .then(response => {
    console.log(response.data);
})
    .catch(error => {
    console.error(error);
});
