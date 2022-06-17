import app from './src/app';
import 'dotenv/config';
const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
