const { test, beforeEach, before } = require('node:test');
const assert = require('assert');

let toggleMobileMenu;
let closeMobileMenu;
let navLinks;
let menuToggle;
let overlay;

function createElement() {
  const classes = new Set();
  return {
    classList: {
      add: cls => classes.add(cls),
      remove: cls => classes.delete(cls),
      toggle: cls => classes.has(cls) ? classes.delete(cls) : classes.add(cls),
      contains: cls => classes.has(cls)
    }
  };
}

function setupDOM() {
  navLinks = createElement();
  menuToggle = createElement();
  overlay = createElement();

  global.document = {
    body: { style: { overflow: '' } },
    getElementById: id => {
      if (id === 'nav-links') return navLinks;
      if (id === 'nav-overlay') return overlay;
      return null;
    },
    querySelector: selector => (selector === '.mobile-menu-toggle' ? menuToggle : null),
    querySelectorAll: () => ({ forEach: () => {} }),
    addEventListener: () => {},
    head: { appendChild: () => {} }
  };

  global.window = {
    addEventListener: () => {},
    requestAnimationFrame: fn => fn(),
    scrollY: 0
  };

  global.navigator = {};
}

before(() => {
  setupDOM();
  ({ toggleMobileMenu, closeMobileMenu } = require('../script.js'));
});

beforeEach(() => {
  setupDOM();
});

test('toggleMobileMenu toggles active classes on elements', () => {
  toggleMobileMenu();
  assert(navLinks.classList.contains('active'));
  assert(menuToggle.classList.contains('active'));
  assert(overlay.classList.contains('active'));

  toggleMobileMenu();
  assert(!navLinks.classList.contains('active'));
  assert(!menuToggle.classList.contains('active'));
  assert(!overlay.classList.contains('active'));
});

test('toggleMobileMenu toggles body scroll lock', () => {
  toggleMobileMenu();
  assert.strictEqual(document.body.style.overflow, 'hidden');

  toggleMobileMenu();
  assert.strictEqual(document.body.style.overflow, '');
});

test('closeMobileMenu clears active classes and restores scroll', () => {
  toggleMobileMenu();
  closeMobileMenu();

  assert(!navLinks.classList.contains('active'));
  assert(!menuToggle.classList.contains('active'));
  assert(!overlay.classList.contains('active'));
  assert.strictEqual(document.body.style.overflow, '');
});
