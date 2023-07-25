const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../db');
const fs = require('fs');
const privateKey = fs.readFileSync('private_key.pem');

// Use chai's expect function for assertions
const expect = chai.expect;
const BASE_URL = 'http://localhost:8080/v1/';
describe('GET /candidates/:id', () => {
  // ... (rest of the test file remains the same)

  it('should return candidate details with status 200', async () => {
    const candidateId = 1;
    const mockCandidate = { id: candidateId, name: 'John Doe', age: 30 };

    // Create a mock authentication token
    const mockUser = { id: 1, username: 'testuser' };
    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

    const response = await axios.get(BASE_URL+`candidates/${candidateId}`, {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the request headers
    });

    // Assert that the response status is 200 using chai's expect function
    expect(response.status).to.equal(200);
  });
  it('should return candidate details with status 401 for unauthenticated request', async () => {
    const candidateId = 1;

    // Mock the db.query function to return an empty array for the given candidateId
    const dbQueryStub = sinon.stub(db, 'query').resolves([]);

    try {
        await axios.get(BASE_URL+`candidates/${candidateId}`, {
            headers: { Authorization: `Bearer hajlsdgfjalhgyuewgrjhasgdylgsadjfhgsady` }, // Include the token in the request headers
          });
    } catch (error) {
        if (error.isAxiosError) {
            // Assert that the error response object exists and has a status property
            expect(error.response).to.exist;
            expect(error.response.status).to.equal(401);
            // Assert that the error message contains "Unauthorized"
            expect(error.response.data.error).to.equal('Unauthorized');
          } else {
            // If the error is not an Axios error, it's unexpected
            throw error;
          }
    }

  });

  it('should return 404 for user not found', async () => {
    const candidateId = "adsfasdf";

    try {
        const mockUser = { id: 1, username: 'testuser' };
        let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
    
        const response = await axios.get(BASE_URL+`candidates/${candidateId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the request headers
        });
    } catch (error) {
      // Assert that the response status is 500 using chai's expect function
      expect(error.response.status).to.equal(404);

    }

  });
});
