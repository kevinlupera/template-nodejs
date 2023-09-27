const Pool = require("pg").Pool;

const pool = new Pool({
  user: "fl0user",
  host: "ep-soft-salad-49680337.us-east-2.aws.neon.tech",
  database: "teveplaydb",
  password: "U29ntQhXCKgd",
  port: 5432,
  ssl: {},
});

const ROWS_BY_PAGE = 10;

async function getTotalEvents(idCategory) {
  let count = 0;
  let response;
  try {
    response = await pool.query(`SELECT count(id) FROM events where id_category = ${idCategory}`);
  } catch (error) {
    throw error;
  }
  return response ? response.rows[0].count : count;
}

const getEvents = async (request, response) => {
  const page = parseInt(request.params.page);
  const idCategory = parseInt(request.params.idCategory);
  const offset = page == 1 ? 0 : ROWS_BY_PAGE * page;
  console.log("🚀 ~ file: queries.js:29 ~ getEvents ~ offset:", offset)
  const total = parseInt(await getTotalEvents(idCategory));
  console.log("🚀 ~ file: queries.js:30 ~ getEvents ~ total:", total)
  const totalPages = total ? parseInt(total / ROWS_BY_PAGE) + 1 : 0;
  console.log("🚀 ~ file: queries.js:31 ~ getEvents ~ totalPages:", totalPages)
  pool.query(
    `SELECT * FROM events where id_category = ${idCategory} ORDER BY id ASC LIMIT ${ROWS_BY_PAGE} OFFSET ${offset}`,
    (error, resutls) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .json(formatResponse(resutls.rows, page, totalPages, total));
    }
  );
};

const getCategories = (request, response) => {
  pool.query("SELECT * FROM categories ORDER BY id ASC", (error, resutls) => {
    if (error) {
      throw error;
    }
    console.log("🚀 ~ file: queries.js:49 ~ pool.query ~ resutls:", resutls)
    response.status(200).json(formatResponse(resutls.rows));
  });
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
};
