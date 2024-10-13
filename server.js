const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Budget = require('./models/Budget');

const port = 3000;

app.use(express.json()); 
app.use('/', express.static('public'));
app.use(cors());

const url = 'mongodb://localhost:27017/personal_budget';

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json({ myBudget: budgets });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch budget data' });
    }
});

app.post('/budget', async (req, res) => {
    const { title, budget, color } = req.body;

    if (!title || budget === undefined || !color) {
        return res.status(400).json({ error: 'All fields (title, budget, color) are required' });
    }

    const newBudget = new Budget({ title, budget, color });

    try {
        const savedBudget = await newBudget.save();
        res.status(201).json(savedBudget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});