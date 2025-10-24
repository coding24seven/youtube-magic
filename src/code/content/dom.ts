import Observer, { EmittedNodeEventHandler } from './observer';
import { customEvents } from './events';

export default class Dom {
  public static setVisibility(element: HTMLElement, hide: boolean) {
    if (hide) {
      element.style.display = 'none';
    } else {
      element.style.display = '';
    }
  }

  public static isHidden(element: HTMLElement) {
    return window.getComputedStyle(element).display === 'none';
  }

  public static isVisibleOnPage(element: HTMLElement) {
    let parent: HTMLElement | null = element;

    while (parent) {
      if (this.isHidden(parent)) {
        return false;
      }

      parent = parent.parentElement;
    }

    return true;
  }

  public static find(
    element: HTMLElement,
    selector: string,
  ): HTMLElement | null {
    if (element.matches(selector)) {
      return element;
    }

    return element.querySelector(selector);
  }

  public static getAncestor(ancestorSelector: string, descendant: HTMLElement) {
    let parent: HTMLElement | null = descendant;

    while (parent) {
      if (parent.matches(ancestorSelector)) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return null;
  }

  public static async _waitForElementToStopMutating(
    element: HTMLElement,
    waitMs: number,
  ) {
    return new Promise(async (resolve) => {
      const fallbackTimeout = setTimeout(() => {
        console.info('Element is not mutating. Returning...');
        clearTimeout(observerTimeout);
        observer.deactivate();
        eventBus.removeEventListener(...args);
        resolve(false);
      }, waitMs); /* in case observer handler does not fire */

      let observerTimeout: NodeJS.Timeout;

      const handler: EmittedNodeEventHandler = (_event) => {
        clearTimeout(fallbackTimeout);
        clearTimeout(observerTimeout);

        observerTimeout = setTimeout(() => {
          console.info(
            `Element has stopped mutating for ${waitMs}ms. Returning...`,
          );
          observer.deactivate();
          eventBus.removeEventListener(...args);
          resolve(true);
        }, waitMs);
      };

      const eventBus = new EventTarget();
      const args: [string, EventListener] = [
        customEvents.observedElement,
        handler as EventListener,
      ];

      eventBus.addEventListener(...args);

      const observer = new Observer(element, eventBus);
      observer.activate();
    });
  }
}
