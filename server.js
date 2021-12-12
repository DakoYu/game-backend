const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection success');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`app listning on port ${port}`)
});