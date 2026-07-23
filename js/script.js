const eventCards = [...document.querySelectorAll('.featured-event-card, .upcoming-event-card')];
const upcomingCards = [...document.querySelectorAll('.upcoming-event-card')];
const featuredEventCard = document.querySelector('.featured-event-card');
const featuredEventSection = document.querySelector('.featured-event-section');
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const searchInput = document.querySelector('#event-search');
const sortSelect = document.querySelector('#event-sort');

function updateEvents() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const searchTerm = searchInput?.value.toLowerCase().trim() || '';

    eventCards.forEach((card) => {
        const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
        const matchesSearch = card.textContent.toLowerCase().includes(searchTerm);
        card.hidden = !(matchesCategory && matchesSearch);
    });

    if (featuredEventCard && featuredEventSection) featuredEventSection.hidden = featuredEventCard.hidden;
}

updateEvents();

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        updateEvents();
    });
});

searchInput?.addEventListener('input', updateEvents);

sortSelect?.addEventListener('change', () => {
    const list = document.querySelector('.upcoming-event-list');
    const sortedCards = [...upcomingCards].sort((first, second) => {
        if (sortSelect.value === 'title') {
            return first.querySelector('h3').textContent.localeCompare(second.querySelector('h3').textContent);
        }

        return sortSelect.value === 'oldest' ? 1 : -1;
    });

    sortedCards.forEach((card) => list.appendChild(card));
});
