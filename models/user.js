const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(username, password) {
    return new Promise((resolve, reject) => {
      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return reject(err);
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) return reject(err);
          
          // Insert user into database
          const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
          db.run(sql, [username, hash], function(err) {
            if (err) return reject(err);
            resolve(this.lastID);
          });
        });
      });
    });
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, created_at FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static searchUsers(query, userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, username
        FROM users
        WHERE username LIKE ? AND id != ?
      `;
      db.all(sql, [`%${query}%`, userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = User;