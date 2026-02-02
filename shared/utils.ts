// Utility functions shared across the extension

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateCSSSelector(element: Element): string {
    if (element.id) {
        return `#${element.id}`;
    }

    const path: string[] = [];
    let current: Element | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
        let selector = current.nodeName.toLowerCase();

        if (current.className) {
            const classes = current.className.split(' ').filter(c => c.trim());
            if (classes.length > 0) {
                selector += '.' + classes.join('.');
            }
        }

        // Add nth-child if needed for uniqueness
        if (current.parentElement) {
            const siblings = Array.from(current.parentElement.children);
            const sameTagSiblings = siblings.filter(s => s.nodeName === current!.nodeName);
            if (sameTagSiblings.length > 1) {
                const index = sameTagSiblings.indexOf(current) + 1;
                selector += `:nth-of-type(${index})`;
            }
        }

        path.unshift(selector);
        current = current.parentElement;

        // Stop at a reasonable depth
        if (path.length > 5) break;
    }

    return path.join(' > ');
}

export function generateXPath(element: Element): string {
    if (element.id) {
        return `//*[@id="${element.id}"]`;
    }

    const parts: string[] = [];
    let current: Element | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
        let index = 0;
        let sibling: Element | null = current;

        while (sibling) {
            if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
                index++;
            }
            sibling = sibling.previousElementSibling;
        }

        const tagName = current.nodeName.toLowerCase();
        const pathIndex = index > 1 ? `[${index}]` : '';
        parts.unshift(`${tagName}${pathIndex}`);

        current = current.parentElement;
    }

    return '/' + parts.join('/');
}

export function exportToJSON(data: any): string {
    return JSON.stringify(data, null, 2);
}

export function exportToCSV(elements: any[]): string {
    if (elements.length === 0) return '';

    // Get all unique keys
    const keys = Array.from(
        new Set(elements.flatMap(el => Object.keys(el)))
    );

    // Create header
    const header = keys.join(',');

    // Create rows
    const rows = elements.map(el => {
        return keys.map(key => {
            const value = el[key];
            if (typeof value === 'object') {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
    });

    return [header, ...rows].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

export function truncateText(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
