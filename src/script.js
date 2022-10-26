const results = document.getElementById('results');
const getprice = document.getElementById('get-price');
const URL = 'http://localhost:3000';


getprice.addEventListener('click', () => {
    fetch(`http://localhost:3000`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data===', data.data);
        console.log('data===', data);
        if (data.message === 'success') {
        makeMePosts(data.data, results);
        }
      })
      .catch((err) => console.warn(err));
  });


  function makeMePosts(arr, destination) {
    const resultHTML = arr
      .map((post) => {
        return `
        <div>  
          <h3> Lowest price of a room= €${post.price}</h3>
        </div>
        `;
      })
      .join('');
    destination.innerHTML = resultHTML;
  }