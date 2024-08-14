// web component
class DSHead extends HTMLElement {
  
  // connect component
  connectedCallback() {
    this.textContent = 'Hello World!';
  }
  
}

// register component
customElements.define( 'ds-aajs-head', DSHead );