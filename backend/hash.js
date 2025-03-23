const bcrypt = require('bcrypt');

const plainPassword = '111'; // or whatever password you want
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log("✅ Hashed password:", hash);
});
