import request from 'supertest';
import app from '../src/app';
import axios from 'axios';

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

// Make a request to the /redeem endpoint
axios.post('http://localhost:3000/redeem', {
    staffId: 'your-staff-id',
    teamName: 'your-team-name' // this will not be present
})
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });