const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, generateAccessToken,generateRefreshToken,verifyRefreshToken } = require('../middleware');
const dotenv = require('dotenv');
dotenv.config();

router.post('/register', async (req, res) => {
  try {
    const { first_name,last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let id = uuidv4();
    const [user] = await db.query('INSERT INTO user_t (id,first_name,last_name, email, password) VALUES (?, ?, ?, ?, ?)', [id,first_name,last_name, email, hashedPassword]);
    res.status(200).json({ id: id, first_name, email,"messsage":"Register Successfully" });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    let [user] = await db.query('SELECT * FROM user_t WHERE email = ? ', [email]);
    
    if (!Array.isArray(user)) {
      user = [user];
    }
    console.log(user);
    if (!user.length) {
      return res.status(500).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const accessToken =generateAccessToken({ id: user[0].id});
    const refreshToken = generateRefreshToken({ id: user[0].id});
    res.cookie('refreshToken', String(refreshToken), { httpOnly: true });
    res.status(200).json({ accessToken,"message":"Login Successfully" });
  } catch (err) {
    console.log("err");
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/logout', authenticateToken,(req, res) => {
  let refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }
  if (!refreshToken || refreshToken == null) {
    return res.status(400).json({ error: 'Refresh token not provided' });
  }
  try {
    // Verify the refresh token using the middleware method
    const decodedToken = verifyRefreshToken(refreshToken);

    // Assuming the decodedToken contains the user ID, you can delete the refresh token from the database or session storage.
    // Alternatively, if it's stored in a cookie, you can clear the cookie on the client-side.
    // For example, if it's stored as a cookie named 'refreshToken', you can clear it like this:
    res.clearCookie('refreshToken');

    // Respond with a success message indicating that the refresh token was invalidated
    res.status(200).json({ message: 'Refresh token invalidated successfully' });
  } catch (err) {
    console.error('Error invalidating refresh token:', err);
    res.status(500).json({ error: 'An error occurred while invalidating the refresh token' });
  }
});

router.post('/token/refresh', authenticateToken,(req, res) => {
  let refreshToken = req.body.refreshToken;
  if (!refreshToken || refreshToken == null) {
    refreshToken = req.cookies.refreshToken;
  }

  if (!refreshToken || refreshToken == null) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  try {
    // Verify the refresh token using the middleware method
    const decodedToken = verifyRefreshToken(refreshToken);

    // Assuming the decodedToken contains the user ID
    const userId = decodedToken.id;

    // Generate a new access token using the middleware function
    const newAccessToken = generateAccessToken({ id: userId });

    // Return the new access token
    res.status(200).json({ accessToken: newAccessToken,"message":"New Token Generated Successfully" });
  } catch (error) {
    // Handle token verification errors (e.g., token expired or invalid signature)
    res.status(401).json({ error: 'Invalid refresh token.' });
  }
});


router.post('/candidates', authenticateToken,async (req, res) => {
  try {
    // Extract candidate data from the request body
    const {
      first_name,
      last_name,
      age,
      department,
      min_salary_expectation,
      max_salary_expectation,
      currency_id,
      address_id,
    } = req.body;

    // Create a new candidate object with a UUID as the ID
    let owner_id = req.body.owner_id ? req.body.owner_id : req.user.id
    const candidate = {
      id: uuidv4(),
      first_name,
      last_name,
      owner_id,
      age,
      department,
      min_salary_expectation,
      max_salary_expectation,
      currency_id,
      address_id,
    };

    // MySQL INSERT query to save the candidate to the database
    const query = 'INSERT INTO candidate_t SET ?';
    let newCandidate = await db.query(query, candidate)
    res.status(200).json({ message: 'Candidate saved successfully', candidateId: newCandidate.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while saving the candidate' });
  }
});

router.get('/candidates/:id', authenticateToken,async (req, res) => {
  const candidateId = req.params.id;

  try {
    // Retrieve the specific candidate from the database using the candidateId

    const query = 'SELECT * FROM candidate_t WHERE id = ?';
    const candidates = await db.query(query, [candidateId]);

    // Check if the candidate with the given ID exists
    if (candidates.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Send the candidate details as the response
    res.json({ candidate: candidates[0] });
  } catch (err) {
    console.error('Error fetching candidate:', err);
    res.status(500).json({ error: 'An error occurred while fetching the candidate' });
  }
});

router.get('/candidates', authenticateToken,async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameters
  const itemsPerPage = 10; // Set the number of items to show per page

  try {
    // Calculate the offset for pagination
    const offset = (page - 1) * itemsPerPage;

    // Retrieve candidates from the database using pagination
    const query = 'SELECT * FROM candidate_t LIMIT ? OFFSET ?';
    const candidates = (await db.query(query, [itemsPerPage, offset]))[0].map((row) => row);

    // Send the candidates as the response
    res.json({ candidates });
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'An error occurred while fetching the candidates' });
  }
});

router.post('/candidates/search', authenticateToken,async (req, res) => {
  const { query, page } = req.body; // Get the search query and requested page number from the request body
  const itemsPerPage = 10; // Set the number of items to show per page

  try {
    // Calculate the offset for pagination
    const offset = (page - 1) * itemsPerPage;

    // Perform the search query and retrieve candidates from the database with pagination
    const searchQuery = 'SELECT * FROM candidate_t WHERE first_name LIKE ? OR last_name LIKE ? LIMIT ? OFFSET ?';
    const candidates = (await db.query(searchQuery, [`%${query}%`, `%${query}%`, itemsPerPage, offset]))[0].map((row) => row);

    // Send the candidates as the response
    res.json({ candidates });
  } catch (err) {
    console.error('Error searching candidates:', err);
    res.status(500).json({ error: 'An error occurred while searching the candidates' });
  }
});

router.delete('/candidates/:id', authenticateToken,async (req, res) => {
  const candidateId = req.params.id;

  try {
    // Check if the candidate with the given ID exists before attempting to delete
    const checkQuery = 'SELECT * FROM candidate_t WHERE id = ?';
    const candidates = await db.query(checkQuery, [candidateId]);

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Delete the candidate from the database
    const deleteQuery = 'DELETE FROM candidate_t WHERE id = ?';
    await db.query(deleteQuery, [candidateId]);

    // Send a success response
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('Error deleting candidate:', err);
    res.status(500).json({ error: 'An error occurred while deleting the candidate' });
  }
});

router.post('/candidates/:id', authenticateToken,async (req, res) => {
  const candidateId = req.params.id;

  try {
    // Check if the candidate with the given ID exists before attempting to update
    const checkQuery = 'SELECT * FROM candidate_t WHERE id = ?';
    const candidates = await db.query(checkQuery, [candidateId]);

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Extract candidate data from the request body for updating
    const {
      first_name,
      last_name,
      age,
      department,
      min_salary_expectation,
      max_salary_expectation,
      currency_id,
      address_id,
    } = req.body;

    // Update the candidate data in the database
    const updateQuery =
      'UPDATE candidate_t SET first_name = ?, last_name = ?, age = ?, department = ?, min_salary_expectation = ?, max_salary_expectation = ?, currency_id = ?, address_id = ? WHERE id = ?';

    await db.query(updateQuery, [
      first_name,
      last_name,
      age,
      department,
      min_salary_expectation,
      max_salary_expectation,
      currency_id,
      address_id,
      candidateId,
    ]);

    // Send a success response
    res.json({ message: 'Candidate updated successfully' });
  } catch (err) {
    console.error('Error updating candidate:', err);
    res.status(500).json({ error: 'An error occurred while updating the candidate' });
  }
});

module.exports = router;
