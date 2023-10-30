module.exports.getUserByEmail = async (client, clientIdentifier) => {
  return await client.query(`SELECT * FROM "user" WHERE email = $1`, [
    clientIdentifier,
  ]);
};

module.exports.getUserByUsername = async (client, clientIdentifier) => {
  return await client.query(`SELECT * FROM "user" WHERE username = $1`, [
    clientIdentifier,
  ]);
};

module.exports.getUserById = async (client, id) => {
  return await client.query(`SELECT * FROM "user" WHERE id = $1`, [id]);
};

module.exports.postUser = async (
  client,
  username,
  email,
  password,
  firstname = null,
  lastname = null
) => {
  return await client.query(
    `INSERT INTO "user" (username, email, hashed_password ,firstname, lastname) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [username, email, password, firstname, lastname]
  );
};

module.exports.clientExists = async (client, id = null, username = null, email=null) => {
  let query = `SELECT count(*) AS no FROM "user" WHERE `;
  let values = [];
  let index = 1;
  if (id === null && username === null && email === null) {
    return false;
  }
  if (id !== null) {
    query += `id = $${index}, `;
    values.push(id);
    index++;
  }
  if (username !== null) {
    query += `username = $${index}, `;
    values.push(username);
    index++;
  }
  if (email !== null) {
    query += `email = $${index}, `;
    values.push(email);
    index++;
  } 
  query = query.slice(0, -2);
  const {rows} =  await client.query(query, values);
  return rows[0].no > 0;
};



module.exports.updateUser = async (client,userId, username,email,firstname,lastname,password) => {
  return await client.query(
    `UPDATE "user" 
    SET username = $1,
    email = $2, 
    firstname = $3, 
    lastname = $4, 
    hashed_password = $5 
    WHERE id = $6`, 
    [username,email,firstname,lastname,password,userId]);
};

module.exports.deleteUser = async (client, userId) => {
  return await client.query(`DELETE FROM "user" WHERE id = $1`, [userId]);
};

module.exports.getUsers = async (client) => {
  return await client.query(`SELECT * FROM "user"`);
};
