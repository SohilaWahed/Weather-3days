// loadNavbar.js
document.addEventListener('DOMContentLoaded', async () => {

  const navbarOut = document.querySelector('.navbar-placeholder');
  try {

    let response = await fetch('navbar.html')
    let data = await response.text()
    navbarOut.innerHTML = data;

    // Highlight the active link
    const links = document.querySelectorAll('.nav-link')
    var currentPath = window.location.pathname.split('/').pop();
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (currentPath === href) {
        link.classList.add('active');
      }
    });

    setupNavbar()

  }
  catch (e) {
    console.log('Error loading navbar:', e)
  };
})

function setupNavbar() {

  const menu = document.querySelector('.navbar-toggler')
  const navbar = document.querySelector('.collapse')
  const links = document.querySelectorAll('.nav-link')


  menu.addEventListener('click', function (e) {
    navbar.classList.remove('navbar-collapse')
    navbar.classList.add('nav-show')
  })

  // to navbar-collapse appear in 992px
  var mediaQuery = window.matchMedia('(min-width: 992px)');
  function handleNavCollapseScreen(event) {
    const navbar = document.querySelector('.collapse')
    navbar.classList.remove('nav-show')
    navbar.classList.add('navbar-collapse')
  }
  handleNavCollapseScreen(matchMedia)
  mediaQuery.addListener(handleNavCollapseScreen);

  // when link go to specific part in same page ()
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      links.forEach(link => {
        link.classList.remove('active')
      })
      e.target.classList.add('active')
    })
  })
}

const search = document.querySelector('.search input')
const searchBtn = document.querySelector('.search button')

search.addEventListener('input', function (e) {
  weather()
})

searchBtn.addEventListener('click', function (e) {
  weather()
})

weather()
async function weather() {

  let city = '';

  if (search.value == '') {
    try {
      let location = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=3f6c7ab12662460f9448a84c9a84245b`)
      let locaJson = await location.json()
      city = locaJson.city;
    } catch (err) {
      console.log(err);
    }
  } else {
    city = search.value
  }

  try {
    let responsive = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=95c8c42c9154406a9ad194036241206&q=${city}&days=3`)
    let data = await responsive.json()
    displayToday(data.location, data.current)
    displayOtherDay(data.forecast.forecastday)
  } catch (err) {
    console.log(err);
  }
}

function displayToday(city, details) {

  const dateString = city.localtime.split(' ');
  const date = new Date(dateString[0]);

  // Get the weekday name
  const weekdayOptions = { weekday: 'long' };
  const weekdayName = new Intl.DateTimeFormat('en-US', weekdayOptions).format(date);

  // Get the formatted date (13 June)
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date);
  const formattedDate = `${day} ${month}`;

  const content = `<div class="header p-2 fw-normal d-flex justify-content-between">
            <span class="day">${weekdayName}</span>
            <span class="date">${formattedDate}</span>
          </div>
          <div class="status p-3">
            <span class="city">${city.name}</span>
            <div class="details">
              <div class="box d-flex flex-lg-column">
                <div class="degree fw-bold text-white">${details.temp_c} <sup>o</sup>C</div>
                <div class="image d-flex align-items-center">
                  <img src="https:${details.condition.icon}" alt="sun" class="w-100">
                </div>
              </div>
              <span class="general-status">${details.condition.text}</span>
            </div>
            <div class="other-details my-3 d-flex">
              <div class="umberella me-3">
                <img src="./images/icon-umberella.png" alt="">
                <span>20%</span>
              </div>
              <div class="wind me-3">
                <img src="./images/icon-wind.png" alt="">
                <span>${details.wind_kph}km/h</span>
              </div>
              <div class="compass me-3">
                <img src="./images/icon-compass.png" alt="">
                <span>East</span>
              </div>
            </div>
          </div>`
  document.querySelector('.today-card').innerHTML = content
}

function displayOtherDay(details) {

  const dateString = details[1].date;
  const date = new Date(dateString);
  const tommorow = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const nextTommorow = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date.setDate(date.getDate() + 1));

  let contentOne = `<div class="header p-2">
            <span class="day">${tommorow}</span>
          </div>
          <div class="details pb-5 d-flex flex-column align-items-center">
            <div class="image">
              <img src="https:${details[1].day.condition.icon}" alt="sun" class="w-100">
            </div>
            <span class="degree-day fw-bold text-white">${details[1].day.maxtemp_c} <sup>o</sup>C</span>
            <span class="degree-night">${details[1].day.mintemp_c}<sup>o</sup></span>
            <span class="general-status mt-3">${details[1].day.condition.text}</span>
          </div>`

  let contentTwo = `<div class="header p-2">
            <span class="day">${nextTommorow}</span>
          </div>
          <div class="details pb-5 d-flex flex-column align-items-center">
            <div class="image">
              <img src="https:${details[2].day.condition.icon}" alt="sun" class="w-100">
            </div>
            <span class="degree-day fw-bold text-white">${details[2].day.maxtemp_c} <sup>o</sup>C</span>
            <span class="degree-night">${details[2].day.mintemp_c}<sup>o</sup></span>
            <span class="general-status mt-3">${details[2].day.condition.text}</span>
          </div>`

  document.querySelector('.tommorow-card').innerHTML = contentOne;
  document.querySelector('.next-tommorow-card').innerHTML = contentTwo
}

