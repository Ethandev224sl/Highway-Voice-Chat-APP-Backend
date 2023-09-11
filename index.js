const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const PORT = 3000; // or any other port number you prefer
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
  