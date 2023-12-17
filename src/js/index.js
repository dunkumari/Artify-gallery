const navbar = document.getElementById("nav");
const brand = document.getElementById("brand");
const searchKey = document.getElementById("searchKey");
const searchBtn = document.getElementById("searchBtn");
const searchQuery = document.getElementById("searchQuery");
const column1 = document.getElementById("col-1");
const column2 = document.getElementById("col-2");
const column3 = document.getElementById("col-3");
const errorGrid = document.getElementById("errorGrid");
const modalBody = document.getElementById("modelBody");
const imageViewLink = document.getElementById("imageViewLink");
var orderByValue = '';

// Apis from unsplash
const API_KEY = "6cUZ7o2kEMy3Ah8FvG7V9kayQGNWezgtsXoGCSN8TwY";
const apiUrl = `https://api.unsplash.com/photos/?client_id=${API_KEY}&per_page=25&page=1&orientation=landscape&auto=format&query='classic art'`;
const searchUrl = "https://api.unsplash.com/search/photos/?client_id="+API_KEY+"&query=";

let imageURLS = [];

const fetchAndDisplayImages = async (category) => {
  try {
    let apiUrl;
    if (category === 'search') {
      apiUrl = `${searchUrl}${searchKey.value}`;
    } else {
      apiUrl = `https://api.unsplash.com/photos/?client_id=${API_KEY}&per_page=25&page=1&orientation=potrait&query=${category}`;
    }
  
    imageURLS = [];
    const data = await fetchData(apiUrl);
    displayImage(data);
    //console.log(data);
  } catch (error) {
    handleError(error);
  }
};

window.onload = (event) => {
  fetchAndDisplayImages('modern-art'); 
};

document.getElementById('modern-art').addEventListener('click', function () {
  fetchAndDisplayImages('modern-art');
});

document.getElementById('classics').addEventListener('click', function () {
  fetchAndDisplayImages('classics');
});

document.getElementById('sculptures').addEventListener('click', function () {
  fetchAndDisplayImages('sculptures');
});

document.getElementById('abstract-art').addEventListener('click', function () {
  fetchAndDisplayImages('abstract-art');
});


const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const myJson = await response.json();
    const imageArrays = myJson.map(element => ({
      url: element.urls.small,
      user: element.user,
    }));
    return imageArrays;
  } catch (error) {
    handleError(error);
    return [];
  }
}

var handleError = function(err) {
  console.warn(err);
  errorGrid.innerHTML = "<h4>Unable to fetch data" +err+"</h4>"
}

function displayImage (imageURLS , category) {
  errorGrid.innerHTML = "";
  if(imageURLS.length == 0){
    errorGrid.innerHTML = "<h4>Unable to fetch data" +err+"</h4>"
    return;

  }

  column1.innerHTML = "";
  column2.innerHTML = "";
  column3.innerHTML = "";

  imageURLS.forEach((imageData,index) =>{
         var image = document.createElement('img');
         image.src = imageData.url;
         image.className="mt-3";
         image.setAttribute("width" , "100%");
         image.onclick = () => displayFullImage(imageData.url ,imageData.user);
        
         if((index +1) %3 ==0 ){
          column1.appendChild(image);
         }
         if((index +2) %3 ==0 ){
          column2.appendChild(image);
         }
         if((index +3) %3 ==0 ){
          column3.appendChild(image);
         }
  });
}
function displayFullImage(src, user) {
  var image = document.createElement('img');
  image.src = src;
  image.className = "mt-4";
  image.setAttribute("width", "100%");

  var userDetails = document.createElement('div');
  userDetails.innerHTML = `
    <p> Name: ${user.first_name || 'N/A'}</p>
    <p>Instagram: ${user.instagram_username || 'N/A'}</p>
    <p>Bio: ${user.bio || 'N/A'}</p>
  `;

  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-6 text-center" id="modalImageContainer">
        ${image.outerHTML}
      </div>
      <div class="col-md-6" id="modalUserDetails">
        ${userDetails.outerHTML}
      </div>
    </div>
  `;

  imageViewLink.href = src;

  
  var myModal = new bootstrap.Modal(document.getElementById('modal'), {});
  myModal.show();
}

searchBtn.addEventListener("click",function() {

  if(searchKey.value != ''){
      fetchSearchData(searchKey.value);
  }

});

const fetchSearchData = async (key) => {
  let imageURLS = [];
  const orderbyvar = orderByValue;
  let tempUrl = searchUrl + key;

  if (orderbyvar !== "") {
    tempUrl += "&order_by=" + orderbyvar;
  }

  try {
    let response = await fetch(tempUrl);
    let myJson = await response.json();

    tempUrl += "&per_page=" + myJson.total;
    response = await fetch(tempUrl);
    myJson = await response.json();
    console.log(myJson);
    const imageArrays = myJson.results;
    imageArrays.forEach(element => {
      imageURLS.push({
        url: element.urls.small,
        user: element.user, 
      });
  });
  
  displayImage(imageURLS);
  
} catch (error) 
   {
    handleError(error);
    }
};


function orderBy() {
  orderByValue = document.getElementById("orderby").value;
  imageURLS = [];

  if(searchKey.value != '') {
      fetchSearchData(searchKey.value);
  }else {
      fetchData();
  }
}