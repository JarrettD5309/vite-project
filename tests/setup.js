import * as matchers from 'jest-extended';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

import '@testing-library/jest-dom/vitest';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});