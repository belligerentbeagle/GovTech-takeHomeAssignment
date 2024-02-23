import request from 'supertest';
import server from '../src/app';

describe('GET /check-redemption', () => {
    it('should return 404 if staff ID is not found', async () => {
        
        const res = await request(server)
            .get('/check-redemption')
            .query({ staffId: 'nonexistent' });

        

        expect(res.statusCode).toEqual(404);
        expect(res.text).toEqual('Staff ID not found');

        
    });

    

});

afterAll((done) => {
    server.close(done);
});