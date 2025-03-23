const db = require('../config/database');

class Message {
  static create(senderId, receiverId, content) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)';
      db.run(sql, [senderId, receiverId, content], function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  }

  static getConversation(userId, friendId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, m.read,
               s.username as sender_name, r.username as receiver_name
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        JOIN users r ON m.receiver_id = r.id
        WHERE (m.sender_id = ? AND m.receiver_id = ?) OR
              (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
      `;
      db.all(sql, [userId, friendId, friendId, userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getNewMessages(userId, lastMessageId = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, m.read,
               s.username as sender_name
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        WHERE m.receiver_id = ? AND m.id > ? AND m.read = 0
        ORDER BY m.created_at ASC
      `;
      db.all(sql, [userId, lastMessageId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static markAsRead(messageId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE messages SET read = 1 WHERE id = ? AND receiver_id = ?';
      db.run(sql, [messageId, userId], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
}

module.exports = Message;