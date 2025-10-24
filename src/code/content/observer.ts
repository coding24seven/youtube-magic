import { customEvents } from './events';

export interface EmittedNodeEventHandler {
  (event: CustomEvent<ObservedElementDetail>): void;
}

export interface ObservedElementDetail {
  element: HTMLElement;
  action: NodeAction;
}

type NodeAction = 'addedNodes' | 'removedNodes';

export default class Observer {
  mutationObserver: MutationObserver;

  public constructor(
    private observedElement: HTMLElement,
    private eventBus: EventTarget,
    private exclusionSelectors?: string[],
  ) {
    this.mutationObserver = this.create();
  }

  public create() {
    return new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== 'childList') {
          continue;
        }

        const { addedNodes, removedNodes } = mutation;
        const nodes = { addedNodes, removedNodes };

        for (const key in nodes) {
          const action = key as NodeAction;

          mutation[action].forEach((node) => {
            if (!this.isElement(node)) {
              return;
            }

            const element = node;

            if (this.isElementExcluded(element)) {
              return;
            }

            const observerEvent = new CustomEvent(
              customEvents.observedElement,
              {
                detail: { element, action } as ObservedElementDetail,
              },
            );

            this.eventBus.dispatchEvent(observerEvent);
          });
        }
      }
    });
  }

  public activate() {
    this.mutationObserver.observe(this.observedElement, {
      childList: true,
      subtree: true,
    });
    console.info('Observer activated on element:', this.observedElement);
  }

  public deactivate() {
    this.mutationObserver.disconnect();
    console.info('Observer deactivated on element:', this.observedElement);
  }

  private isElement(node: Node): node is HTMLElement {
    return node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement;
  }

  private isElementExcluded(element: HTMLElement) {
    return !!this.exclusionSelectors?.some((selector) =>
      element.matches(selector),
    );
  }
}
