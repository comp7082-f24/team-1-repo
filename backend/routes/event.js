const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assuming you have a User model

// Route to save event to user profile
router.post('/saveEvent', async (req, res) => {
    const { userId, event } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.events.push(event); // Assuming you have an events array in your user model
        await user.save();

        res.status(200).json({ message: 'Event saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving event', error });
    }
});

module.exports = router;