// Pagination and Infinite Scroll Handler - Rehydration-Aware

export interface PaginationInfo {
    type: 'button' | 'link' | 'infinite-scroll' | 'load-more' | 'none';
    element: Element | null;
    selector: string;
    confidence: number;
}

/**
 * Detect pagination elements on the page
 */
export function detectPagination(): PaginationInfo {
    // Strategy 1: Look for "Next" buttons/links
    const nextButton = findNextButton();
    if (nextButton) {
        return {
            type: nextButton.tagName.toLowerCase() === 'a' ? 'link' : 'button',
            element: nextButton,
            selector: generateSelectorForElement(nextButton),
            confidence: 0.9
        };
    }

    // Strategy 2: Look for "Load More" buttons
    const loadMoreButton = findLoadMoreButton();
    if (loadMoreButton) {
        return {
            type: 'load-more',
            element: loadMoreButton,
            selector: generateSelectorForElement(loadMoreButton),
            confidence: 0.85
        };
    }

    return {
        type: 'none',
        element: null,
        selector: '',
        confidence: 0
    };
}

/**
 * Find "Next" button or link
 */
function findNextButton(): Element | null {
    const selectors = [
        'a[aria-label*="next" i]',
        'button[aria-label*="next" i]',
        'a.next',
        'button.next',
        'a[rel="next"]',
        '.pagination a:last-child',
        '[data-action="next"]',
        '[data-page="next"]'
    ];

    for (const selector of selectors) {
        try {
            const element = document.querySelector(selector);
            if (element && isVisible(element)) {
                return element;
            }
        } catch (e) { }
    }

    // Fallback: search by text content
    const allButtons = Array.from(document.querySelectorAll('a, button'));
    for (const button of allButtons) {
        const text = button.textContent?.trim().toLowerCase() || '';
        if (text === 'next' || text === 'next page' || text === '→' || text === '»' || text.includes('next ›')) {
            if (isVisible(button)) {
                return button;
            }
        }
    }

    return null;
}

/**
 * Find "Load More" button
 */
function findLoadMoreButton(): Element | null {
    const selectors = [
        '[data-action="load-more"]',
        '.load-more',
        '.show-more'
    ];

    for (const selector of selectors) {
        try {
            const element = document.querySelector(selector);
            if (element && isVisible(element)) {
                return element;
            }
        } catch (e) { }
    }

    // Search by text
    const allButtons = Array.from(document.querySelectorAll('button, a'));
    for (const button of allButtons) {
        const text = button.textContent?.trim().toLowerCase() || '';
        if (text.includes('load more') || text.includes('show more') || text.includes('see more')) {
            if (isVisible(button)) {
                return button;
            }
        }
    }

    return null;
}

/**
 * Click the next button
 */
export async function clickNextPage(selector: string): Promise<boolean> {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && isVisible(element)) {
        console.log('🖱️ Clicking next button:', selector);
        element.click();
        return true;
    }

    // If original selector failed, re-detect
    const reDetected = findNextButton();
    if (reDetected) {
        console.log('🖱️ Re-detected next button, clicking...');
        (reDetected as HTMLElement).click();
        return true;
    }

    return false;
}

/**
 * Scroll for infinite scroll
 */
export async function scrollNext(): Promise<boolean> {
    const beforeHeight = document.body.scrollHeight;
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

    // Wait for content
    await new Promise(r => setTimeout(r, 2000));

    return document.body.scrollHeight > beforeHeight;
}

function isVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0'
    );
}

function generateSelectorForElement(element: Element): string {
    if (element.id) return `#${element.id}`;

    // Use first class that looks stable
    if (element.className) {
        const firstClass = element.className.trim().split(/\s+/)[0];
        if (firstClass && !/\d{5,}/.test(firstClass)) { // Avoid very dynamic classes
            return `${element.tagName.toLowerCase()}.${firstClass}`;
        }
    }

    return element.tagName.toLowerCase();
}
