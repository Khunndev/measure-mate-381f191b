const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const measurementsRouter = require('./routes/measurements');

const app = express();
const port = process.env.PORT || 3334;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/measurements', measurementsRouter);

app.get('/health', (req, res) => {
  res.send('OK');
});

async function startServer() {
  await connectDB();
  
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

startServer();
