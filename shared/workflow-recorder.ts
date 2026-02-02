// Workflow Recorder - records and replays user operations

export interface WorkflowAction {
    type: 'click' | 'input' | 'scroll' | 'wait' | 'scrape';
    selector: string;
    value?: string;
    timestamp: number;
    delay?: number;
}

export interface ScrapingWorkflow {
    id: string;
    name: string;
    url: string;
    actions: WorkflowAction[];
    createdAt: number;
}

export class WorkflowRecorder {
    private actions: WorkflowAction[] = [];
    private isRecording: boolean = false;
    private startTime: number = 0;

    start() {
        this.isRecording = true;
        this.actions = [];
        this.startTime = Date.now();
        this.setupListeners();
        console.log('⏺️ Workflow recording started');
    }

    stop(): ScrapingWorkflow {
        this.isRecording = false;
        this.removeListeners();
        console.log('⏹️ Workflow recording stopped', this.actions);

        return {
            id: `wf-${Date.now()}`,
            name: `Workflow ${new Date().toLocaleString()}`,
            url: window.location.href,
            actions: this.actions,
            createdAt: Date.now()
        };
    }

    private setupListeners() {
        document.addEventListener('click', this.handleClick.bind(this), true);
        document.addEventListener('input', this.handleInput.bind(this), true);
    }

    private removeListeners() {
        document.removeEventListener('click', this.handleClick.bind(this), true);
        document.removeEventListener('input', this.handleInput.bind(this), true);
    }

    private handleClick(event: MouseEvent) {
        if (!this.isRecording) return;

        const target = event.target as HTMLElement;
        // Don't record clicks on the highlight overlay or extension UI if injected
        if (target.id.includes('scraper-')) return;

        const selector = this.getUniqueSelector(target);

        this.addAction({
            type: 'click',
            selector,
            timestamp: Date.now()
        });
    }

    private handleInput(event: Event) {
        if (!this.isRecording) return;

        const target = event.target as HTMLInputElement;
        const selector = this.getUniqueSelector(target);

        this.addAction({
            type: 'input',
            selector,
            value: target.value,
            timestamp: Date.now()
        });
    }

    private addAction(action: WorkflowAction) {
        const lastAction = this.actions[this.actions.length - 1];
        const delay = lastAction ? action.timestamp - lastAction.timestamp : 0;

        this.actions.push({
            ...action,
            delay: Math.max(delay, 500) // Minimum 500ms delay between actions
        });
    }

    recordScrapeAction(selector: string) {
        if (!this.isRecording) return;
        this.addAction({
            type: 'scrape',
            selector,
            timestamp: Date.now()
        });
    }

    private getUniqueSelector(el: HTMLElement): string {
        if (el.id && !/\d{5,}/.test(el.id)) return `#${el.id}`;

        let path = [];
        let current: HTMLElement | null = el;

        while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
            let selector = current.tagName.toLowerCase();

            // Add class if it looks stable
            if (current.className && typeof current.className === 'string') {
                const classes = current.className.trim().split(/\s+/)
                    .filter(c => c && !/\d{5,}/.test(c) && !c.includes(':'));
                if (classes.length > 0) {
                    selector += `.${classes[0]}`;
                }
            }

            // Add index if not unique among siblings of same tag
            const parent: HTMLElement | null = current.parentElement;
            if (parent) {
                const siblings = Array.from(parent.children);
                const sameTagSiblings = siblings.filter((s: Element) => s.tagName === (current as HTMLElement).tagName);
                if (sameTagSiblings.length > 1) {
                    const index = siblings.indexOf(current) + 1;
                    selector += `:nth-child(${index})`;
                }
            }

            path.unshift(selector);
            current = parent;
        }

        return path.join(' > ');
    }
}

export class WorkflowReplayer {
    async replay(workflow: ScrapingWorkflow, onScrape: (selector: string) => void) {
        console.log(`▶️ Replaying workflow: ${workflow.name}`);

        for (const action of workflow.actions) {
            const delay = action.delay || 1000;
            await new Promise(r => setTimeout(r, delay));

            try {
                await this.executeAction(action, onScrape);
            } catch (error) {
                console.error(`Failed action ${action.type}:`, error);
                // Attempt to continue
            }
        }

        console.log('✅ Workflow replay complete');
    }

    private async executeAction(action: WorkflowAction, onScrape: (selector: string) => void) {
        if (action.type === 'scrape') {
            onScrape(action.selector);
            return;
        }

        const element = document.querySelector(action.selector) as HTMLElement;
        if (!element) {
            // Try a more relaxed search if exact selector fails
            throw new Error(`Element not found: ${action.selector}`);
        }

        switch (action.type) {
            case 'click':
                element.scrollIntoView({ block: 'center', behavior: 'smooth' });
                await new Promise(r => setTimeout(r, 300));
                element.click();
                break;
            case 'input':
                if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                    element.value = action.value || '';
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                }
                break;
            case 'scroll':
                window.scrollTo({
                    top: parseInt(action.value || '0'),
                    behavior: 'smooth'
                });
                break;
        }
    }
}
