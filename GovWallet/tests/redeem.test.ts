import request from 'supertest';
import app from '../src/app';

describe('POST /redeem', () => {
    it('should redeem a gift', async () => {
        const response = await request(app)
            .post('/redeem')
            .send({
                staffId: '1',
                teamName: 'Team A'
            });
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Gift redeemed successfully');
    });
});
