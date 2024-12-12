const mariadb = require('mysql2');

const connection = mariadb.createConnection({
    host : 'database-1.cru40cgcud6j.ap-northeast-2.rds.amazonaws.com',
    user : 'lolsearch',
    password : 'lolsearch',
    database : 'lol_search',
    dataStrings : true
});

module.exports = connection;