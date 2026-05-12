require('dotenv').config({ path: './.env.test' }); // Load environment variables

const mongoose = require('mongoose');
const Mocha = require('mocha');

// Function to connect to the test database
async function connectDB() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the test database...');
    }
}

// Set up Mocha hooks explicitly
const mocha = new Mocha();

// Connect to the test database before running tests
mocha.suite.beforeAll(async function() {
    try {
        await connectDB();
        console.log('Connected to the test database...');
    } catch (error) {
        console.error('Error connecting to the test database:', error);
    }
});

// Drop the database before each test
mocha.suite.beforeEach(async function() {
    try {
        await mongoose.connection.dropDatabase();
        console.log('Database dropped before each test...');
    } catch (error) {
        console.error('Error dropping database:', error);
    }
});

// Disconnect from the test database after all tests are done
mocha.suite.afterAll(async function() {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from the test database...');
    } catch (error) {
        console.error('Error disconnecting from the test database:', error);
    }
});
