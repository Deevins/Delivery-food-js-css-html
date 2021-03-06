// 'use strict';





const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const logInForm = document.querySelector('#logInForm');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('deliveryFood');

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${url}, status: ${response.status}`);
  }

  return await response.json();
};



const valid = function (str) {
  const nameValid = /^{a-zA-Z}{a-zA-Z0-9-_\.}{1,20}$/;
  return nameValid.test(str);
};




function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  logInInput.style.bordercolor = '';


}

function authorized() {

  function logout() {
    login = null;
    localStorage.removeItem('deliveryFood');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logout);
    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logout);
}

function notAuthorized() {
  console.log('not authorized');

  function logIn(event) {
    event.preventDefault();
    if (logInInput.value.trim()) {
      login = logInInput.value;
      localStorage.setItem('deliveryFood', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);

      logInForm.reset();

      checkAuth();

    } else {
      logInInput.style.bordercolor = 'red';
    }

  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery
}) {





  const card = `
  <a class="card card-restaurant" data-products = "${products}">
  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${time_of_delivery}</span>
    </div>
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  </div>
</a>

`;
  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood({
  description,
  id,
  image,
  name,
  price
}) {


  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML("beforeend", `
						<img src="${image}" alt="image" class="card-image"/>
						<d class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
					</div>


  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {

  const target = event.target;
  if (login) {

    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    } else {
      toggleModalAuth();

    }

  }


}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });


  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');


  });

  checkAuth();

  createCardRestaurant();
  createCardRestaurant();
  createCardRestaurant();



  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true,
  });
}

init();