// Search and filtering must include the featured card and every upcoming card.
const event_cards = [...document.querySelectorAll('.featured-event-card, .upcoming-event-card')];
const upcoming_cards = [...document.querySelectorAll('.upcoming-event-card')];
const featured_event_card = document.querySelector('.featured-event-card');
const featured_event_section = document.querySelector('.featured-event-section');
const filter_buttons = [...document.querySelectorAll('.filter-btn')];

// Read the search field and sorting control from the page.
const search_input = document.querySelector('#event-search');
const sort_select = document.querySelector('#event-sort');

function update_event_filter() {
    // use sleected category and search text for event crad
const active_filter = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
const search_term = search_input?.value.toLowerCase().trim() || '';

    event_cards.forEach((event_card) => {
        const matches_category = active_filter === 'all' || event_card.dataset.category === active_filter;
        const matches_search = event_card.textContent.toLowerCase().includes(search_term);
        event_card.hidden = !(matches_category && matches_search);
        event_card.style.display = event_card.hidden ? 'none' : '';
    });

    // hide cardlisting if notheing matches
    if (featured_event_card && featured_event_section) featured_event_section.style.display = featured_event_card.hidden ? 'none' : '';
}

update_event_filter();

// update the filter whenever the catergory buttons are selected
filter_buttons.forEach((filter_button) => {
    filter_button.addEventListener('click', () => {
        filter_buttons.forEach((filter_item) => filter_item.classList.remove('active'));
        filter_button.classList.add('active');
        update_event_filter();
    });
});

// as user types the search card results updates immediatly
search_input?.addEventListener('input', update_event_filter);
sort_select?.addEventListener('change', () => {
    const event_list = document.querySelector('.upcoming-event-list');
    const sorted_cards = [...upcoming_cards].sort((first_card, second_card) => {
        if (sort_select.value === 'title') {
            return first_card.querySelector('h3').textContent.localeCompare(second_card.querySelector('h3').textContent);
        }

        return sort_select.value === 'oldest' ? 1 : -1;
    });

    sorted_cards.forEach((event_card) => event_list.appendChild(event_card));
});
