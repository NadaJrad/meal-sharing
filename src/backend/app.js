const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const mealsRouter = require("./api/meals");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const cors = require("cors");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/meals", mealsRouter);

//--------- homework 
// Future Meals
app.get("/future-meals", async (req, res) => {
  try {
    const futureMeals = await knex.raw("SELECT * FROM meals WHERE when > NOW()"); //const futureMeals = await knex("meals").where("when", ">", knex.raw("NOW()"));
    res.json(futureMeals || []);
  } catch (error) {
    console.error('Error retrieving future meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Past Meals
app.get("/past-meals", async (req, res) => {
  try {
    const pastMeals = await knex.raw("SELECT * FROM meals WHERE when < NOW()"); //const pastMeals = await knex("meals").where("when", "<", knex.raw("NOW()"));
    res.json(pastMeals || []);
  } catch (error) {
    console.error('Error retrieving past meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// All Meals
app.get("/all-meals", async (req, res) => {
  try {
    const allMeals = await knex("meals").orderBy("id");
    res.json(allMeals || []);
  } catch (error) {
    console.error('Error retrieving all meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// First Meal
app.get("/first-meal", async (req, res) => {
  try {
    const firstMeal = await knex("meals").orderBy("id").first();
    if (firstMeal) {
      res.json(firstMeal);
    } else {
      res.status(404).json({ error: 'No meals found' });
    }
  } catch (error) {
    console.error('Error retrieving first meal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Last Meal
app.get("/last-meal", async (req, res) => {
  try {
    const lastMeal = await knex("meals").orderBy("id", "desc").first();
    if (lastMeal) {
      res.json(lastMeal);
    } else {
      res.status(404).json({ error: 'No meals found' });
    }
  } catch (error) {
    console.error('Error retrieving last meal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file"
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;
