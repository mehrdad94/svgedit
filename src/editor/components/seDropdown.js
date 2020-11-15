/* eslint-disable node/no-unpublished-import */
import ListComboBox from 'elix/define/ListComboBox.js';
import NumberSpinBox from 'elix/define/NumberSpinBox.js';
// import Input from 'elix/src/base/Input.js';
import {defaultState} from 'elix/src/base/internal.js';
import {templateFrom, fragmentFrom} from 'elix/src/core/htmlLiterals.js';
import {internal} from 'elix';

/**
 * @class CustomCombo
 */
class CustomCombo extends ListComboBox {
  /**
    * @function get
    * @returns {PlainObject}
    */
  get [defaultState] () {
    return Object.assign(super[defaultState], {
      inputPartType: NumberSpinBox,
      src: './images/logo.svg',
      inputsize: '100%'
    });
  }
  /**
    * @function get
    * @returns {PlainObject}
  */
  get [internal.template] () {
    const result = super[internal.template];
    const source = result.content.getElementById('source');
    // add a icon before our dropdown
    source.prepend(fragmentFrom.html`
      <img src="./images/logo.svg" alt="icon" width="18" height="18"></img>
      `.cloneNode(true));
    // change the style so it fits in our toolbar
    result.content.append(
      templateFrom.html`
        <style>
        :host {
          float:left;
        }
        [part~="source"] {
          grid-template-columns: 20px 1fr auto;
          margin-top: 4px;
        }
        ::slotted(*) {
          padding: 4px;
          background: #E8E8E8;
          border: 1px solid #B0B0B0;
          margin: 0 0 -1px 0;
          line-height: 16px;
        }
        [part~="popup"] {
          width: max-content;
        }
        </style>
      `.content
    );
    return result;
  }
  /**
   * @function observedAttributes
   * @returns {any} observed
   */
  static get observedAttributes () {
    return ['title', 'src', 'inputsize'];
  }
  /**
   * @function attributeChangedCallback
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   * @returns {void}
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue === newValue) return;
    console.log({this: this, name, oldValue, newValue});
    switch (name) {
    case 'title':
      // this.$span.setAttribute('title', `${newValue} ${shortcut ? `[${shortcut}]` : ''}`);
      break;
    case 'src':
      this.src = newValue;
      break;
    case 'inputsize':
      this.inputsize = newValue;
      break;
    default:
      super.attributeChangedCallback(name, oldValue, newValue);
      break;
    }
  }
  /**
    * @function [internal.render]
    * @param {PlainObject} changed
    * @returns {void}
    */
  [internal.render] (changed) {
    super[internal.render](changed);
    // console.log(this, changed);
    if (this[internal.firstRender]) {
      this.$img = this.shadowRoot.querySelector('img');
      this.$input = this.shadowRoot.getElementById('input');
      this.$event = new CustomEvent('change');
      this.addEventListener('selectedindexchange', (e) => {
        e.preventDefault();
        this.value = this.children[e.detail.selectedIndex].getAttribute('value');
      });
    }
    if (changed.src) {
      this.$img.setAttribute('src', this[internal.state].src);
    }
    if (changed.inputsize) {
      this.$input.shadowRoot.querySelector('[part~="input"]').style.width = this[internal.state].inputsize;
    }
    if (changed.value) {
      console.log('value=', this[internal.state].value);
      this.dispatchEvent(this.$event);
    }
    if (changed.inputPartType) {
      // Wire up handler on new input.
      this.$input.addEventListener('click', (e) => {
        e.preventDefault();
        this.value = e.target.value;
      });
    }
  }
  /**
   * @function src
   * @returns {string} src
   */
  get src () {
    return this[internal.state].src;
  }
  /**
   * @function src
   * @returns {void}
   */
  set src (src) {
    this[internal.setState]({src});
  }
  /**
   * @function inputsize
   * @returns {string} src
   */
  get inputsize () {
    return this[internal.state].inputsize;
  }
  /**
   * @function src
   * @returns {void}
   */
  set inputsize (inputsize) {
    this[internal.setState]({inputsize});
  }
}

// Register
customElements.define('se-dropdown', CustomCombo);

/*
{TODO
    min: 0.001, max: 10000, step: 50, stepfunc: stepZoom,
  function stepZoom (elem, step) {
    const origVal = Number(elem.value);
    if (origVal === 0) { return 100; }
    const sugVal = origVal + step;
    if (step === 0) { return origVal; }

    if (origVal >= 100) {
      return sugVal;
    }
    if (sugVal >= origVal) {
      return origVal * 2;
    }
    return origVal / 2;
  }
*/
