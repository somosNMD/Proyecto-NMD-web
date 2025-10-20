import React from "react";
import "@testing-library/jest-dom/vitest";

globalThis.React = React as unknown as typeof React;

const originalMatchMedia = globalThis.matchMedia;

beforeEach(() => {
  globalThis.matchMedia =
    originalMatchMedia ?? (() => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false
    }));
});

