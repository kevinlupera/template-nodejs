const Pool = require("pg").Pool;
require('dotenv').config()

const pool = new Pool({
  user: process.env.USERDB,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: {},
});

const ROWS_BY_PAGE = 10;

async function getTotalEvents(idCategory) {
  let count = 0;
  let response;
  try {
    response = await pool.query(
      `SELECT count(id) FROM events where id_category = ${idCategory}`
    );
  } catch (error) {
    throw error;
  }
  return response ? response.rows[0].count : count;
}

const getEvents = async (request, response) => {
  try {
    const page = parseInt(request.params.page);
    const idCategory = parseInt(request.params.idCategory);
    const offset = page == 1 ? 0 : ROWS_BY_PAGE * page;
    const total = parseInt(await getTotalEvents(idCategory));
    const totalPages = total ? parseInt(total / ROWS_BY_PAGE) + 1 : 0;
    pool.query(
      `SELECT * FROM events where id_category = ${idCategory} ORDER BY id ASC LIMIT ${ROWS_BY_PAGE} OFFSET ${offset}`,
      (error, resutls) => {
        if (error) {
          throw error;
        }
        response
          .status(200)
          .json(formatResponse(resutls.rows, page, totalPages, total)).end();
      }
    );
  } catch (error) {
    console.log("🚀 ~ file: queries.js:47 ~ getEvents ~ error:", error);
    response.status(400).end();
  }
};

const getEvent = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    pool.query(
      `SELECT * FROM events where id = ${id} LIMIT 1`,
      (error, resutls) => {
        if (error) {
          throw error;
        }
        response
          .status(200)
          .json(resutls.rows[0]).end();
      }
    );
  } catch (error) {
    console.log("🚀 ~ file: queries.js:47 ~ getEvents ~ error:", error);
    response.status(400).end();
  }
};

const getCategories = (request, response) => {
  try {
    pool.query("SELECT * FROM categories ORDER BY id ASC", (error, resutls) => {
      if (error) {
        throw error;
      }
      response.status(200).json(formatResponse(resutls.rows)).end();
    });
  } catch (error) {
    console.log("🚀 ~ file: queries.js:67 ~ getCategories ~ error:", error);
    response.status(400).end();
  }
};
const formatResponse = (rows, page, totalPages, total) => {
  return {
    page,
    results: rows,
    total_pages: totalPages,
    total_results: total,
  };
};

module.exports = {
  getCategories,
  getEvents,
  getEvent
};
