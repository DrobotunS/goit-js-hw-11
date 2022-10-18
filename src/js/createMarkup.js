export function createMarkup(photos) {
    return photos
      .map(({ webformatURL, tags}) => {
        return /*html*/ `<li class="gallery__item">
      <img src="${webformatURL}" alt="${tags}" class="gallery-img" width = "300" height="200">
  </li>`;
      })
      .join('');
  }