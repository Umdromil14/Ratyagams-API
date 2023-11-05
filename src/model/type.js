module.exports.createType = async (client, name, description) => {
    return await client.query(`INSERT INTO type (name, description) VALUES ($1, $2)`, [name, description]);
}

module.exports.getTypes = async (client) => {
    return await client.query(`SELECT * FROM type`);
}

module.exports.getType = async (client, id) => {
    return await client.query(`SELECT * FROM type WHERE id = $1`, [id]);
}

module.exports.updateType = async (client, id, newId = null, newName = null, newDescription = null) => {
    let query = `UPDATE type SET `;
    let values = [];
    let index = 1;

    if(newId === null && newName === null && newDescription === null){
        return;
    }
    
    if(newId !== null){
        query += `id = $${index}, `;
        values.push(newId);
        index++;
    }

    if(newName !== null){
        query += `name = $${index}, `;
        values.push(newName);
        index++;
    }

    if(newDescription !== null){
        query += `description = $${index}, `;
        values.push(newDescription);
        index++;
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${index}`;
    values.push(id);

    return await client.query(query, values);
}

module.exports.deleteType = async (client, id) => {
    return await client.query("DELETE FROM type WHERE id = $1", [id]);
}