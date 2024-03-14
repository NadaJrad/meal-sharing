const express = require("express");
const router = express.Router();
const knex = require("../database");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await knex("reviews");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new review
router.post("/", async (req, res) => {
  try {
    await knex("reviews").insert(req.body);
    res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a review by ID
router.get("/:id", async (req, res) => {
  try {
    const review = await knex("reviews").where({ id: req.params.id }).first();
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update a review by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reviewExists = await knex("reviews").where({ id }).first();
    if (reviewExists) {
      await knex("reviews").where({ id }).update(req.body);
      res.json({ message: "Review updated successfully" });
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a review by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reviewExists = await knex("reviews").where({ id }).first();
    if (reviewExists) {
      await knex("reviews").where({ id }).del();
      res.json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
