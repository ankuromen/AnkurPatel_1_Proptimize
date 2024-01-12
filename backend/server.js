const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


mongoose.connect('mongodb+srv://ankurpatel:Password1234@cluster0.zouhqzt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully!');
});


const dataSchema = new mongoose.Schema({
  Name: String,
  Category: String,
  DOB: Date,
  Time: String,
});

const Data = mongoose.model('Data', dataSchema);


app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/data', async (req, res) => {
    try {
      const { Name, Category, DOB, Time } = req.body;
  
   
      if (!Name || !Category || !DOB || !Time) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
    
      const newData = new Data({
        Name,
        Category,
        DOB,
        Time,
      });
  
     
      const savedData = await newData.save();
  
      res.json(savedData);
    } catch (error) {
      console.error('Error storing data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
