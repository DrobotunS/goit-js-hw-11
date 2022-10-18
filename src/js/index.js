import '../css/styles.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Pixabay } from './Pixabay';
import {createMarkup} from './createMarkup';
import {refs} from './refs';
const pixabay = new Pixabay();

const options = {
    root: null,
    rootMargin: '100px',
    threshold: 1.0,
}
const callback = function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(entry.intersectionRect);
            pixabay.incrementPage()
            
        }
    });
};
const io = new IntersectionObserver(callback, options);


const handleSubmit = async evt => {
    evt.preventDefault();
    const { elements: {searchQuery}} = evt.currentTarget
    const text = searchQuery.value.trim().toLowerCase();
    console.log(text);
    if (!text) {
        refs.list.innerHTML = '';
        Notify.failure('Enter data to search')
        return;
    };
    pixabay.searchQuery = text;
    clearPage()
    try {
        const {hits, total} = await pixabay.getPhotos();
        if (hits.length === 0 || total === []) {
            Notify.info(`According to your request, we did not find a picture of a ${text}`);
            return
        }
        const markup = createMarkup(hits);
        refs.list.insertAdjacentHTML('beforeend', markup);
        const target = document.querySelector('.gallery__item:last-child')
        io.observe(target);
        pixabay.calculateTotalPages(total);
        Notify.success(`We have found a ${total} images on the ${text} request`)
        if (pixabay.isShowLoadMoreBtn) {
            refs.loadMoreBtn.classList.remove('is-hidden')
        } 
    } catch (error) {
        Notify.failure(error.message, "Sorry, there are no images matching your search query. Please try again.");
        clearPage() 
    }
};

const onLoadMore = () => {
    pixabay.incrementPage()
    if (!pixabay.isShowLoadMoreBtn) {
        refs.loadMoreBtn.classList.add('is-hidden')
    } 
    pixabay.getPhotos().then(({hits}) => {
        const markup = createMarkup(hits);
        refs.list.insertAdjacentHTML('beforeend', markup)
    }).catch(error => {
        Notify.failure(error.message, "Sorry, there are no images matching your search query. Please try again.");
        clearPage()
    })
}

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
    pixabay.resetPage();
    refs.list.innerHTML = '';
    refs.loadMoreBtn.classList.add('is-hidden');
  }
    
  


    