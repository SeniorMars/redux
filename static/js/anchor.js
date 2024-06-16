document.addEventListener('DOMContentLoaded', function () {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        // Check if the heading already has a wrapped link
        if (!heading.classList.contains('linked')) {
            const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
            heading.id = id; // Assign ID based on heading text

            // Wrap the text in an anchor tag and mark the heading
            heading.innerHTML = `<a href="#${id}" class="heading-link" aria-label="Link to this section">${heading.innerHTML}</a>`;
            heading.classList.add('linked'); // Mark the heading to avoid re-processing
        }
    });
});
