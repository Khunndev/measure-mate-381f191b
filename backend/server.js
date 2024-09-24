const express = require('express');
const cors = require('cors');
const measurementsRouter = require('./routes/measurements');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/measurements', measurementsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});