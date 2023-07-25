const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Replace '../app' with the correct path to your Express app file
const db = require('../db'); // Replace '../db' with the correct path to your database file
const fs = require('fs');
const privateKey = fs.readFileSync('private_key.pem');
// Use chai's expect function for assertions
const expect = chai.expect;

describe('GET /candidates', () => {
  // Mock user object for authenticated requests
  const mockUser = { id: 1, username: 'testuser' };

  let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

  it('should return candidates with status 200', async () => {
    // Make the request with the authentication token in the headers
    const response = await axios.get('http://localhost:8080/v1/candidates', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Assert that the response status is 200
    expect(response.status).to.equal(200);
    // Assert that the response contains the expected candidates data
  });

  it('should return 401 for unauthenticated request', async () => {
    try {
      // Make the request without including the token in the headers
      await axios.get('http://localhost:8080/v1/candidates');
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(401);
      // Assert that the error message contains "Unauthorized"
      expect(error.response.data.error).to.equal('Unauthorized');
    }
  });

  it('should return 500 for server/database errors', async () => {
    // Stub db.query to throw an error

    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

    try {
      // Make the request with the authentication token in the headers
      await axios.get('http://localhost:8080/v1/candidates', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(500);
      // Assert that the error message contains "An error occurred while fetching the candidates"
      expect(error.response.data.error).to.equal('An error occurred while fetching the candidates');
    }
  });
});
