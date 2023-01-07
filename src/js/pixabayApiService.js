export default class PixabayApiService {
  constructor() {
    this.searhQuery = '';
    this.page = 1;
    this.key = '?key=32075942-33ac7ec23728def8e99295683';
  }

  async fetchQuery() {
    try {
      const params = `&image_type=photo&orientation=horizontal&safesearch=false&per_page=40&page=${this.page}`;
      const url = `https://pixabay.com/api/${this.key}&q=${this.searhQuery}${params}`;
      const response = await fetch(url);
      const photoCards = await response.json();
      this.incrementPage();
      return photoCards;
    } catch (err) {
      throw err;
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searhQuery.trim();
  }

  set query(newQuery) {
    this.searhQuery = newQuery;
  }
}
