import request from 'supertest';
import app from '../src/app';

describe('GET /check-redemption', () => {
    it('should return 404 if staff ID is not found', async () => {
        const res = await request(app)
            .get('/check-redemption')
            .query({ staffId: 'nonexistent' });

        expect(res.statusCode).toEqual(404);
        expect(res.text).toEqual('Staff ID not found');
    });

});