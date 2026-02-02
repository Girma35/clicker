// AI-Powered Field Detection using Gemini API

const GEMINI_API_KEY = ''; // ADD YOUR GEMINI API KEY HERE OR IN .env
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface FieldDetection {
    fieldType: 'price' | 'title' | 'description' | 'date' | 'author' | 'rating' | 'image' | 'link' | 'unknown';
    confidence: number;
    reasoning: string;
    suggestedLabel: string;
}

export interface AIAnalysis {
    pageType: 'product-listing' | 'article-list' | 'table' | 'search-results' | 'profile' | 'unknown';
    detectedFields: Map<string, FieldDetection>;
    suggestions: string[];
}

/**
 * Use Gemini AI to detect what type of data an element contains
 */
export async function detectFieldType(element: Element, context?: string): Promise<FieldDetection> {
    const elementInfo = {
        tagName: element.tagName.toLowerCase(),
        className: element.className,
        text: element.textContent?.trim().substring(0, 200), // First 200 chars
        attributes: extractRelevantAttributes(element),
        context: context || 'unknown'
    };

    const prompt = `
You are an expert at analyzing web page elements and identifying what type of data they contain.

Analyze this HTML element and determine what type of field it represents:

Tag: ${elementInfo.tagName}
Classes: ${elementInfo.className}
Text: "${elementInfo.text}"
Attributes: ${JSON.stringify(elementInfo.attributes)}
Context: ${elementInfo.context}

Determine if this element contains:
- price (monetary value)
- title (heading, product name, article title)
- description (longer text content)
- date (timestamp, publication date)
- author (person name, username)
- rating (stars, score, review)
- image (picture, photo)
- link (URL, navigation)
- unknown (if unclear)

Respond in JSON format:
{
  "fieldType": "one of the types above",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief explanation",
  "suggestedLabel": "human-readable label for this field"
}
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 256,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Parse JSON from AI response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const detection = JSON.parse(jsonMatch[0]);
            return detection as FieldDetection;
        }

        // Fallback if parsing fails
        return {
            fieldType: 'unknown',
            confidence: 0.5,
            reasoning: 'Could not parse AI response',
            suggestedLabel: elementInfo.text?.substring(0, 30) || 'Unknown Field'
        };

    } catch (error) {
        console.error('AI detection error:', error);
        // Fallback to rule-based detection
        return fallbackDetection(element);
    }
}

/**
 * Analyze entire page to understand its structure
 */
export async function analyzePage(url: string, sampleElements: Element[]): Promise<AIAnalysis> {
    const pageInfo = {
        url,
        title: document.title,
        sampleElements: sampleElements.slice(0, 5).map(el => ({
            tag: el.tagName.toLowerCase(),
            class: el.className,
            text: el.textContent?.trim().substring(0, 100)
        }))
    };

    const prompt = `
Analyze this web page and determine its type and structure:

URL: ${pageInfo.url}
Title: ${pageInfo.title}
Sample Elements: ${JSON.stringify(pageInfo.sampleElements, null, 2)}

Determine:
1. Page type (product-listing, article-list, table, search-results, profile, or unknown)
2. What fields are likely present (price, title, description, etc.)
3. Suggestions for scraping this page effectively

Respond in JSON format:
{
  "pageType": "page type",
  "likelyFields": ["field1", "field2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 512,
                }
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                pageType: analysis.pageType || 'unknown',
                detectedFields: new Map(),
                suggestions: analysis.suggestions || []
            };
        }

        return {
            pageType: 'unknown',
            detectedFields: new Map(),
            suggestions: ['Use pattern detection for repeated elements']
        };

    } catch (error) {
        console.error('Page analysis error:', error);
        return {
            pageType: 'unknown',
            detectedFields: new Map(),
            suggestions: ['Use Ctrl+Click for pattern detection', 'Use Alt+Click for tables']
        };
    }
}

/**
 * Fallback rule-based detection when AI is unavailable
 */
function fallbackDetection(element: Element): FieldDetection {
    const text = element.textContent?.trim() || '';
    const className = element.className.toLowerCase();
    const tagName = element.tagName.toLowerCase();

    // Price detection
    if (text.match(/[$€£¥]\s*\d+[.,]\d{2}/) || className.includes('price')) {
        return {
            fieldType: 'price',
            confidence: 0.8,
            reasoning: 'Contains currency symbol or price class',
            suggestedLabel: 'Price'
        };
    }

    // Title detection
    if (['h1', 'h2', 'h3'].includes(tagName) || className.includes('title') || className.includes('heading')) {
        return {
            fieldType: 'title',
            confidence: 0.8,
            reasoning: 'Heading tag or title class',
            suggestedLabel: 'Title'
        };
    }

    // Date detection
    if (text.match(/\d{4}-\d{2}-\d{2}/) || className.includes('date') || className.includes('time')) {
        return {
            fieldType: 'date',
            confidence: 0.7,
            reasoning: 'Date format or date class',
            suggestedLabel: 'Date'
        };
    }

    // Image detection
    if (tagName === 'img' || className.includes('image') || className.includes('photo')) {
        return {
            fieldType: 'image',
            confidence: 0.9,
            reasoning: 'Image tag or image class',
            suggestedLabel: 'Image'
        };
    }

    // Link detection
    if (tagName === 'a' || className.includes('link')) {
        return {
            fieldType: 'link',
            confidence: 0.9,
            reasoning: 'Anchor tag or link class',
            suggestedLabel: 'Link'
        };
    }

    // Description detection
    if (text.length > 100 || className.includes('description') || className.includes('content')) {
        return {
            fieldType: 'description',
            confidence: 0.6,
            reasoning: 'Long text or description class',
            suggestedLabel: 'Description'
        };
    }

    return {
        fieldType: 'unknown',
        confidence: 0.3,
        reasoning: 'Could not determine field type',
        suggestedLabel: text.substring(0, 30) || 'Unknown'
    };
}

function extractRelevantAttributes(element: Element): Record<string, string> {
    const relevant: Record<string, string> = {};
    const attrs = ['id', 'class', 'data-price', 'data-id', 'href', 'src', 'alt', 'title'];

    attrs.forEach(attr => {
        const value = element.getAttribute(attr);
        if (value) {
            relevant[attr] = value;
        }
    });

    return relevant;
}
