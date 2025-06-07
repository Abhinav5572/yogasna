require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Get MongoDB URI from environment variables or use the direct connection string
const MONGO_DB = 'mongodb+srv://akshatofficial222:db_password@yogasna.9xwwj99.mongodb.net/?retryWrites=true&w=majority&appName=yogasna';
const PORT = process.env.PORT || 3001;

// In-memory mock database for testing when MongoDB is not available
let mockDatabase = [];

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', MONGO_DB ? MONGO_DB.replace(/db_password/, '********') : 'undefined');

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    console.log('Using in-memory mock database for testing');
  });

// Define a user schema and model
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  selectedBatch: String,
});

const User = mongoose.model('User', userSchema);

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

// POST endpoint for enrolling users
app.get('/', (req,res)=> {
    res.json({message:"Hello from server"});
});

app.post('/enroll', async (req, res) => {
  const { name, age, selectedBatch } = req.body;

  // Validate age between 18-65
  if (age < 18 || age > 65) {
    return res.status(400).json({ error: 'Age should be between 18 and 65.' });
  }

  try {
    let enrollmentResult;
    
    // Try to use MongoDB if connected, otherwise use mock database
    if (mongoose.connection.readyState === 1) { // 1 = connected
      // Create a new user instance
      const newUser = new User({ name, age, selectedBatch });

      // Save user data to MongoDB
      await newUser.save();
      enrollmentResult = true;
    } else {
      // Use mock database
      const newUser = { name, age, selectedBatch, id: Date.now().toString() };
      mockDatabase.push(newUser);
      console.log('Added to mock database:', newUser);
      enrollmentResult = true;
    }

    // Simulate payment (mock function)
    const paymentStatus = CompletePayment(name, age, selectedBatch);

    // Return success response if payment succeeds
    if (paymentStatus === 'success' && enrollmentResult) {
      return res.status(200).json({ message: 'Enrollment successful!' });
    } else {
      return res.status(500).json({ error: 'Payment failed. Enrollment unsuccessful.' });
    }
  } catch (error) {
    console.error('Error enrolling user:', error);
    return res.status(500).json({ error: 'Error enrolling user.' });
  }
});

// Mock function for payment (replace this with actual payment logic)
function CompletePayment(name, age, selectedBatch) {
  // Mock payment logic
  // This function would handle the payment process
  // For demonstration purposes, it returns 'success' in this example
  return 'success';
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
