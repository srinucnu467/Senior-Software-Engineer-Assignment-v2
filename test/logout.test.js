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
const mockUser = { id: 1, username: 'testuser' };
describe('POST /logout', () => {


  it('should return 200 and invalidate the refresh token from the cookie', async () => {
    // Mock the request to contain the refreshToken in the cookie
    const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4MGMwMDgwLTFhMDAtNDVkNy1iY2NiLTM3YTFjNmRjYTBkMSIsImlhdCI6MTY5MDIzNDQzMSwiZXhwIjoxNjkyODI2NDMxfQ.XyhMNs1k_Ejeaw0lb9R_bhWC8dTI5uIJwWPakurZXDUQ0XVR6Vf1Em_Qb_ukMhte3CCt1f1uqOZj57MGVtnjTPxavwCkJeuyREfhz7GNAPqiyoF4Suv8niBPM8NC2Sh6edFRfTOsfb_tqxhlt4y4gY59AATf1U4C-GZGxyXYHitSj4w7I4Yxg83Xr3tq54DrbunkHG2j6f1OYX2a0KQDfo406pDrT3cpRZUUER3rWnvSuCvGwcgULpgBS11VqtbVsHHD54_coVorXiXvfaWNSdSUbKe8myl1DxelrMZpOrMhS-kEPJOWgKgtIAsle_4vEF9nwzGQcnhkh8jGpRfb_g';

    // Make the request to logout
    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
    const response = await axios.post(`http://localhost:8080/v1/logout`, null, {
    headers: { Authorization: `Bearer ${token}`,
    Cookie: `refreshToken=${refreshToken}` },
    });
    // Assert that the response status is 200
    expect(response.status).to.equal(200);
    // Assert that the response contains the success message
    expect(response.data.message).to.equal('Refresh token invalidated successfully');
  });

  it('should return 400 if refresh token is not provided', async () => {
    // Make the request to logout without providing a refresh token
    try {
    
        let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
        const response = await axios.post(`http://localhost:8080/v1/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(400);
      // Assert that the error message contains "Refresh token not provided"
      expect(error.response.data.error).to.equal('Refresh token not provided');
    }
  });

  it('should return 500 for server errors', async () => {
    // Stub jwt.verify to throw an error, simulating a server error
    
    // Mock the request to contain the refreshToken in the cookie
    const mockRefreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4MGMwMDgwLTFhMDAtNDVkNy1iY2NiLTM3YTFjNmRjYTBkMSIsImlhdCI6MTY5MDIxOTI5MiwiZXhwIjoxNjkyODExMjkyfQ.B2TbmIWoxj-FBloW_cUY6Hr1Uin7PJkiC9Lho3cOlq0axXQY_AazPyJXIeX1egly19ygre4hQ_Vijn4Bf404WmeNou_DcGBU6CRcaBBALr1yejzsITN7-51jfHrG1WXq28m7ClOlk5fyhCxx626cRvomplsuchQ1uzVEKd0rpLlbYuRLQIXJwo6bt6nwy-5oPckaT2NzLLlIwlYBoUabaFjPqt_aRNoG6Ib5HK0HlI0dTMrsWdy4IU-wfvfbjl_U7v9G7Kg51NnakuVHOS0mKRoYUtRuoVf68nG0NY_-6A9J9apWhSe2V5rjO3Kioob_91H0wVPrD4JZisQJ8By4cQ';
    let token = jwt.sign(mockUser, privateKey, { algorithm: 'RS256', expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
    
    const axiosConfig = {
      headers: {
        Cookie: `refreshToken=${mockRefreshToken}`,
        Authorization: `Bearer ${token}`, // Include the bearer token in the header
      },
    };

    // Make the request to logout
    try {
      await axios.post('http://localhost:8080/v1/logout', null, axiosConfig);
    } catch (error) {
      // Assert that the error response object exists and has a status property
      expect(error.response).to.exist;
      expect(error.response.status).to.equal(500);
      // Assert that the error message contains "An error occurred while invalidating the refresh token"
      expect(error.response.data.error).to.equal('An error occurred while invalidating the refresh token');
    }
  });
});
