const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
    return hash;
}

async function main() {
    const passwordToHash = 'password123'; // Enter the password to hash here
    const hashedPassword = await hashPassword(passwordToHash);
    console.log(`Hashed password for '${passwordToHash}': ${hashedPassword}`);
}

main();