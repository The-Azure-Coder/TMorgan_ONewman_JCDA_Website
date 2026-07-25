// Search and filtering must include the featured card and every upcoming card.
const event_cards = [...document.querySelectorAll('.featured-event-card, .upcoming-event-card')];
const upcoming_cards = [...document.querySelectorAll('.upcoming-event-card')];
const featured_event_card = document.querySelector('.featured-event-card');
const featured_event_section = document.querySelector('.featured-event-section');
const filter_buttons = [...document.querySelectorAll('.filter-btn')];
const project_filter_buttons = [...document.querySelectorAll('.project-filter-btn')];
const project_gallery_items = [...document.querySelectorAll('.project-gallery-list figure')];

// Read the search field and sorting control from the page.
const search_input = document.querySelector('#event-search');
const sort_select = document.querySelector('#event-sort');

function update_event_filter() {
    // Use the selected category and search text for every event card.
    const active_filter = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const search_term = search_input?.value.toLowerCase().trim() || '';

    event_cards.forEach((event_card) => {
        const matches_category = active_filter === 'all' || event_card.dataset.category === active_filter;
        const matches_search = event_card.textContent.toLowerCase().includes(search_term);
        event_card.hidden = !(matches_category && matches_search);
        event_card.style.display = event_card.hidden ? 'none' : '';
    });

    // Hide the featured section when its card does not match the search.
    if (featured_event_card && featured_event_section) {
        featured_event_section.style.display = featured_event_card.hidden ? 'none' : '';
    }
}

update_event_filter();

// Update the filter whenever a category button is selected.
filter_buttons.forEach((filter_button) => {
    filter_button.addEventListener('click', () => {
        filter_buttons.forEach((filter_item) => filter_item.classList.remove('active'));
        filter_button.classList.add('active');
        update_event_filter();
    });
});

// Update matching cards as the user types.
search_input?.addEventListener('input', update_event_filter);
sort_select?.addEventListener('change', () => {
    const event_list = document.querySelector('.upcoming-event-list');
    if (!event_list) return;

    const sorted_cards = [...upcoming_cards].sort((first_card, second_card) => {
        if (sort_select.value === 'title') {
            return first_card.querySelector('h3').textContent.localeCompare(second_card.querySelector('h3').textContent);
        }

        const first_date = first_card.dataset.date || '';
        const second_date = second_card.dataset.date || '';
        return sort_select.value === 'oldest'
            ? first_date.localeCompare(second_date)
            : second_date.localeCompare(first_date);
    });

    sorted_cards.forEach((event_card) => event_list.appendChild(event_card));
});

// Filter the project gallery by the category selected above the gallery.
function update_project_gallery() {
    const active_project_filter = document.querySelector('.project-filter-btn.active')?.dataset.category || 'all';

    project_gallery_items.forEach((gallery_item) => {
        const matches_category = active_project_filter === 'all' || gallery_item.dataset.category === active_project_filter;
        gallery_item.hidden = !matches_category;
        gallery_item.style.display = gallery_item.hidden ? 'none' : '';
    });
}

project_filter_buttons.forEach((project_filter_button) => {
    project_filter_button.addEventListener('click', () => {
        project_filter_buttons.forEach((filter_item) => filter_item.classList.remove('active'));
        project_filter_button.classList.add('active');
        update_project_gallery();
    });
});

update_project_gallery();

// Give each newsletter form a local success or validation message.
document.querySelectorAll('.newsletter-form').forEach((newsletter_form) => {
    newsletter_form.addEventListener('submit', (event) => {
        event.preventDefault();
        const newsletter_email = newsletter_form.querySelector('input[type="email"]');
        const form_feedback = newsletter_form.querySelector('.form-feedback');

        if (!form_feedback) return;

        if (!newsletter_email?.checkValidity()) {
            form_feedback.textContent = 'Please enter a valid email address.';
            form_feedback.className = 'form-feedback error';
            return;
        }

        form_feedback.textContent = 'Thank you for subscribing.';
        form_feedback.className = 'form-feedback success';
        newsletter_form.reset();
    });
});

// Validate the required Contact form fields before showing a success message.
const contact_form = document.querySelector('#contact-form');

if (contact_form) {
    const contact_fields = [
        { input_id: 'full-name', label: 'Full Name' },
        { input_id: 'email-address', label: 'Email Address' },
        { input_id: 'subject', label: 'Subject' },
        { input_id: 'message', label: 'Message' }
    ];
    const contact_feedback = contact_form.querySelector('#contact-form-feedback');

    const show_field_error = (contact_field, error_message = '') => {
        const input_element = contact_form.querySelector(`#${contact_field.input_id}`);
        const field_container = input_element.closest('.form-field');
        const error_element = field_container.querySelector('.field-error');
        field_container.classList.toggle('invalid', Boolean(error_message));
        input_element.setAttribute('aria-invalid', Boolean(error_message));
        error_element.textContent = error_message;
        return !error_message;
    };

    contact_fields.forEach((contact_field) => {
        const input_element = contact_form.querySelector(`#${contact_field.input_id}`);
        input_element.addEventListener('input', () => show_field_error(contact_field));
    });

    contact_form.addEventListener('submit', (event) => {
        event.preventDefault();
        let form_is_valid = true;

        contact_fields.forEach((contact_field) => {
            const input_element = contact_form.querySelector(`#${contact_field.input_id}`);
            const field_value = input_element.value.trim();
            let error_message = field_value ? '' : `${contact_field.label} is required.`;

            if (contact_field.input_id === 'email-address' && field_value && !input_element.validity.valid) {
                error_message = 'Enter a valid email address.';
            }

            if (!show_field_error(contact_field, error_message)) form_is_valid = false;
        });

        if (!form_is_valid) {
            contact_feedback.textContent = 'Please correct the highlighted fields.';
            contact_feedback.className = 'contact-form-feedback error';
            return;
        }

        contact_feedback.textContent = 'Thank you. Your message has been received.';
        contact_feedback.className = 'contact-form-feedback';
        contact_form.reset();
    });
}
