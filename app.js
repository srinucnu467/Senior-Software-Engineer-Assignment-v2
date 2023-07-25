const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/user');
const swaggerSetup = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const SwaggerExpressMiddleware = require('swagger-express-middleware');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

app.use(express.json());
const corsOptions = {
    origin: process.env.BASE_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));
// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//routes
app.use('/v1', authRoutes);

app.get('/api/greet/:name', (req, res) => {
    const { name } = req.params;
    res.json({ message: `Hello, ${name}!` });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${server.address().port}`);
});

