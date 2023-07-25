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

describe('POST /candidates', () => {
  // Mock user object for authenticated requests
  const mockUser = { id: 1, username: 'testuser' };


  it('should create a new candidate with status 200', async () => {
    const candidateData = {
        first_name: 'John',
        last_name: 'Doe',
        age: 30,
        owner_id : '380c0080-1a00-45d7-bccb-37a1c6dca0d1',
        department: 'IT',
        min_salary_expectation: 50000,
        max_salary_expectation: 80000,
        currency_id: '30b0751c-2997-11ee-be56-0242ac120002',
        address_id: '72fcdcda-2997-11ee-be56-0242ac120002',
      };
    const mockUser = { id: 1, username: 'testuser' };
    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

    // Make the request with the authentication token in the headers
    const response = await axios.post('http://localhost:8080/v1/candidates', candidateData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Assert that the response status is 200
    expect(response.status).to.equal(200);
    // Assert that the response contains the expected message and candidateId
    expect(response.data.message).to.equal('Candidate saved successfully');
    
  });

  it('should return 401 for unauthenticated request', async () => {
    const candidateData = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
      owner_id : '380c0080-1a00-45d7-bccb-37a1c6dca0d1',
      department: 'IT',
      min_salary_expectation: 50000,
      max_salary_expectation: 80000,
      currency_id: '30b0751c-2997-11ee-be56-0242ac120002',
      address_id: '72fcdcda-2997-11ee-be56-0242ac120002',
    };

    try {
      // Make the request without including the token in the headers
      const response = await axios.post('http://localhost:8080/v1/candidates', candidateData, {
      headers: { Authorization: `Bearer sdjfhasjkdhflkashdf` },
    });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(401);
      // Assert that the error message contains "Unauthorized"
      expect(error.response.data.error).to.equal('Unauthorized');
    }
  });

  it('should return 500 for server/database errors', async () => {
    const candidateData = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
      owner_id : '380c0080-1a00-45d7-bccb-37a1c6dca0d1',
      department: 'IT',
      min_salary_expectation: 50000,
      max_salary_expectation: 80000,
      currency_id: 'USD',
      address_id: 'address_id_123',
    };

    // Stub db.query to throw an error
   
    try {
      // Make the request with the authentication token in the headers
      let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
      await axios.post('http://localhost:8080/v1/candidates', candidateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(500);
      // Assert that the error message contains "An error occurred while saving the candidate"
      expect(error.response.data.error).to.equal('An error occurred while saving the candidate');
    }
  });
});
