import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';


export class Pixabay {
    #page = 1;
    #searchQuery = '';
    #totalPages = 0;
    #perPage = 40;
    #params = {
        params: {
            image_type: 'image_type',
            orientation: 'horizontal',
            safesearch: 'true',
            perPage: 40,
          },
      }

    async getPhotos(){
        const urlAXIOS = `?key=30572084-069004b26a8a8f55c86a46c9c&q=${this.#searchQuery}&page=${this.#page}`;
        const {data} = await axios.get(urlAXIOS, this.#params)
        return data;
    }
    set searchQuery(newSearchQuery) {
        this.#searchQuery = newSearchQuery
    }
    get searchQuery() {
        return this.#searchQuery
    }
    
    incrementPage() {
        this.#page += 1
      }
      resetPage() {
        this.#page = 1;
      }
    calculateTotalPages(total) {
        this.#totalPages = Math.ceil(total / this.#perPage);
    }
    get isShowLoadMoreBtn() {
        return this.#page < this.#totalPages;
    }
};

