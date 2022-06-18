import app from './src/app';
import AppDataSource from './src/database/data-source';
import 'dotenv/config';
const PORT: number = Number(process.env.PORT) || 5000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error', err);
  });
