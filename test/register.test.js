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

describe('POST /register', () => {
  // Mock user object for authenticated requests
  const mockUser = { id: 1, username: 'testuser' };


  it('should register with status 200', async () => {
    const candidateData = {
        first_name: 'John',
        last_name: 'Doe',
        email:'ex@apple.com',
        password:'1234'
      };
    const mockUser = { id: 1, username: 'testuser' };
    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key

    // Make the request with the authentication token in the headers
    const response = await axios.post('http://localhost:8080/v1/register', candidateData);

    // Assert that the response status is 200
    expect(response.status).to.equal(200);
    
  });


  it('should return 500 for server/database errors', async () => {
    const candidateData = {
        first_name: 'John',
        last_name: 'Doe',
        email:'ex@apple.com'
      };

    // Stub db.query to throw an error
   
    try {
      // Make the request with the authentication token in the headers
      let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
      await axios.post('http://localhost:8080/v1/register', candidateData);
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(500);
      // Assert that the error message contains "An error occurred while saving the candidate"
      expect(error.response.data.error).to.equal('Internal Server Error');
    }
  });
});
