AOS.init({
    duration: 560,
    easing: 'ease-out-cubic',
    once: true,
    offset: 45,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

document.querySelectorAll('.team-card').forEach(function(card) {
    card.setAttribute('tabindex', '0');
    var memberName = card.querySelector('.team-name');
    var hoverPanel = card.querySelector('.member-hover');
    if (memberName && hoverPanel) {
        var heading = document.createElement('h3');
        heading.className = 'member-name';
        heading.textContent = memberName.textContent.trim();
        hoverPanel.prepend(heading);
    }
});

/* NAVBAR SCROLL & ACTIVE LINK  */
window.addEventListener('scroll', function() {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('btt').classList.toggle('show', window.scrollY > 300);
    document.querySelectorAll('section[id]').forEach(function(sec) {
        var top = sec.offsetTop - 110,
            bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            var lnk = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (lnk) lnk.classList.add('active');
        }
    });
});

/*  SMOOTH SCROLL + MOBILE NAV CLOSE  */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            var navCollapse = document.getElementById('navmenu');
            var scrollToTarget = function() {
                window.scrollTo({
                    top: t.getBoundingClientRect().top + window.scrollY - 78,
                    behavior: 'smooth'
                });
            };

            if (navCollapse && navCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    navCollapse.addEventListener('hidden.bs.collapse', function() {
                        scrollToTarget();
                    }, { once: true });
                    bsCollapse.hide();
                    return;
                } else {
                    navCollapse.classList.remove('show');
                }
            }
            setTimeout(function() {
                scrollToTarget();
            }, 50);
        }
    });
});

var searchOv = document.getElementById('searchOv');

document.getElementById('navSearchBtn').addEventListener('click', function() {
    searchOv.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderSearchResults();
    setTimeout(function() {
        document.getElementById('searchInput').focus();
    }, 220);
});

document.getElementById('searchClose').addEventListener('click', closeSearch);

// Close when clicking backdrop
searchOv.addEventListener('click', function(e) {
    if (e.target === searchOv) closeSearch();
});

function closeSearch() {
    searchOv.classList.remove('open');
    document.body.style.overflow = '';
}

var searchItems = [];
var searchResults = document.getElementById('searchResults');
var searchInput = document.getElementById('searchInput');
var activeSearchCategory = 'all';

