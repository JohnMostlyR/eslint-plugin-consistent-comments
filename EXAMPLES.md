Edge-case examples

See `examples/directives-edgecases.ts` for tricky cases the rule handles:

- Directives with unusual Unicode whitespace (for example, NBSP) are still recognized as directives.
- Comment-like content inside template literals is not treated as code comments.
- Multi-line block comments that include a directive plus explanatory text are preserved as blocks.

This file demonstrates the plugin behavior for unusual comment cases and can be used as a reference when debugging or extending directive detection logic.
