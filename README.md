# willwhite.dev

Personal website and portfolio for William White, built with Next.js (App
Router), React, TypeScript, and Tailwind CSS. The site is statically exported
(`output: 'export'`) and deployed to GitHub Pages via GitHub Actions on every
push to `main`.

## Development

Requires Node.js 20+ and [pnpm](https://pnpm.io/).

```sh
pnpm install    # install dependencies
pnpm dev        # start the dev server at http://localhost:3000
pnpm build      # production build + static export to ./out
pnpm lint       # run ESLint
pnpm format     # format with Prettier
```

## Credits

The design is based on the [Spotlight](https://spotlight.tailwindui.com/)
Tailwind Plus template.
