import '../css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Pixabay } from './Pixabay';
import {createMarkup} from './createMarkup';
import {refs} from './refs';
const pixabay = new Pixabay();

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const options = {
    root: null,
    rootMargin: '100px',
    threshold: 1.0,
};
const callback = async function(entries, observer) {
    entries.forEach(async entry => {
        if (entry.isIntersecting) {
            pixabay.incrementPage()
            observer.unobserve(entry.target);
            try {
                const { hits } = await pixabay.getPhotos();
                const markup = createMarkup(hits);
                refs.gallery.insertAdjacentHTML('beforeend', markup);
                lightbox.refresh();
                if (pixabay.isShowLoadMoreBtn) {
                  const target = document.querySelector('.photo-card:last-child');
                  io.observe(target);
                }
              } catch (error) {
                Notify.failure(error.message, 'Oops something went wrong!');
                clearPage();
              }
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
        refs.gallery.innerHTML = '';
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
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
        const target = document.querySelector('.photo-card:last-child')
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
        createGalleryImage(hits)
        refs.gallery.insertAdjacentHTML('beforeend', markup)
        lightbox.refresh();
    }).catch(error => {
        Notify.failure(error.message, "Sorry, there are no images matching your search query. Please try again.");
        clearPage()
    })
}

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
    pixabay.resetPage();
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.classList.add('is-hidden');
  }
    


