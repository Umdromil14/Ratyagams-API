module.exports.createPlatform = async (client, code, description) => {
    return await client.query(
        `INSERT INTO platform (code, description) VALUES ($1, $2)`,
        [code, description]
    );
}

module.exports.getPlatform = async (client, code) => {
    return await client.query(
        `SELECT * FROM platform WHERE code = $1`,
        [code]
    );
}

module.exports.getAllPlatforms = async (client) => {
    return await client.query(
        `SELECT * FROM platform`
    );
}

module.exports.updatePlatform = async (client, code, newCode = null, description = null) => {
    if (newCode === null && description === null) {
        return;
    }

    let query = `UPDATE platform SET `;
    let values = [];
    let index = 1;

    if (newCode !== null) {
        query += `code = $${index}, `;
        values.push(newCode);
        index++;
    }
    if (description !== null) {
        query += `description = $${index}, `;
        values.push(description);
        index++;
    }
    query = query.slice(0, -2);
    query += ` WHERE code = $${index}`;
    values.push(code);
    
    return await client.query(query, values);
}

module.exports.deletePlatform = async (client, code) => {
    return await client.query(
        `DELETE FROM platform WHERE code = $1`,
        [code]
    );
}

module.exports.platformExists = async (client, code) => {
    const { rows } = await client.query(
        `SELECT count(*) AS no FROM platform WHERE code = $1`,
        [code]
    );
    return rows[0].no > 0;
}