function getReadableSearchText(element) {
    return element ? (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim() : '';
}

function addSearchItem(element, category, categoryLabel, title, description) {
    if (!element) return;
    if (!element.id) element.id = 'lab-search-' + searchItems.length;
    var excerpt = (description || element.textContent || '').replace(/\s+/g, ' ').trim();
    searchItems.push({
        id: element.id,
        category: category,
        categoryLabel: categoryLabel,
        title: title.trim(),
        excerpt: excerpt,
        text: (title + ' ' + excerpt).toLowerCase()
    });
}

function buildSearchIndex() {
    var hero = document.getElementById('hero');
    addSearchItem(hero, 'research', 'Research', getReadableSearchText(hero.querySelector('h1')), getReadableSearchText(hero.querySelector('.hdesc')));

    var about = document.getElementById('about');
    addSearchItem(about, 'research', 'Research', 'Ramu Lab research', getReadableSearchText(about));
    about.querySelectorAll('.fti').forEach(function(item) {
        var heading = item.querySelector('h6');
        addSearchItem(item, 'research', 'Research', heading ? heading.textContent : 'Research theme', getReadableSearchText(item));
    });

    document.querySelectorAll('#people .team-card').forEach(function(card) {
        var name = card.querySelector('.team-name');
        var panel = card.querySelector('.member-hover');
        var biography = panel ? panel.querySelector('p') : null;
        var profileText = [
            getReadableSearchText(card.querySelector('.team-role')),
            getReadableSearchText(card.querySelector('.team-summary')),
            panel ? getReadableSearchText(panel.querySelector('strong')) : '',
            panel ? getReadableSearchText(panel.querySelector('span')) : '',
            getReadableSearchText(biography)
        ].join(' ');
        addSearchItem(card, 'people', 'People', name ? name.textContent : 'Lab member', profileText);
    });

    document.querySelectorAll('#patents .publication-item').forEach(function(item) {
        var title = item.querySelector('h5');
        var year = item.querySelector('.publication-year');
        addSearchItem(item, 'patents', 'Patents', title ? title.textContent : 'Patent', getReadableSearchText(year) + ' ' + getReadableSearchText(item.querySelector('p')));
    });

    document.querySelectorAll('#publications .publication-item').forEach(function(item) {
        var title = item.querySelector('h5');
        var year = item.querySelector('.publication-year');
        addSearchItem(item, 'publications', 'Publications', title ? title.textContent : 'Publication', getReadableSearchText(year) + ' ' + getReadableSearchText(item.querySelector('p')));
    });

    document.querySelectorAll('#projects .detail-card').forEach(function(item) {
        var title = item.querySelector('h4');
        addSearchItem(item, 'projects', 'Projects', title ? title.textContent : 'Project', getReadableSearchText(item.querySelector('p')));
    });

    document.querySelectorAll('#alumni .alumni-grid > span').forEach(function(item) {
        var text = item.textContent.trim();
        addSearchItem(item, 'alumni', 'Alumni', text.split(',')[0], text);
    });

    document.querySelectorAll('#gallery .gitem').forEach(function(item) {
        addSearchItem(item, 'gallery', 'Gallery', item.getAttribute('data-gtitle') || 'Lab gallery', item.getAttribute('data-gdesc') || item.textContent);
    });

    var joinCopy = document.querySelector('#contact-section .join-copy');
    addSearchItem(joinCopy, 'join-us', 'Join Us', 'Join Ramu Lab', getReadableSearchText(joinCopy ? joinCopy.querySelector('p') : null));
    var contactCard = document.querySelector('#contact-section .contact-card');
    addSearchItem(contactCard, 'contact', 'Contact', 'Dr. Ramu S. Vemanna', getReadableSearchText(contactCard));
}

function getSearchExcerpt(item, terms) {
    var text = item.excerpt;
    if (!text) return '';
    var matchAt = -1;
    terms.forEach(function(term) {
        var index = text.toLowerCase().indexOf(term);
        if (index !== -1 && (matchAt === -1 || index < matchAt)) matchAt = index;
    });
    var start = matchAt > 54 ? matchAt - 54 : 0;
    var end = Math.min(text.length, start + 170);
    return (start > 0 ? '... ' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

function renderSearchResults() {
    var query = searchInput.value.trim().toLowerCase();
    var terms = query ? query.split(/\s+/) : [];
    var matches = searchItems.filter(function(item) {
        var inCategory = activeSearchCategory === 'all' || item.category === activeSearchCategory;
        return inCategory && terms.every(function(term) { return item.text.indexOf(term) !== -1; });
    });
    searchResults.replaceChildren();

    if (!query && activeSearchCategory === 'all') {
        var prompt = document.createElement('p');
        prompt.className = 'sovempty';
        prompt.textContent = 'Search by a person, research topic, project, or publication.';
        searchResults.append(prompt);
        return;
    }

    if (!matches.length) {
        var empty = document.createElement('p');
        empty.className = 'sovempty';
        empty.textContent = 'No matching lab content. Try a name, topic, or publication term.';
        searchResults.append(empty);
        return;
    }

    var count = document.createElement('p');
    count.className = 'sovcount';
    count.textContent = matches.length + (matches.length === 1 ? ' result' : ' results');
    searchResults.append(count);

    matches.forEach(function(item) {
        var link = document.createElement('a');
        link.className = 'sovresult';
        link.href = '#' + item.id;
        link.setAttribute('data-search-result', 'true');

        var category = document.createElement('span');
        category.className = 'sovresult-category';
        category.textContent = item.categoryLabel;

        var title = document.createElement('h5');
        title.textContent = item.title;

        var excerpt = document.createElement('p');
        excerpt.textContent = getSearchExcerpt(item, terms);

        link.append(category, title, excerpt);
        searchResults.append(link);
    });
}

buildSearchIndex();
searchInput.addEventListener('input', renderSearchResults);
document.getElementById('labSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    renderSearchResults();
});

document.querySelectorAll('.sovfilter').forEach(function(button) {
    button.addEventListener('click', function() {
        activeSearchCategory = this.getAttribute('data-cat');
        document.querySelectorAll('.sovfilter').forEach(function(filter) {
            var active = filter === button;
            filter.classList.toggle('active', active);
            filter.setAttribute('aria-pressed', String(active));
        });
        renderSearchResults();
    });
});

searchResults.addEventListener('click', function(event) {
    var link = event.target.closest('a[data-search-result]');
    if (!link) return;
    var target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    event.preventDefault();
    closeSearch();
    setTimeout(function() {
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 78,
            behavior: 'smooth'
        });
    }, 50);
});

var galPop = document.getElementById('galPop');
var galData = [];
var galIdx = 0;

document.querySelectorAll('.gitem').forEach(function(item) {
    galData.push({
        img: item.getAttribute('data-gimg'),
        title: item.getAttribute('data-gtitle'),
        desc: item.getAttribute('data-gdesc')
    });
    item.addEventListener('click', function() {
        openGal(parseInt(this.getAttribute('data-gi')));
    });
});

function openGal(i) {
    galIdx = i;
    var g = galData[i];
    document.getElementById('gpImg').setAttribute('src', g.img);
    document.getElementById('gpTitle').textContent = g.title;
    document.getElementById('gpDesc').innerHTML = g.desc;
    galPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

document.getElementById('gpClose').addEventListener('click', closeGal);
galPop.addEventListener('click', function(e) {
    if (e.target === this) closeGal();
});

function closeGal() {
    galPop.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('gpPrev').addEventListener('click', function() {
    openGal((galIdx - 1 + galData.length) % galData.length);
});
document.getElementById('gpNext').addEventListener('click', function() {
    openGal((galIdx + 1) % galData.length);
});

/* Escape closes open lab overlays. */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeGal();
    }
});
