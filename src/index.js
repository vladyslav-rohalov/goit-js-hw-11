import './css/styles.css';
import { refs } from './js/refs';
import Notiflix from 'notiflix';
import PixabayApiService from './js/pixabayApiService';
import photoCardTmpl from './tmplCard.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import BScroll from '@better-scroll/core';
import InfinityScroll from '@better-scroll/infinity';
BScroll.use(InfinityScroll);
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const pixabayApiService = new PixabayApiService();
let simpleLightbox = null;

refs.inputForm.addEventListener('input', debounce(onInputForm, DEBOUNCE_DELAY));
refs.btnForm.addEventListener('click', onSearhBtnClick);
refs.cardsFieldInput.addEventListener('click', onImgClick);
refs.loadMore.addEventListener('click', onLoadMore);
refs.btnDown.addEventListener('click', onBtnClickScrollDown);
window.addEventListener('scroll', debounce(onPageScroll, DEBOUNCE_DELAY));

function onInputForm(e) {
  pixabayApiService.query = e.target.value;
}

function onSearhBtnClick(e) {
  e.preventDefault();
  resetPage();
  if (pixabayApiService.query !== '') {
    pixabayApiService.fetchQuery().then(checkQuery);
    btnScrollEnabled();
  }
}

function resetPage() {
  refs.cardsFieldInput.innerHTML = '';
  refs.loadMore.classList.add('is-hidden');
  pixabayApiService.resetPage();
  hits = 0;
}

function insertTmplCard(e) {
  const markup = photoCardTmpl(e.hits);
  refs.cardsFieldInput.insertAdjacentHTML('beforeend', markup);
  simpleLightbox = new SimpleLightbox('.cards-list__item a');
  imgCounter(e);
  if (e.total > 40 && hits < e.totalHits) {
    setTimeout(() => {
      showButtonLoadMore();
    }, 1000);
  }
}

function onImgClick(e) {
  e.preventDefault();
}

function onLoadMore(e) {
  e.preventDefault();
  if (pixabayApiService.query !== '') {
    pixabayApiService.fetchQuery().then(insertTmplCard);
    simpleLightbox.refresh();
  }
}

function showButtonLoadMore() {
  refs.loadMore.classList.remove('is-hidden');
}

function addHiddenClass() {
  refs.loadMore.classList.add('is-hidden');
}

function queryError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function checkQuery(e) {
  if (e.total !== 0) {
    insertTmplCard(e);
  } else queryError();
}

function notification(totalHits, hits) {
  Notiflix.Notify.info(`We found ${totalHits} pictures, uploaded  ${hits}`);

  if (hits >= totalHits) {
    Notiflix.Notify.failure(
      `${hits} images uploaded, to upload more please buy a subscription =)`
    );
    addHiddenClass();
  }
}

let hits = 0;
function imgCounter(e) {
  const totalHits = e.totalHits;
  hits += e.hits.length;
  notification(totalHits, hits);
}

function onBtnClickScrollDown() {
  window.scrollBy({
    top: refs.cardsFieldInput.offsetHeight,
    behavior: 'smooth',
  });
}

function btnScrollEnabled() {
  refs.btnDown.classList.remove('is-hidden');
}

function onPageScroll() {
  const galleryHeigh = refs.cardsFieldInput.offsetHeight;
  const screenHeight = document.documentElement.clientHeight;
  const headerHeght = refs.searchField.offsetHeight;

  if (scrollY >= galleryHeigh - screenHeight + headerHeght) {
    const bs = new BScroll(
      refs.cardsFieldInput,
      pixabayApiService.fetchQuery().then(insertTmplCard)
    );
    simpleLightbox.refresh();
  }
}
