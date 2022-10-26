const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const data = require('./data');

// const mysql = require('mysql2/promise');
// const dbConfig = require('./dbConfig');

const {searchHotel, arr} = require('./searchHotel');

const PORT = process.env.SERVER_PORT || 3000;

const app = express();

// middleware
app.use(morgan('common'));
app.use(cors());
app.use(express.json());



app.get('/', (request, response) => {
  const searchQuery = data;
  if (searchQuery != null) {
    searchHotel(searchQuery)
    setTimeout(() =>     response.json({
      message: 'success',
      data: arr
    }), 11000 ) 
  //   response.json({
  //   message: 'success',
  //   data: arr.arr,
  // });
}
});

// app.get('/', (req, res) => {
//   const searchQuery = data;
//   // console.log('searchQuery===', searchQuery);
//   if (searchQuery != null) {

//     searchHotel(searchQuery)
//         .then(results => {
//           res.status(200);
//           res.json(results);
//         });
//   }else{
//     res.end();
//   }
// });



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
