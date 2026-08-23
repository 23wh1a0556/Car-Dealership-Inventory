const express = require("express");
const Vehicle = require("../models/Vehicle");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (make) filter.make = new RegExp(make, "i");
    if (model) filter.model = new RegExp(model, "i");
    if (category) filter.category = new RegExp(category, "i");

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filter);

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/purchase", protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({
        message: "Vehicle is out of stock",
      });
    }

    vehicle.quantity -= 1;
    await vehicle.save();

    res.json({
      message: "Vehicle purchased successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/restock", protect, adminOnly, async (req, res) => {
  try {
    const { quantity } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    vehicle.quantity += Number(quantity);
    await vehicle.save();

    res.json({
      message: "Vehicle restocked successfully",
      vehicle,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;