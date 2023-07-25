const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Replace '../app' with the correct path to your Express app file
const db = require('../db'); // Replace '../db' with the correct path to your database file
const fs = require('fs');
const privateKey = fs.readFileSync('private_key.pem');
const mockUser = { id: 1, username: 'testuser' };
// Use chai's expect function for assertions
const expect = chai.expect;

describe('POST /token/refresh', () => {


  it('should return 200 and a new access token when providing a valid refresh token', async () => {
    // Mock the request to contain the refreshToken in the body
    const mockRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4MGMwMDgwLTFhMDAtNDVkNy1iY2NiLTM3YTFjNmRjYTBkMSIsImlhdCI6MTY5MDIzNDQzMSwiZXhwIjoxNjkyODI2NDMxfQ.XyhMNs1k_Ejeaw0lb9R_bhWC8dTI5uIJwWPakurZXDUQ0XVR6Vf1Em_Qb_ukMhte3CCt1f1uqOZj57MGVtnjTPxavwCkJeuyREfhz7GNAPqiyoF4Suv8niBPM8NC2Sh6edFRfTOsfb_tqxhlt4y4gY59AATf1U4C-GZGxyXYHitSj4w7I4Yxg83Xr3tq54DrbunkHG2j6f1OYX2a0KQDfo406pDrT3cpRZUUER3rWnvSuCvGwcgULpgBS11VqtbVsHHD54_coVorXiXvfaWNSdSUbKe8myl1DxelrMZpOrMhS-kEPJOWgKgtIAsle_4vEF9nwzGQcnhkh8jGpRfb_g';

    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
    const response = await axios.post(`http://localhost:8080/v1/token/refresh`, { refreshToken: mockRefreshToken }, {
    headers: { Authorization: `Bearer ${token}`,
    Cookie: `refreshToken=${mockRefreshToken}` },
    });

    // Assert that the response status is 200
    expect(response.status).to.equal(200);
    // Assert that the response contains a new access token
    expect(response.data.accessToken).to.exist;
    // Assert that the response contains the success message
    expect(response.data.message).to.equal('New Token Generated Successfully');
  });

  it('should return 400 if refresh token is not provided', async () => {
    // Make the request to refresh the token without providing a refresh token
    try {
        let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
        const response = await axios.post(`http://localhost:8080/v1/token/refresh`, null, {
        headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(400);
      // Assert that the error message contains "Refresh token is required."
      expect(error.response.data.error).to.equal('Refresh token is required.');
    }
  });

  it('should return 401 for invalid refresh tokens', async () => {

    // Make the request to refresh the token with an invalid refresh token
    try {
      await axios.post('http://localhost:8080/v1/token/refresh', { refreshToken: 'invalid_refresh_token' }, {
        headers: { Authorization: 'Bearer mock_access_token' }, // Include the bearer token in the header
      });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(401);
      // Assert that the error message contains "Invalid refresh token."
      expect(error.response.data.error).to.equal('Unauthorized');
    }
  });


});
