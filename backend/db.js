const mysql = require('mysql2');


// const connection = mysql.createConnection({
//     host: 'consulting.prabisha.com',
//     user: 'prabisha',
//     password: 'Prabisha@2024!',
//     database: 'prabisha_hr_solution'
//   });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prabisha-hr-solution'
});

  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
  
  module.exports=connection