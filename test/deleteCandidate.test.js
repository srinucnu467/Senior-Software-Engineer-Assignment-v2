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

describe('DELETE /candidates/:id', () => {
  // Mock user object for authenticated requests
  const mockUser = { id: 1, username: 'testuser' };


  it('should delete the candidate with status 200', async () => {
    const candidateId = '1';
    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

    // Make the request with the authentication token in the headers
    const response = await axios.delete(`http://localhost:8080/v1/candidates/${candidateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Assert that the response status is 200
    expect(response.status).to.equal(200);
    // Assert that the response contains the expected message
    expect(response.data.message).to.equal('Candidate deleted successfully');
  });

  it('should return 404 for attempting to delete a non-existent candidate', async () => {
    const candidateId = 'non_existent_id';
    try {
      // Make the request with the authentication token in the headers
      let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

      await axios.delete(`http://localhost:8080/v1/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(404);
      // Assert that the error message contains "Candidate not found"
      expect(error.response.data.error).to.equal('Candidate not found');
    }
  });

  it('should return 401 for unauthenticated request', async () => {
    const candidateId = '1';

    try {
      // Make the request without including the token in the headers
      await axios.delete(`http://localhost:8080/v1/candidates/${candidateId}`);
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(401);
      // Assert that the error message contains "Unauthorized"
      expect(error.response.data.error).to.equal('Unauthorized');
    }
  });

  it('should return 500 for server/database errors', async () => {
    const candidateId = '1';


    try {
        let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

      // Make the request with the authentication token in the headers
      await axios.delete(`http://localhost:8080/v1/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(500);
      // Assert that the error message contains "An error occurred while deleting the candidate"
      expect(error.response.data.error).to.equal('An error occurred while deleting the candidate');
    }
  });
});
