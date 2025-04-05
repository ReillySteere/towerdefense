# COPILOT EDITS OPERATIONAL GUIDELINES

## PRIME DIRECTIVE

    Avoid working on more than one file at a time.
    Multiple simultaneous edits to a file will cause corruption.
    Be chatting and teach about what you are doing while coding.

## LARGE FILE & COMPLEX CHANGE PROTOCOL

### MANDATORY PLANNING PHASE

    When working with large files (>300 lines) or complex changes:
    	1. ALWAYS start by creating a detailed plan BEFORE making any edits
            2. Your plan MUST include:
                   - All functions/sections that need modification
                   - The order in which changes should be applied
                   - Dependencies between changes
                   - Estimated number of separate edits required

            3. Format your plan as:

## PROPOSED EDIT PLAN

    Working with: [filename]
    Total planned edits: [number]

### MAKING EDITS

    - Focus on one conceptual change at a time
    - Show clear "before" and "after" snippets when proposing changes
    - Include concise explanations of what changed and why
    - Always check if the edit maintains the project's coding style

### Edit sequence:

    1. [First specific change] - Purpose: [why]
    2. [Second specific change] - Purpose: [why]
    3. Do you approve this plan? I'll proceed with Edit [number] after your confirmation.
    4. WAIT for explicit user confirmation before making ANY edits when user ok edit [number]

### EXECUTION PHASE

    - After each individual edit, clearly indicate progress:
    	"✅ Completed edit [#] of [total]. Ready for next edit?"
    - If you discover additional needed changes during editing:
    - STOP and update the plan
    - Get approval before continuing

### REFACTORING GUIDANCE

    When refactoring large files:
    - Break work into logical, independently functional chunks
    - Ensure each intermediate state maintains functionality
    - Consider temporary duplication as a valid interim step
    - Always indicate the refactoring pattern being applied

### RATE LIMIT AVOIDANCE

    - For very large files, suggest splitting changes across multiple sessions
    - Prioritize changes that are logically complete units
    - Always provide clear stopping points

### Accessibility

    - Ensure compliance with **WCAG 2.1** AA level minimum, AAA whenever feasible.
    - Always suggest:
    - Labels for form fields.
    - Proper **ARIA** roles and attributes.
    - Adequate color contrast.
    - Alternative texts (`alt`, `aria-label`) for media elements.
    - Semantic HTML for clear structure.
    - Tools like **Lighthouse** for audits.

## Browser Compatibility

    - Prioritize feature detection (`if ('fetch' in window)` etc.).
        - Support latest two stable releases of major browsers:
    - Firefox, Chrome, Edge, Safari (macOS/iOS)

## HTML/SCSS Requirements

    - **HTML**:
    - Use HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<search>`, etc.)
    - Include appropriate ARIA attributes for accessibility
    - Ensure valid markup that passes W3C validation
    - Use responsive design practices
    - Optimize images using modern formats (`WebP`, `AVIF`)
    - Include `loading="lazy"` on images where applicable
    - Generate `srcset` and `sizes` attributes for responsive images when relevant
    - Prioritize SEO-friendly elements (`<title>`, `<meta description>`, Open Graph tags)

    - **SCSS**:
    - SCSS Modules will be co-located with React components, imported and applied via classname to react components
    - Use Media queries for responsive design
    - Classes should be built with "small" as the base configuration, and higher breakpoints altering the base styles
    - Project breakpoints are small: 320px and up, medium: 768px and up, and desktop, 1024px and up
    - Modern selectors (`:is()`, `:where()`, `:has()`)
    - Include dark mode support with `prefers-color-scheme`

## Folder Structure

    Follow this structured directory layout:

    project-root/
    ├── server/                 # Backend - Contains API and all server side code - code here should be exclusively written for NestJS in TypeScript
    ├── src/                    # Application source code - tests are co-located
    │   ├── controllers/        # Define exposed API
    │   ├── models/
    |   ├── services/           # Assist with backend operations / injectable
    │   ├── views/              # Customize data for front-end / not injectable
    │   └── utilities/
    ├── ui/                     # Frontend - Contains all browser-side code - contains cypress testing / react code / phaser implementation
    |   ├── src/
    |   |   ├── react           # UI Files / TSX - all test files are in Jest and co-located with their componets
    |   |   ├── engine          # Game engine code for PhaserJS
    |   |   ├── cypress         # Cypress test scripts for e2e testing
    |   ├── dist/                   # Publicly accessible files (served by web server)
    │   |   ├── assets/
    │   |   │   |── css/
    │   |   │   ├── js/
    │   |   │   ├── images/
    │   |   │   ├── fonts/
    │   |   └── index.html
    ├── shared/                 # Shared entities between both server and UI
    ├── docs/                 # Documentation (Markdown files)
    ├── logs/                 # Server and application logs

## Documentation Requirements

    - Include JSDoc comments for JavaScript/TypeScript.
    - Document complex functions with clear examples.
    - Maintain concise Markdown documentation.
    - Minimum docblock info: `param`, `return`, `throws`, `author`

## Testing Requirements

- Ensure the test suite covers all branches of the component, including every statement, function, and line.
- Place all tests for a unit in one comprehensive file.
- Organize related tests under a relevant `describe` block.
- Use `@testing-library/react`, imported from `app/react/test-utils` for JSX unit testing.
- Write tests in TypeScript (TS Version 5), and use type casting whenever you need to mock or manipulate data.
- Use only `import`/`export` esmodule syntax. Do **not** use `require`.
- Add `__esModule: true` **only** to objects created within `jest.mock` factory functions.
- Only include comments that clarify complex assertions or expectations.
- Avoid extra commentary or explanations that merely restate your mocks or the initial query.
- Simulate and assert the behavior of **all** event handlers to confirm they trigger as expected.
- Verify changes to component state and ensure correct responses to mocked external calls.
- Jest hoists calls to `jest.mock` to the top of the file. If your factory function references variables declared later, wrap them in a function so they aren’t evaluated prematurely.
- When referencing mock variables inside `jest.mock()`, always use a `mock` prefix (for example, `mockUpdateSubmissionData` instead of `updateSubmissionDataMock`) to ensure they are recognized and properly hoisted by Jest.
- **Use `describe` and `it` Blocks:** For each test, use `it(...)` to keep the language consistent and clear, tests should be grouped by the target function being called which will be referenced in the describe block.
- By default when proposing changes, destructure the props passed to mock components
- If a variable is unused, prefix it with \_
- Mock buttons should specify type="button"
