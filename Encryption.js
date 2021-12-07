const crypto = require("crypto");
const key = crypto.randomBytes(32); // generates a random number of 32 bytes
const algorithm = "aes-256-cbc"; // set the algorithm 

/* the encrypt function recieves a string (the password) and returns the iv and the ciphertext (the encrypted password) */
const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16)); // iv ensures same password doesn't return same ciphertext
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv); //create cipher using aes-256-cbc, the key buffer, and iv
    const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final(), // password becomes a unique encryption
    ]);

    return {iv: iv.toString("hex"), password: encryptedPassword.toString("hex")}; // return the iv and the password
};

/* the decrypt function recieves the password and the iv based on the row the user would like to delete */
const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(encryption.iv, "hex")); // decrypt using aes-256-cbc, the key buffer, and the iv buffer
    const decryptedPassword = Buffer.concat([decipher.update(Buffer.from(encryption.password, "hex")), decipher.final(), // store the decrypted password as the decryption
    ]);

    return decryptedPassword.toString() // return the password
};

module.exports = {encrypt, decrypt};
