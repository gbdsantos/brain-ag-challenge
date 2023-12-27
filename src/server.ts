import express from 'express';

const app = express();

app.get('/ping', (request, response) => {
  return response.status(200).send('Server is running.');
});

app.listen(3333, () => {
  console.log('🚀 HTTP Server Running!')
});
