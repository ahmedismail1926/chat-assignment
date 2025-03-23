const db = require('../config/database');

class Friend {
  static createRequest(senderId, receiverId) {
    return new Promise((resolve, reject) => {
      // Check if request already exists
      const checkSql = `SELECT * FROM friend_requests 
                        WHERE (sender_id = ? AND receiver_id = ?) 
                        OR (sender_id = ? AND receiver_id = ?)`;
      
      db.get(checkSql, [senderId, receiverId, receiverId, senderId], (err, row) => {
        if (err) return reject(err);
        if (row) return reject(new Error('Friend request already exists'));
        
        // Check if already friends
        const checkFriendsSql = `SELECT * FROM friends 
                                WHERE (user_id = ? AND friend_id = ?) 
                                OR (user_id = ? AND friend_id = ?)`;
        
        db.get(checkFriendsSql, [senderId, receiverId, receiverId, senderId], (err, row) => {
          if (err) return reject(err);
          if (row) return reject(new Error('Already friends'));
          
          // Create request
          const sql = 'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)';
          db.run(sql, [senderId, receiverId], function(err) {
            if (err) return reject(err);
            resolve(this.lastID);
          });
        });
      });
    });
  }

  static getPendingRequests(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT fr.id, fr.sender_id, u.username as sender_name, fr.created_at
        FROM friend_requests fr
        JOIN users u ON fr.sender_id = u.id
        WHERE fr.receiver_id = ? AND fr.status = 'pending'
      `;
      db.all(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static acceptRequest(requestId, userId) {
    return new Promise((resolve, reject) => {
      // Begin transaction
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Get the request
        const getSql = 'SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ?';
        db.get(getSql, [requestId, userId], (err, request) => {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }
          if (!request) {
            db.run('ROLLBACK');
            return reject(new Error('Request not found'));
          }
          
          // Update request status
          const updateSql = 'UPDATE friend_requests SET status = "accepted" WHERE id = ?';
          db.run(updateSql, [requestId], function(err) {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }
            
            // Add to friends table (both ways)
            const addFriend1 = 'INSERT INTO friends (user_id, friend_id) VALUES (?, ?)';
            db.run(addFriend1, [request.receiver_id, request.sender_id], function(err) {
              if (err) {
                db.run('ROLLBACK');
                return reject(err);
              }
              
              const addFriend2 = 'INSERT INTO friends (user_id, friend_id) VALUES (?, ?)';
              db.run(addFriend2, [request.sender_id, request.receiver_id], function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return reject(err);
                }
                
                db.run('COMMIT', (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    return reject(err);
                  }
                  resolve(true);
                });
              });
            });
          });
        });
      });
    });
  }

  static rejectRequest(requestId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE friend_requests SET status = "rejected" WHERE id = ? AND receiver_id = ?';
      db.run(sql, [requestId, userId], function(err) {
        if (err) return reject(err);
        if (this.changes === 0) return reject(new Error('Request not found'));
        resolve(true);
      });
    });
  }

  static getFriends(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT f.friend_id as id, u.username
        FROM friends f
        JOIN users u ON f.friend_id = u.id
        WHERE f.user_id = ?
      `;
      db.all(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = Friend;