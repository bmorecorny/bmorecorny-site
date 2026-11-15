# BmoreCorny website starter

This is a first visual direction and editable-content starter for BmoreCorny. It is intentionally a lightweight static website: no paid website builder, no database, and no server to maintain.

## Planned stack

- Domain stays registered at GoDaddy.
- Static site hosting: GitHub Pages (free for a public repository).
- Visual content editing: Pages CMS (free hosted editor).
- Website files and content: a GitHub repository owned by you.

## What you can edit

The `.pages.yml` file configures the Pages CMS editor. The homepage text, links, challenge details, fundraising copy, social links and footer tagline live in `content/site.json`.

Once the repository is connected to Pages CMS, you can sign in and edit those fields in a visual interface. Saving writes the changes to your GitHub repository. GitHub Pages then publishes the updated site.

## Setup overview

1. Create or sign in to a GitHub account.
2. Create a **public** repository named `bmorecorny-site`.
3. Upload the contents of this folder to the repository root (not the outer ZIP folder).
4. In GitHub, open Settings → Pages. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Open https://app.pagescms.org and sign in with GitHub.
6. Install/authorize the Pages CMS GitHub App for the `bmorecorny-site` repository.
7. Open the repository in Pages CMS. It should detect `.pages.yml`; if prompted, create/confirm the config.
8. Edit the Homepage fields and save.
9. In GitHub, under Settings → Pages, add your custom domain once the site is publishing successfully.

## Connecting the GoDaddy domain

Do not change nameservers or transfer the domain. When GitHub Pages is ready, add `bmorecorny.com` as the custom domain in GitHub Pages settings. GitHub will show the DNS records it expects. Add those records in GoDaddy DNS. DNS values can change, so use the exact values shown by GitHub at setup time.

## Important first-draft notes

- The current design is a starting point, not a final brand identity.
- The social links currently use generic placeholders. Replace them in the CMS before launch.
- The fundraising beneficiary and 100-Footer rules are intentionally not invented.
- The graphic is CSS illustration, not a replacement for your actual Shucky artwork or logo.
- Keep a copy of this ZIP as a backup. You own the site files and can move them to another host later.

## Editing the design

The CMS is designed for changing site content. Larger layout/design changes are made in `index.html` and `assets/style.css`. You can ask for those changes, or edit the files directly.
