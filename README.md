From the project folder:

```bash
# Deploy to production
netlify deploy --build --prod
```

Preview only (not live):

```bash
netlify deploy --build
```

First time on a new machine (if needed):

```bash
netlify login
netlify link
```

That’s it — env vars are already set on the Netlify site, so you don’t need to set them again unless they change.
