import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import mysql from 'mysql';
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

app.get('/', (req, res) => {
  let html = '<html><head><title>Media Files</title>'
  html += '</head><body>';
  html += '<h1>Media Files</h1>';

  const query = "SELECT CONCAT('https://nostpic.com/media/', pubkey,'/', filename) AS mediafile FROM mediafiles ORDER BY id DESC";
  connection.query(query, (err, result) => {
    if (err) {
      console.error('An error occurred while executing the query');
      throw err;
    }
    for (let i = 0; i < result.length; i++) {
      const file = result[i].mediafile;
      if (file.endsWith('.mp4')) {
        html += `<video preload='metadata' controls style='max-height:300px; max-width:300px;'><source src='${file}' type='video/mp4'></video>`;
      } else {
        html += `<a href='${file}'><img src='${file}' loading='lazy' style='max-height:300px; max-width:300px;'></a>`;
      }
    }
    html += '</body></html>';
    res.send(html);
  });
});

app.listen(port, () => {
  connection.connect((err) => {
    if (err) {
      console.error('An error occurred while connecting to the DB');
      throw err;
    }
    console.log('Connected to the DB');
  });
  console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
  console.error(err);
});
