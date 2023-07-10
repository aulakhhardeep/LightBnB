const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// the following assumes that you named your connection variable `pool`
pool.query(`SELECT title FROM properties LIMIT 10;`)
  .then(response => {
    (response);
  });

const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null; // User with the given email does not exist
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query('SELECT * FROM users WHERE id = $1', [id])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  return pool
    .query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [user.name, user.email, user.password]
    )
    .then((result) => {
      const insertedUser = result.rows[0];
      return insertedUser;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @param {number} limit The maximum number of reservations to retrieve.
 * @return {Promise<[{}]>} A promise to the reservations.
 */


const getAllReservations = (guest_id) => {
  const limit = 10;
  return pool
    .query(
      `SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) AS average_rating
       FROM reservations
       JOIN properties ON reservations.property_id = properties.id
       JOIN property_reviews ON properties.id = property_reviews.property_id
       WHERE reservations.guest_id = $1
       GROUP BY properties.id, reservations.id
       ORDER BY reservations.start_date
       LIMIT $2`,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      throw err; // Propagate the error to the caller
    });
};


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  JOIN users ON properties.owner_id = users.id
  `;

  let whereClauseAdded = false;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    whereClauseAdded = true;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `${
      whereClauseAdded ? 'AND' : 'WHERE'
    } properties.owner_id = $${queryParams.length} `;
    whereClauseAdded = true;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `${
      whereClauseAdded ? 'AND' : 'WHERE'
    } properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length} `;
    whereClauseAdded = true;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `${
      whereClauseAdded ? 'AND' : 'WHERE'
    } avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams).then((res) => res.rows);
};



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = (property) => {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  const queryString = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  return pool.query(queryString, queryParams)
    .then((result) => {
      const savedProperty = result.rows[0];
      return savedProperty;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
