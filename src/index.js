import './css/styles.css';
import { refs } from './js/refs';
import PixabayApiService from './js/pixabayApiService';
import photoCardTmpl from './tmplCard.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const pixabayApiService = new PixabayApiService();

refs.inputForm.addEventListener('input', debounce(onInputForm, DEBOUNCE_DELAY));
refs.btnForm.addEventListener('click', onSearhBtnClick);
document.addEventListener('scroll', onPageScroll);

function onInputForm(e) {
  pixabayApiService.query = e.target.value;
}

function onSearhBtnClick(e) {
  e.preventDefault();
  resetPage();
  if (pixabayApiService.query !== '') {
    pixabayApiService.fetchQuery().then(insertTmplCard);
  }
}

function resetPage() {
  refs.cardsFieldInput.innerHTML = '';
  refs.loadMore.classList.add('is-hidden');
  pixabayApiService.resetPage();
}

function insertTmplCard(responseValue) {
  console.log(responseValue);
  const markup = photoCardTmpl(responseValue.hits);
  refs.cardsFieldInput.insertAdjacentHTML('beforeend', markup);
  const gallery = new SimpleLightbox('.cards-list__item a');
  if (responseValue.total > 40) {
    setTimeout(() => {
      RemoveClass();
    }, 1000);
  }
}

refs.cardsFieldInput.addEventListener('click', onImgClick);

function onImgClick(e) {
  e.preventDefault();
}

refs.loadMore.addEventListener('click', onLoadMore);

function onLoadMore(e) {
  e.preventDefault();
  if (pixabayApiService.query !== '') {
    pixabayApiService.fetchQuery().then(insertTmplCard);
  }
}

function onPageScroll() {}

function RemoveClass() {
  refs.loadMore.classList.remove('is-hidden');
}

function queryError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function checkQuery(e) {
  console.log(e);
  if (e.total === 0) {
    queryError();
  } else {
    insertTmplCard(e);
  }
}
