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

describe('POST /candidates/search', () => {
  // Mock user object for authenticated requests
  const mockUser = { id: 1, username: 'testuser' };


  // Stub db.query to return the mock candidates data
  const mockCandidates = [
    { id: '1', name: 'John Doe', age: 30 },
    { id: '2', name: 'Jane Smith', age: 25 },
    // Add more mock candidates if needed
  ];


  it('should return search results with status 200', async () => {
    const searchQuery = 'John'; // Search query

    // Request body with the search query and page number
    const requestBody = {
      query: searchQuery,
      page: 1,
    };
    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

    // Make the request with the authentication token in the headers
    const response = await axios.post('http://localhost:8080/v1/candidates/search', requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Assert that the response status is 200
    expect(response.status).to.equal(200);
  });

  it('should return 401 for unauthenticated request', async () => {
    const searchQuery = 'John'; // Search query

    // Request body with the search query and page number
    const requestBody = {
      query: searchQuery,
      page: 1,
    };

    try {
      // Make the request without including the token in the headers
      await axios.post('http://localhost:8080/v1/candidates/search', requestBody);
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(401);
      // Assert that the error message contains "Unauthorized"
      expect(error.response.data.error).to.equal('Unauthorized');
    }
  });

  it('should return 500 for server/database errors', async () => {
    const searchQuery = 'John'; // Search query


    // Request body with the search query and page number
    const requestBody = {
      query: searchQuery,
      page: 1,
    };

    try {
        let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

      // Make the request with the authentication token in the headers
      await axios.post('http://localhost:8080/v1/candidates/search', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(500);
    }
  });
});
