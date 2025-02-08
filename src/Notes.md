w# My Notes on Versioning in package.json

This document explains the difference between `~` and `^` in package.json version numbers in simple terms.

## ~ (Tilde)
- **Allows patch-level changes**
- Only updates the last number in the version
- **Example:** `~1.2.3` allows updates to `1.2.4`, `1.2.5`, etc., but not to `1.3.0`
- Good for bug fixes while keeping things stable


**Q: How can I play with routes and route extensions?**

**A:** You can experiment with different routes and route extensions, for example, `/hello`, `/`, `hello/2`, `/xyz`. Remember, the order of the routes matters a lot.

Read more about indexes in MongoDB
Why do we need index in DB?
What is the advantages and disadvantage of creating?