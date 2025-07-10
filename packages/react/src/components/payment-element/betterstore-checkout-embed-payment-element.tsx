class BetterStoreCheckoutEmbedPaymentElement extends HTMLElement {
  private shadow: ShadowRoot;
  private portalContainer: HTMLElement;
  private wrapper: HTMLElement;
  private resizeObserver: ResizeObserver;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    // Render a <slot> or placeholder into the Shadow DOM
    this.wrapper = document.createElement("div");
    this.wrapper.style.width = "100%";
    this.wrapper.style.minHeight = "220px";
    this.wrapper.innerHTML = `<slot></slot>`;
    this.shadow.appendChild(this.wrapper);

    // Create or find a container outside Shadow DOM
    this.portalContainer = document.createElement("div");
    this.portalContainer.style.position = "absolute"; // or fixed, up to you
    document.body.appendChild(this.portalContainer); // render into light DOM

    // Initialize ResizeObserver to watch for Stripe element height changes
    this.resizeObserver = new ResizeObserver(() => {
      this.updateStripeElementHeight();
    });
  }

  connectedCallback() {
    // Move children to portalContainer (light DOM)
    const children = Array.from(this.children);
    children.forEach((child) => {
      this.portalContainer.appendChild(child);
    });

    this.updatePosition();
    window.addEventListener("resize", this.updatePosition);
    window.addEventListener("scroll", this.updatePosition, true);

    // Start observing the Stripe element for height changes
    this.observeStripeElement();
  }

  disconnectedCallback() {
    // Clean up
    this.portalContainer.remove();
    window.removeEventListener("resize", this.updatePosition);
    window.removeEventListener("scroll", this.updatePosition, true);
    this.resizeObserver.disconnect();
  }

  updatePosition = () => {
    const rect = this.getBoundingClientRect();
    this.portalContainer.style.top = `${rect.top + window.scrollY}px`;
    this.portalContainer.style.left = `${rect.left + window.scrollX}px`;
    this.portalContainer.style.width = `${rect.width}px`;
    this.portalContainer.style.height = `${rect.height}px`;
  };

  updateStripeElementHeight = () => {
    const stripeElement = this.portalContainer.querySelector(".StripeElement");
    if (stripeElement) {
      const { height } = stripeElement.getBoundingClientRect();
      this.wrapper.style.height = `${height}px`;
    }
  };

  observeStripeElement = () => {
    // Wait a bit for the Stripe element to be rendered
    setTimeout(() => {
      const stripeElement =
        this.portalContainer.querySelector(".StripeElement");
      if (stripeElement) {
        this.resizeObserver.observe(stripeElement);
        this.updateStripeElementHeight(); // Initial height update
      }
    }, 100);
  };
}

customElements.define(
  "betterstore-checkout-embed-payment-element",
  BetterStoreCheckoutEmbedPaymentElement
);
