/**
 * Create a type
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} name the type name
 * @param {string} description the type description
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createType = async (client, name, description) => {
    return await client.query(`INSERT INTO type (name, description) VALUES ($1, $2)`, [name, description]);
}

/**
 * Get all the types
 * 
 * @param {pg.Pool} client the postgres client
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getTypes = async (client) => {
    return await client.query(`SELECT * FROM type`);
}

/**
 * Get a type by its id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the type id
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getType = async (client, id) => {
    return await client.query(`SELECT * FROM type WHERE id = $1`, [id]);
}

/**
 * Update a type
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the type
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.updateType = async (client, id, updateValues) => {
    const {name : newName, description : newDescription} = updateValues;

    let query = `UPDATE type SET `;
    let values = [];
    let index = 1;

    if(newName !== undefined){
        query += `name = $${index}, `;
        values.push(newName);
        index++;
    }

    if(newDescription !== undefined){
        query += `description = $${index}, `;
        values.push(newDescription);
        index++;
    }

    if (values.length === 0) {
        throw new Error("No values to update");
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${index}`;
    values.push(id);

    return await client.query(query, values);
}

/**
 * Delete a type by its id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the type
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteType = async (client, id) => {
    return await client.query(`DELETE FROM type WHERE id = $1`, [id]);
}

/**
 * Check if a type exists by its id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the type
 * 
 * @returns {Promise<boolean>} `true` if the type exists, `flase` otherwise
 */
module.exports.typeExistsId = async (client, id) => {
    const {rows} = await client.query(`SELECT * FROM type WHERE id= $1`, [id]);
    return rows.length == 1;
}

/**
 * Check if a type exists by its name
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} name the name of the type
 * 
 * @returns {Promise<boolean>} `true` if the type exists, `flase` otherwise
 */
module.exports.typeExistsName = async (client, name) => {
    const {rows} = await client.query(`SELECT * FROM type WHERE name = $1`, [name]);
    return rows.length == 1;
}