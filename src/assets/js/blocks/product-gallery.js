var galleries = document.querySelectorAll('[data-gallery]');

for (var i = 0; i < galleries.length; i++) {
    var gallery = galleries[i];
    var mainImage = document.querySelector('[data-gallery-main]');
    var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');

    for (var j = 0; j < thumbs.length; j++) {
        var thumb = thumbs[j];

        thumb.addEventListener('click', function () {
            var clickedThumb = this;
            for (var k = 0; k < thumbs.length; k++) {
                thumbs[k].classList.remove('product-page__thumb--active');
            }
            clickedThumb.classList.add('product-page__thumb--active');
            var newImageSrc = clickedThumb.getAttribute('data-full');
            mainImage.src = newImageSrc;
        });
    }
}