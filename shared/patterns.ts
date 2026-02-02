// Pattern detection utilities

export interface PatternMatch {
    elements: Element[];
    selector: string;
    confidence: number;
    preview: {
        tagName: string;
        className: string;
        count: number;
    };
}

/**
 * Find elements similar to the clicked element
 * This is the POWER feature that makes bulk scraping possible
 */
export function findSimilarElements(element: Element): PatternMatch | null {
    // Strategy 1: Same class name
    const byClass = findByClassName(element);
    if (byClass.elements.length > 1) {
        return byClass;
    }

    // Strategy 2: Same tag + parent
    const byStructure = findByStructure(element);
    if (byStructure.elements.length > 1) {
        return byStructure;
    }

    // Strategy 3: Same attributes pattern
    const byAttributes = findByAttributes(element);
    if (byAttributes.elements.length > 1) {
        return byAttributes;
    }

    return null;
}

/**
 * Find elements with the same class name
 */
function findByClassName(element: Element): PatternMatch {
    const className = element.className;
    if (!className || typeof className !== 'string') {
        return { elements: [], selector: '', confidence: 0, preview: { tagName: '', className: '', count: 0 } };
    }

    // Get the most specific class (usually the last one)
    const classes = className.trim().split(/\s+/);
    const specificClass = classes[classes.length - 1];

    const selector = `.${specificClass}`;
    const elements = Array.from(document.querySelectorAll(selector));

    return {
        elements,
        selector,
        confidence: 0.9,
        preview: {
            tagName: element.tagName.toLowerCase(),
            className: specificClass,
            count: elements.length
        }
    };
}

/**
 * Find elements with same tag and parent structure
 */
function findByStructure(element: Element): PatternMatch {
    const parent = element.parentElement;
    if (!parent) {
        return { elements: [], selector: '', confidence: 0, preview: { tagName: '', className: '', count: 0 } };
    }

    const tagName = element.tagName.toLowerCase();
    const parentTag = parent.tagName.toLowerCase();

    // Find all children of the same parent with the same tag
    const selector = `${parentTag} > ${tagName}`;
    const elements = Array.from(parent.querySelectorAll(`:scope > ${tagName}`));

    return {
        elements,
        selector,
        confidence: 0.7,
        preview: {
            tagName,
            className: element.className || '',
            count: elements.length
        }
    };
}

/**
 * Find elements with similar attributes
 */
function findByAttributes(element: Element): PatternMatch {
    const tagName = element.tagName.toLowerCase();

    // Look for data-* attributes (common in modern sites)
    const dataAttrs = Array.from(element.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .map(attr => attr.name);

    if (dataAttrs.length > 0) {
        const attrName = dataAttrs[0];
        const selector = `${tagName}[${attrName}]`;
        const elements = Array.from(document.querySelectorAll(selector));

        return {
            elements,
            selector,
            confidence: 0.8,
            preview: {
                tagName,
                className: element.className || '',
                count: elements.length
            }
        };
    }

    return { elements: [], selector: '', confidence: 0, preview: { tagName: '', className: '', count: 0 } };
}

/**
 * Check if two elements have similar structure
 */
export function isSimilarStructure(el1: Element, el2: Element): boolean {
    // Same tag name
    if (el1.tagName !== el2.tagName) return false;

    // Similar number of children
    const childDiff = Math.abs(el1.children.length - el2.children.length);
    if (childDiff > 2) return false;

    // Similar text length (within 50%)
    const text1 = el1.textContent?.length || 0;
    const text2 = el2.textContent?.length || 0;
    if (text1 > 0 && text2 > 0) {
        const ratio = Math.min(text1, text2) / Math.max(text1, text2);
        if (ratio < 0.5) return false;
    }

    return true;
}

/**
 * Generate a smart selector that matches similar elements
 */
export function generateSmartSelector(element: Element): string {
    // Try class-based selector first
    if (element.className && typeof element.className === 'string') {
        const classes = element.className.trim().split(/\s+/);
        if (classes.length > 0) {
            return `.${classes.join('.')}`;
        }
    }

    // Try tag + attribute selector
    const tagName = element.tagName.toLowerCase();
    const dataAttrs = Array.from(element.attributes)
        .filter(attr => attr.name.startsWith('data-'));

    if (dataAttrs.length > 0) {
        return `${tagName}[${dataAttrs[0].name}]`;
    }

    // Fallback to tag + parent
    if (element.parentElement) {
        const parentTag = element.parentElement.tagName.toLowerCase();
        return `${parentTag} > ${tagName}`;
    }

    return tagName;
}

/**
 * Extract structured data from an element
 */
export interface StructuredData {
    text: string;
    links: string[];
    images: string[];
    prices: string[];
    dates: string[];
    emails: string[];
    phones: string[];
}

export function extractStructuredData(element: Element): StructuredData {
    const text = element.textContent?.trim() || '';

    return {
        text,
        links: extractLinks(element),
        images: extractImages(element),
        prices: extractPrices(text),
        dates: extractDates(text),
        emails: extractEmails(text),
        phones: extractPhones(text)
    };
}

function extractLinks(element: Element): string[] {
    const links = element.querySelectorAll('a[href]');
    return Array.from(links).map(a => (a as HTMLAnchorElement).href);
}

function extractImages(element: Element): string[] {
    const images = element.querySelectorAll('img[src]');
    return Array.from(images).map(img => (img as HTMLImageElement).src);
}

function extractPrices(text: string): string[] {
    // Match: $99.99, €50, £25.50, 99.99USD, etc.
    const priceRegex = /[$€£¥]?\s*\d+[.,]\d{2}\s*(?:USD|EUR|GBP|JPY)?/g;
    return text.match(priceRegex) || [];
}

function extractDates(text: string): string[] {
    // Match: 2026-02-02, 02/02/2026, Feb 2, 2026, etc.
    const dateRegex = /\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\w{3,9}\s+\d{1,2},?\s+\d{4}/g;
    return text.match(dateRegex) || [];
}

function extractEmails(text: string): string[] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return text.match(emailRegex) || [];
}

function extractPhones(text: string): string[] {
    // Match: (123) 456-7890, 123-456-7890, +1 123 456 7890, etc.
    const phoneRegex = /(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
    return text.match(phoneRegex) || [];
}

/**
 * Detect if element is part of a table
 */
export function detectTable(element: Element): HTMLTableElement | null {
    return element.closest('table');
}

/**
 * Scrape entire table
 */
export interface TableData {
    headers: string[];
    rows: string[][];
    rowCount: number;
    columnCount: number;
}

export function scrapeTable(table: HTMLTableElement): TableData {
    const headers: string[] = [];
    const rows: string[][] = [];

    // Extract headers
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
    if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th, td');
        headerCells.forEach(cell => {
            headers.push(cell.textContent?.trim() || '');
        });
    }

    // Extract rows
    const bodyRows = table.querySelectorAll('tbody tr, tr');
    bodyRows.forEach((row, index) => {
        // Skip header row if it's the first row
        if (index === 0 && !table.querySelector('thead')) return;

        const cells = row.querySelectorAll('td, th');
        const rowData: string[] = [];
        cells.forEach(cell => {
            rowData.push(cell.textContent?.trim() || '');
        });
        if (rowData.length > 0) {
            rows.push(rowData);
        }
    });

    return {
        headers,
        rows,
        rowCount: rows.length,
        columnCount: headers.length || (rows[0]?.length || 0)
    };
}
