export function createMarkup(photos) {
    return photos
      .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
        return /*html*/ `<div class="photo-card">
      <a href="${largeImageURL}" class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" width = "300" height="200"/></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
    </div>`;
      })
      .join('');
  }

