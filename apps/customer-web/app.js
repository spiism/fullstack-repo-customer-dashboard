const params = new URLSearchParams(window.location.search);
const configuredApiBaseUrl =
  typeof window.CUSTOMER_API_BASE_URL === 'string'
    ? window.CUSTOMER_API_BASE_URL.trim()
    : '';
const queryApiBaseUrl = params.get('apiBase')?.trim() ?? '';
const apiBaseUrl =
  (configuredApiBaseUrl || queryApiBaseUrl || 'http://localhost:3001/api/v1')
    .replace(/\/$/, '');

const state = {
  page: 1,
  limit: 10,
  search: '',
  totalPages: 1,
  isLoading: false,
};

const elements = {
  apiStatus: document.querySelector('#apiStatus'),
  customerList: document.querySelector('#customerList'),
  emptyState: document.querySelector('#emptyState'),
  errorState: document.querySelector('#errorState'),
  firstPageButton: document.querySelector('#firstPageButton'),
  lastPageButton: document.querySelector('#lastPageButton'),
  limitSelect: document.querySelector('#limitSelect'),
  nextPageButton: document.querySelector('#nextPageButton'),
  pageIndicator: document.querySelector('#pageIndicator'),
  previousPageButton: document.querySelector('#previousPageButton'),
  resultsSummary: document.querySelector('#resultsSummary'),
  resultsTitle: document.querySelector('#resultsTitle'),
  searchForm: document.querySelector('#searchForm'),
  searchInput: document.querySelector('#searchInput'),
};

function setStatus(message, isError = false) {
  elements.apiStatus.textContent = message;
  elements.apiStatus.style.color = isError ? 'var(--danger)' : 'var(--success)';
  elements.apiStatus.style.borderColor = isError
    ? 'rgba(207, 34, 46, 0.35)'
    : 'rgba(26, 127, 55, 0.24)';
  elements.apiStatus.style.background = isError
    ? 'rgba(207, 34, 46, 0.08)'
    : 'rgba(26, 127, 55, 0.08)';
}

function customerUrl() {
  const url = new URL(`${apiBaseUrl}/customers`);
  url.searchParams.set('page', String(state.page));
  url.searchParams.set('limit', String(state.limit));

  if (state.search) {
    url.searchParams.set('search', state.search);
  }

  return url;
}

function setLoading(isLoading) {
  state.isLoading = isLoading;
  elements.firstPageButton.disabled = isLoading || state.page <= 1;
  elements.previousPageButton.disabled = isLoading || state.page <= 1;
  elements.nextPageButton.disabled = isLoading || state.page >= state.totalPages;
  elements.lastPageButton.disabled = isLoading || state.page >= state.totalPages;
  elements.limitSelect.disabled = isLoading;
  elements.searchInput.disabled = isLoading;
  elements.searchForm.querySelector('button').disabled = isLoading;
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function appendText(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  parent.appendChild(element);
  return element;
}

function renderCustomers(customers) {
  clearChildren(elements.customerList);

  for (const customer of customers) {
    const item = document.createElement('li');
    item.className = 'customer-item';

    const summary = document.createElement('div');
    const name =
      [customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
      customer.email;
    appendText(summary, 'h3', name, 'customer-name');
    appendText(summary, 'p', customer.title || 'No title listed', 'customer-role');

    const meta = document.createElement('div');
    meta.className = 'customer-meta';
    appendText(meta, 'span', customer.company || 'No company');
    appendText(meta, 'span', customer.city || 'No city');
    appendText(meta, 'span', `Source ID ${customer.sourceId}`);
    summary.appendChild(meta);

    const contact = document.createElement('div');
    contact.className = 'customer-contact';

    const email = document.createElement('a');
    email.href = `mailto:${customer.email}`;
    email.textContent = customer.email;
    contact.appendChild(email);

    appendText(contact, 'span', customer.ipAddress || 'No IP address');

    item.append(summary, contact);
    elements.customerList.appendChild(item);
  }
}

function renderMeta(meta) {
  const first = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const last = Math.min(meta.page * meta.limit, meta.total);
  const searchText = state.search ? ` matching "${state.search}"` : '';

  elements.resultsSummary.textContent =
    meta.total === 0
      ? `No customers${searchText}.`
      : `Showing customers ${first}-${last} of ${meta.total}${searchText}.`;
  elements.pageIndicator.textContent = `Page ${meta.page} of ${meta.totalPages}`;
}

function renderPagination(meta) {
  state.totalPages = Math.max(meta.totalPages, 1);
  state.page = meta.page;
  setLoading(false);
}

function renderError(error) {
  clearChildren(elements.customerList);
  elements.emptyState.hidden = true;
  elements.errorState.hidden = false;
  elements.errorState.textContent = error.message;
  elements.resultsSummary.textContent = 'Unable to load customers.';
  setStatus('API error', true);
  setLoading(false);
}

async function loadCustomers() {
  elements.errorState.hidden = true;
  elements.emptyState.hidden = true;
  elements.resultsSummary.textContent = 'Loading customers.';
  setStatus('Loading');
  setLoading(true);

  try {
    const response = await fetch(customerUrl());

    if (!response.ok) {
      throw new Error(`Customer API responded with ${response.status}.`);
    }

    const payload = await response.json();
    renderCustomers(payload.data);
    renderMeta(payload.meta);
    renderPagination(payload.meta);
    elements.emptyState.hidden = payload.data.length > 0;
    setStatus('Connected');
    elements.resultsTitle.focus({ preventScroll: true });
  } catch (error) {
    renderError(error instanceof Error ? error : new Error('Unknown API error.'));
  }
}

elements.searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.search = elements.searchInput.value.trim();
  state.page = 1;
  void loadCustomers();
});

elements.limitSelect.addEventListener('change', () => {
  state.limit = Number(elements.limitSelect.value);
  state.page = 1;
  void loadCustomers();
});

elements.firstPageButton.addEventListener('click', () => {
  state.page = 1;
  void loadCustomers();
});

elements.previousPageButton.addEventListener('click', () => {
  state.page = Math.max(state.page - 1, 1);
  void loadCustomers();
});

elements.nextPageButton.addEventListener('click', () => {
  state.page = Math.min(state.page + 1, state.totalPages);
  void loadCustomers();
});

elements.lastPageButton.addEventListener('click', () => {
  state.page = state.totalPages;
  void loadCustomers();
});

void loadCustomers();
