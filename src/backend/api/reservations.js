const express = require("express");
const router = express.Router();
const knex = require("../database");

// GET all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservations");
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await knex("reservations").where({ id: req.params.id }).first();
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new reservation
router.post("/", async (req, res) => {
  try {
    await knex("reservations").insert(req.body);
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update a reservation by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reservationExists = await knex("reservations").where({ id }).first();
    if (reservationExists) {
      await knex("reservations").where({ id }).update(req.body);
      res.json({ message: "Reservation updated successfully" });
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a reservation by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reservationExists = await knex("reservations").where({ id }).first();
    if (reservationExists) {
      await knex("reservations").where({ id }).del();
      res.json({ message: "Reservation deleted successfully" });
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
