const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'sociosports-secret-key';
console.log('Using secret prefix:', JWT_SECRET.substring(0, 5));

const payload = { userId: 'test-user-id', role: 'ATHLETE' };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
console.log('Generated token prefix:', token.substring(0, 10));

jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
        console.error('Verification failed:', err.message);
    } else {
        console.log('Verification successful:', decoded);
    }
});

// Test with the fallback if the env didn't load (though index.ts loads it)
const FALLBACK_SECRET = 'sociosports-secret-key';
console.log('Testing fallback...');
jwt.verify(token, FALLBACK_SECRET, (err, decoded) => {
    if (err) {
        console.log('Fallback verification failed (as expected if env loaded):', err.message);
    } else {
        console.log('Fallback verification SUCCEEDED (this means process.env.JWT_SECRET was NOT used for signing!);');
    }
});
