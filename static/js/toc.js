document.addEventListener('DOMContentLoaded', () => {
    const tocTitle = document.querySelector('.toc-title');
    const tocList = document.querySelector('.toc-list');

    if (tocTitle && tocList) {
        tocTitle.addEventListener('click', function () {
            const isExpanded = tocList.style.display === 'block' || window.getComputedStyle(tocList).display === 'block';
            tocList.style.display = isExpanded ? 'none' : 'block';
            tocTitle.classList.toggle('expanded', !isExpanded);
        });
    }
});
