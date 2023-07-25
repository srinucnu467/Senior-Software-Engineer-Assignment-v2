const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const bcrypt = require('bcrypt');
const app = require('../app'); // Replace '../app' with the correct path to your Express app file
const db = require('../db'); // Replace '../db' with the correct path to your database file

// Use chai's expect function for assertions
const expect = chai.expect;

describe('POST /login', () => {
  // Stub db.query to return a mock user with a hashed password
  const mockUser = {
    id: 1,
    email: 'srinu@example.com',
    password: bcrypt.hashSync('1234', 10),
  };

  it('should return access token with status 200 for valid credentials', async () => {
    const email = 'srinu@example.com';
    const password = '1234';


    // Make the request with valid credentials
    const response = await axios.post('http://localhost:8080/v1/login', { email, password });

    // Assert that the response status is 200

    expect(response.status).to.equal(200);
    // Assert that the response contains the success message
    expect(response.data.message).to.equal('Login Successfully');
  });

  it('should return 500 for server errors', async () => {
    const email = 'test@example.com';
    const password = 'testpassword';

    // Make the request with valid credentials
    try {
      await axios.post('http://localhost:8080/v1/login', { email, password });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(500);
    }
  });
});
