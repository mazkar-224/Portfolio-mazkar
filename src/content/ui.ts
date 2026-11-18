// Interface strings for the layout shell (header, menu, footer).
// New strings, listed for Muhammad at the end of Phase 3.

export const ui = {
  skipLink: "Skip to content",
  mainNavLabel: "Main",
  footerNavLabel: "Footer",
  /** Header status link; the same fact as the HUD's STATUS. Links to the contact section. */
  headerStatus: "Open to work",
  menuOpen: "Menu",
  menuClose: "Close",
  menuDialogLabel: "Site menu",
  /** The preloader's one line (CLAUDE.md "Preloader", from the theme's boot screen). */
  preloaderLabel: "ACQUIRING SIGNAL",
  footer: {
    localTime: "Local time",
    ci: "CloudCostGuard CI",
    sections: "Sections",
    contact: "Contact",
  },
} as const;
