# willwhite.dev

Personal website and portfolio for William White, built with Next.js (App
Router), React, TypeScript, and Tailwind CSS. The site is statically exported
(`output: 'export'`) and deployed to GitHub Pages via GitHub Actions on every
push to `main`.

## Development

Requires Node.js 24 and [pnpm](https://pnpm.io/).

```sh
pnpm install    # install dependencies
pnpm dev        # start the dev server at http://localhost:3000
pnpm build      # production build + static export to ./out
pnpm lint       # run ESLint
pnpm check-links # after a build: fail on broken internal links in ./out
pnpm format     # format with Prettier
```

## Analytics

Page views and resume PDF downloads are counted with
[GoatCounter](https://www.goatcounter.com/) (no cookies). It is off unless the
`GOATCOUNTER_CODE` repository variable is set (Settings → Secrets and
variables → Actions → Variables) to the site code, the `xyz` in
`xyz.goatcounter.com`. The next deploy picks it up.

## Credits

The design is based on the [Spotlight](https://spotlight.tailwindui.com/)
Tailwind Plus template.
