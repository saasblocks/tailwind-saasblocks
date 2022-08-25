const plugin = require("tailwindcss/plugin");
const svgToDataUri = require("mini-svg-data-uri");
const defaultTheme = require("./themes/midnight-envy.theme");
const defaultGradients = require("./gradients/default.gradients");

const defaultOptions = {
  themes: { dark: defaultTheme },
  gradients: defaultGradients,
};

module.exports = plugin.withOptions(
  function (_options) {
    const options = {
      ...defaultOptions,
      ...(_options || {}),
    };
    return function ({
      addBase,
      addUtilities,
      addComponents,
      matchUtilities,
      theme,
    }) {
      const themes = Object.entries(options.themes);
      const defaultTheme = themes[0][1];
      const themeCss = themes.reduce((css, [themeName, themeValue]) => {
        css[`.${themeName}`] = themeValue.colors;
        return css;
      }, {});

      // ===== Base =====
      addBase({
        // default CSS
        body: {
          color: "rgb(var(--color-text) / var(--tw-text-opacity))",
        },

        ".dark": {
          "color-scheme": "dark",
        },

        // CSS variables for color themes
        ":root": {
          ...defaultTheme.colors,
        },
        ...themeCss,
      });

      // ===== Scrollbar =====
      addUtilities({
        ".scrollbar": {
          "--scrollbar-thumb": "rgb(var(--color-muted-3) / 100%)",
          "--scrollbar-track": "rgb(var(--color-muted-1) / 100%)",
          "--scrollbar-width": "18px",
          "scrollbar-color": "var(--scrollbar-thumb) var(--scrollbar-track)",
          "&::-webkit-scrollbar": {
            width: "var(--scrollbar-width)",
            height: "var(--scrollbar-width)",
          },
          "&::-webkit-scrollbar-track": {
            "background-color": "var(--scrollbar-track)",
            "border-radius": theme("borderRadius.full"),
          },
          "&::-webkit-scrollbar-thumb": {
            "background-color": "var(--scrollbar-thumb)",
            "border-radius": theme("borderRadius.full"),
            "border-width": theme("borderWidth.4"),
            "border-style": "solid",
            "border-color": "transparent",
            "background-clip": "content-box",
          },
        },
        ".scrollbar-thin": {
          "--scrollbar-width": "12px",
          "scrollbar-width": "thin",
          "&::-webkit-scrollbar-thumb": {
            borderWidth: theme("borderWidth.2"),
          },
        },
        ".scrollbar-hidden": {
          "--scrollbar-width": "0px",
          "scrollbar-width": "none",
        },
      });

      // ===== Gradients =====
      const gradients = Object.entries(options.gradients || {});
      const gradientClasses = gradients.reduce(
        (cssVariables, [name, colors]) => {
          const light = {
            ...cssVariables[":root"],
            [`--gradient-${name}-from`]: colors.light.from,
            [`--gradient-${name}-to`]: colors.light.to,
            ...(colors.light.via
              ? {
                  [`--gradient-${name}-via`]: colors.light.via,
                }
              : {}),
          };
          cssVariables[":root"] = light;
          cssVariables[".light"] = light;
          cssVariables[".dark"] = {
            ...cssVariables[".dark"],
            [`--gradient-${name}-from`]: colors.dark.from,
            [`--gradient-${name}-to`]: colors.dark.to,
            ...(colors.dark.via
              ? {
                  [`--gradient-${name}-via`]: colors.dark.via,
                }
              : {}),
          };
          cssVariables[`.gradient-${name}`] = {
            "--tw-gradient-name": `url(#gradient-${name})`,
            "--tw-gradient-from": `var(--gradient-${name}-from)`,
            "--tw-gradient-via": `var(--gradient-${name}-via)`,
            "--tw-gradient-to": `var(--gradient-${name}-to)`,
            "--tw-gradient-stops": colors.light.via
              ? `var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)`
              : "var(--tw-gradient-from), var(--tw-gradient-to)",
          };
          return cssVariables;
        },
        { ":root": {}, ".dark": {} }
      );

      addUtilities({
        // text gradient helper
        ".text-gradient": {
          color: "transparent",
          "background-clip": "text",
        },
        ".stroke-gradient": {
          // stroke: "url(var(--tw-gradient-name))",
          stroke: "var(--tw-gradient-name)",
        },
        ".fill-gradient": {
          fill: "var(--tw-gradient-name)",
        },
        // gradients classes
        ...gradientClasses,
      });

      Object.entries(theme("colors")).forEach(([colorName, color]) => {
        switch (typeof color) {
          case "object":
            matchUtilities(
              {
                [`scrollbar-track-${colorName}`]: (value) =>
                  scrollbarTrackColorValue(value),
                [`scrollbar-thumb-${colorName}`]: (value) =>
                  scrollbarThumbColorValue(value),
              },
              {
                values: color,
              }
            );
            break;
          case "function":
            addUtilities({
              [`.scrollbar-track-${colorName}`]: scrollbarTrackColorValue(
                color({})
              ),
              [`.scrollbar-thumb-${colorName}`]: scrollbarThumbColorValue(
                color({})
              ),
            });
            break;
          case "string":
            addUtilities({
              [`.scrollbar-track-${colorName}`]:
                scrollbarTrackColorValue(color),
              [`.scrollbar-thumb-${colorName}`]:
                scrollbarThumbColorValue(color),
            });
            break;
        }
      });

      matchUtilities(
        {
          "scrollbar-track-rounded": (value) =>
            scrollbarTrackRoundedValue(value),
          "scrollbar-thumb-rounded": (value) =>
            scrollbarThumbRoundedValue(value),
        },
        {
          values: theme("borderRadius"),
        }
      );

      // ===== Form Overrides =====
      // Override select chevron icon color from @tailwindcss/forms plugin
      // TODO: enable user to override color / get text color from theme
      addComponents({
        ".dark select": {
          "background-image": `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="${theme(
              "colors.['text']",
              "#abadc6"
            )}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>`
          )}")`,
        },
        select: {
          "background-image": `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="${theme(
              "colors.['text']",
              "#636370"
            )}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>`
          )}")`,
        },
      });
    };
  },

  // ===== Extend Tailwind Config =====
  function (options) {
    if (!options) options = defaultTheme;
    return {
      theme: {
        extend: {
          fontSize: {
            "2xs": ["0.625rem", "0.75rem"],
          },
          spacing: {
            18: "4.5rem",
          },
          maxWidth: {
            "content-xl": 2560,
          },
          colors: {
            text: "rgb(var(--color-text) / <alpha-value>)",
            heading: "rgb(var(--color-heading) / <alpha-value>)",
            hr: "rgb(var(--color-hr) / <alpha-value>)",
            layer: {
              0: "rgb(var(--color-layer-0) / <alpha-value>)",
              1: "rgb(var(--color-layer-1) / <alpha-value>)",
              2: "rgb(var(--color-layer-2) / <alpha-value>)",
              3: "rgb(var(--color-layer-3) / <alpha-value>)",
            },
            muted: {
              1: "rgb(var(--color-muted-1) / <alpha-value>)",
              2: "rgb(var(--color-muted-2) / <alpha-value>)",
              3: "rgb(var(--color-muted-3) / <alpha-value>)",
            },
            primary: "rgb(var(--color-primary) / <alpha-value>)",
            "primary-accent":
              "rgb(var(--color-primary-accent) / <alpha-value>)",
            critical: "rgb(var(--color-critical) / <alpha-value>)",
            "critical-accent":
              "rgb(var(--color-critical-accent) / <alpha-value>)",
            secondary: "rgb(var(--color-secondary) / <alpha-value>)",
            "secondary-accent":
              "rgb(var(--color-secondary-accent) / <alpha-value>)",
          },

          // Typography
          typography: ({ theme }) => ({
            saas: {
              css: [
                {
                  maxWidth: "65ch",

                  // Colors
                  "--tw-prose-body": "rgb(var(--color-text) / 100%)",
                  "--tw-prose-headings": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-lead": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-links": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-bold": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-counters": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-bullets": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-hr": "rgb(var(--color-hr) / 100%)",
                  "--tw-prose-quotes": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-quote-borders": "rgb(var(--color-hr) / 100%)",
                  "--tw-prose-captions": "rgb(var(--color-text) / 100%)",
                  "--tw-prose-code": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-pre-code": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-pre-bg": "rgb(var(--color-muted-3) / 100%)",
                  "--tw-prose-th-borders": "rgb(var(--color-muted-1) / 100%)",
                  "--tw-prose-td-borders": "rgb(var(--color-muted-1) / 100%)",
                  "--tw-prose-invert-body": "rgb(var(--color-text) / 100%)",
                  "--tw-prose-invert-headings":
                    "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-lead": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-links": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-bold": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-counters":
                    "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-bullets":
                    "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-hr": "rgb(var(--color-layer-3) / 100%)",
                  "--tw-prose-invert-quotes":
                    "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-quote-borders":
                    "rgb(var(--color-layer-3) / 100%)",
                  "--tw-prose-invert-captions": "rgb(var(--color-text) / 100%)",
                  "--tw-prose-invert-code": "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-pre-code":
                    "rgb(var(--color-heading) / 100%)",
                  "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
                  "--tw-prose-invert-th-borders":
                    "rgb(var(--color-layer-3) / 100%)",
                  "--tw-prose-invert-td-borders":
                    "rgb(var(--color-layer-3) / 100%)",

                  // Font sizes & spacing
                  h1: {
                    fontSize: theme("fontSize.xl"),
                  },
                  h2: {
                    fontSize: theme("fontSize.lg"),
                  },
                  h3: {
                    fontSize: theme("fontSize.base"),
                  },
                  h4: {
                    fontSize: theme("fontSize.sm"),
                  },
                  h5: {
                    fontSize: theme("fontSize.xs"),
                    fontWeight: theme("fontWeight.semibold"),
                    color: theme("colors.heading"),
                  },
                  "h2,h3,h4,h5": {
                    marginTop: theme("space.6"),
                    marginBottom: theme("space.4"),
                  },
                  img: {
                    borderRadius: theme("borderRadius.xl"),
                  },
                  "figure > img": {
                    marginTop: 0,
                    marginBottom: 0,
                  },
                },
              ],
            },
            "saas-lg": {
              css: [
                {
                  h1: {
                    fontSize: theme("fontSize.4xl"),
                  },
                  h2: {
                    fontSize: theme("fontSize.3xl"),
                  },
                  h3: {
                    fontSize: theme("fontSize.2xl"),
                  },
                  h4: {
                    fontSize: theme("fontSize.xl"),
                  },
                  h5: {
                    fontSize: theme("fontSize.lg"),
                    fontWeight: theme("fontWeight.semibold"),
                    color: theme("colors.heading"),
                  },
                  "h2,h3,h4,h5": {
                    marginTop: theme("space.8"),
                    marginBottom: theme("space.4"),
                  },
                },
              ],
            },
          }),
        },
      },
    };
  }
);

// ===== Scrollbar Helpers =====
function scrollbarTrackColorValue(value) {
  return {
    "--scrollbar-track": value,
    "&::-webkit-scrollbar-track": {
      "background-color": value,
    },
  };
}

function scrollbarTrackRoundedValue(value) {
  return {
    "&::-webkit-scrollbar-track": {
      "border-radius": value,
    },
  };
}

function scrollbarThumbColorValue(value) {
  return {
    "--scrollbar-thumb": value,
    "&::-webkit-scrollbar-thumb": {
      "background-color": value,
    },
  };
}

function scrollbarThumbRoundedValue(value) {
  return {
    "&::-webkit-scrollbar-thumb": {
      "border-radius": value,
    },
  };
}
