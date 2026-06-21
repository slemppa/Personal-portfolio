# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Declarative portfolio site. PostHog is initialised in `src/main.tsx` with `PostHogProvider` and `PostHogErrorBoundary` wrapping the entire app, giving automatic error capture and pageview tracking out of the box. Nine custom events were added across six files to cover every key conversion touchpoint: hero CTAs, case study navigation, contact clicks, social/company link clicks, YouTube subscribe, and blog post engagement.

| Event | Description | File |
|---|---|---|
| `hero_cta_clicked` | Click on "Keskustellaan projektista" or "Katso projektit" hero buttons | `src/components/Hero.tsx` |
| `case_study_clicked` | Click on a case study card (includes `case_slug`, `case_title`, `featured`) | `src/components/Cases.tsx` |
| `contact_email_clicked` | Click on the email CTA button in the contact section | `src/components/Contact.tsx` |
| `social_link_clicked` | Click on a social profile link — LinkedIn, YouTube, or GitHub (includes `platform`) | `src/components/Contact.tsx` |
| `company_link_clicked` | Click on a company link — Rascal AI, Superhuman, or Mak8r.fi (includes `company_name`) | `src/components/Contact.tsx` |
| `youtube_subscribe_clicked` | Click on the YouTube channel subscribe button | `src/components/YouTube.tsx` |
| `blog_post_clicked` | Click on a blog post card in the blog listing (includes `post_slug`, `post_title`) | `src/pages/BlogList.tsx` |
| `case_study_external_link_clicked` | Click on an external link within a case study page (includes `case_slug`, `link_label`) | `src/pages/CaseStudy.tsx` |
| `case_study_contact_clicked` | Click on the contact CTA at the bottom of a case study page (includes `case_slug`) | `src/pages/CaseStudy.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/202724/dashboard/750162)
- [Hero & Contact CTA clicks](https://eu.posthog.com/project/202724/insights/V2UVCssM)
- [Case study → contact conversion funnel](https://eu.posthog.com/project/202724/insights/zAEk4qwg)
- [Case study clicks by project](https://eu.posthog.com/project/202724/insights/MrdB0ym0)
- [External link clicks](https://eu.posthog.com/project/202724/insights/hfBh2aXU)
- [Blog post clicks over time](https://eu.posthog.com/project/202724/insights/4nt9cZ4d)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
