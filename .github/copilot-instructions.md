**Instructions for Writing New Unit Tests (applies only to the `/tests` command in Copilot):**

1. **Complete Coverage:** Ensure the test suite covers all branches of the component, including every statement, function, and line.

2. **Single Test File:** Place all tests in one comprehensive file. Organize related tests under a relevant `describe` block.

3. **Testing Library:** Use `@testing-library/react`, imported from `app/react/test-utils`.

4. **TypeScript & Casting:** Write tests in TypeScript (TS Version 5), and use type casting whenever you need to mock or manipulate data.

5. **ES Modules Only:** Use only `import`/`export` syntax. Do **not** use `require`.

6. **`__esModule` Usage:** Add `__esModule: true` **only** to objects created within `jest.mock` factory functions.

7. **Minimal Comments:** Only include comments that clarify complex assertions or expectations. Avoid extra commentary or explanations that merely restate your mocks or the initial query.

8. **Event Handler Simulation:** Simulate and assert the behavior of **all** event handlers to confirm they trigger as expected.

9. **State & External Calls:** Verify changes to component state and ensure correct responses to mocked external calls.

10. **Mock Hoisting Caution:** Jest hoists calls to `jest.mock` to the top of the file. If your factory function references variables declared later, wrap them in a function so they aren’t evaluated prematurely.

11. **Mock Variable Naming:** When referencing mock variables inside `jest.mock()`, always use a `mock` prefix (for example, `mockUpdateSubmissionData` instead of `updateSubmissionDataMock`) to ensure they are recognized and properly hoisted by Jest.

12. **Use `describe` and `it` Blocks:** For each test, use `it(...)` to keep the language consistent and clear, tests should be grouped by the target function being called which will be referenced in the describe block.

13. **Destructure props:** By default when proposing changes, destructure the props passed to mock components

14. **Include button type:** Mock buttons should specify type="button"
