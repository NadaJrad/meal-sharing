const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const titles = await knex("meals").select("title");
    response.json(titles);
  } catch (error) {
    throw error;
  }
});


// GET all meals
router.get("/", async (req, res) => {
  try {
    const meals = await knex("meals");
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a meal by ID
router.get("/:id", async (req, res) => {
  try {
    const meal = await knex("meals").where({ id: req.params.id }).first();
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: "Meal not found" });
    }
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new meal
router.post("/", async (req, res) => {
  try {
    await knex("meals").insert(req.body);
    res.status(201).json({ message: "Meal created successfully" });
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update a meal by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const mealExists = await knex("meals").where({ id }).first();
    if (mealExists) {
      await knex("meals").where({ id }).update(req.body);
      res.json({ message: "Meal updated successfully" });
    } else {
      res.status(404).json({ error: "Meal not found" });
    }
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a meal by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const mealExists = await knex("meals").where({ id }).first();
    if (mealExists) {
      await knex("meals").where({ id }).del();
      res.json({ message: "Meal deleted successfully" });
    } else {
      res.status(404).json({ error: "Meal not found" });
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

