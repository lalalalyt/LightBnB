const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require("pg");
const pool = new Pool({
  database: "lightbnb",
});

// the following assumes that you named your connection variable `pool`
pool.query(`SELECT title FROM properties LIMIT 10;`).then((response) => {});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(
      `
  select * 
  from users
  where email = $1
  `,
      [email]
    )
    .then((result) => {
      console.log("result", result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log({ err });
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(
      `
  select * 
  from users
  where id = $1
  `,
      [id]
    )
    .then((result) => {
      console.log("get id", result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(
      `
  insert into users (name, email, password) 
  values ($1, $2, $3)
  returning *
  `,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `
      select reservations.*, properties.*, avg(rating) as average_rating
      from reservations 
      join properties on reservations.property_id=properties.id
      join property_reviews on property_reviews.property_id = properties.id
      where reservations.guest_id = $1
      group by properties.id, reservations.id
      order by start_date
      limit $2;
    `,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

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
  select properties.*, avg(rating) as average_rating
  from properties 
  join property_reviews ON property_id = properties.id
  `;
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `where city like $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `where properties.owner_id = $${queryParams.length}`;
    } else {
      queryString += ` & properties.owner_id = $${queryParams.length}`;
    }
  }

  if (options.minimum_price_per_night) {
    let minPrice = Number(options.minimum_price_per_night)
    queryParams.push(minPrice);
    if (queryParams.length === 1) {
      queryString += `where properties.cost_per_night >= $${queryParams.length}`;
    } else {
      queryString += ` & properties.cost_per_night >= $${queryParams.length}`;
    }
  }

  if (options.maximum_price_per_night) {
    let maxPrice = Number(options.maximum_price_per_night)
    queryParams.push(maxPrice);
    if (queryParams.length === 1) {
      queryString += `where properties.cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += ` & properties.cost_per_night <= $${queryParams.length}`;
    }
  }

  queryString += `
  GROUP BY properties.id`;

  if (options.minimum_rating) {
    let minRating = Number(options.minimum_rating)
    queryParams.push(minRating);
    queryString += `
  having avg(rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
