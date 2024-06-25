// backend/routes/courts.js

const express = require('express');
const Court = require('../models/Court');

const router = express.Router();

// Get nearby courts
router.get('/', async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const courts = await Court.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000, // 5 kilometers
        },
      },
    });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new court
router.post('/', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  const court = new Court({
    name,
    address,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
  });

  try {
    const newCourt = await court.save();
    res.status(201).json(newCourt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;