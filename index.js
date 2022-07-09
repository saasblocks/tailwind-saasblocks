const plugin = require("tailwindcss/plugin");
const svgToDataUri = require("mini-svg-data-uri");
const defaultTheme = require("./default.theme");

module.exports = plugin.withOptions(
  function (options) {
    if (!options) options = defaultTheme;
    return function ({
      addBase,
      addUtilities,
      addComponents,
      matchUtilities,
      theme,
    }) {
      // ===== Base =====
      addBase({
        body: {
          color: theme("colors.text-muted"),
        },
      });

      // ===== Scrollbar =====
      addUtilities({
        ".scrollbar": {
          "--scrollbar-thumb": "#cdcdcd",
          "--scrollbar-track": "#f0f0f0",
          "--scrollbar-width": "18px",
          "scrollbar-color": "var(--scrollbar-thumb) var(--scrollbar-track)",
          "&::-webkit-scrollbar": {
            width: "var(--scrollbar-width)",
            height: "var(--scrollbar-width)",
          },
        },
        ".scrollbar-thin": {
          "--scrollbar-width": "12px",
          "scrollbar-width": "thin",
        },
        ".scrollbar-hidden": {
          "--scrollbar-width": "0px",
          "scrollbar-width": "none",
        },
        ".scrollbar-saas": {
          "--scrollbar-thumb": theme("colors.border"),
          "--scrollbar-track": theme("colors.background-3"),
          "&::-webkit-scrollbar-track": {
            "background-color": theme("colors.background-3"),
            "border-radius": theme("borderRadius.full"),
          },
          "&::-webkit-scrollbar-thumb": {
            "background-color": theme("colors.border"),
            "border-radius": theme("borderRadius.full"),
            "border-width": theme("borderWidth.4"),
            "border-style": "solid",
            "border-color": "transparent",
            "background-clip": "content-box",
          },
          "&.scrollbar-thin::-webkit-scrollbar-thumb": {
            borderWidth: theme("borderWidth.2"),
          },
        },
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
      addComponents({
        select: {
          "background-image": `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="${theme(
              "colors.['text-muted']",
              "#abadc6"
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
          colors: options.colors,

          // Typography
          typography: ({ theme }) => ({
            saas: {
              css: [
                {
                  maxWidth: "65ch",

                  // Colors
                  "--tw-prose-body": theme("colors.text-muted"),
                  "--tw-prose-headings": theme("colors.white"),
                  "--tw-prose-lead": theme("colors.white"),
                  "--tw-prose-links": theme("colors.white"),
                  "--tw-prose-bold": theme("colors.white"),
                  "--tw-prose-counters": theme("colors.white"),
                  "--tw-prose-bullets": theme("colors.white"),
                  "--tw-prose-hr": theme("colors.background-3"),
                  "--tw-prose-quotes": theme("colors.white"),
                  "--tw-prose-quote-borders": theme("colors.background-3"),
                  "--tw-prose-captions": theme("colors.text-muted"),
                  "--tw-prose-code": theme("colors.white"),
                  "--tw-prose-pre-code": theme("colors.white"),
                  "--tw-prose-pre-bg": "rgb(0 0 0 / 50%)",
                  "--tw-prose-th-borders": theme("colors.background-3"),
                  "--tw-prose-td-borders": theme("colors.background-3"),
                  "--tw-prose-invert-body": theme("colors.text-muted"),
                  "--tw-prose-invert-headings": theme("colors.white"),
                  "--tw-prose-invert-lead": theme("colors.white"),
                  "--tw-prose-invert-links": theme("colors.white"),
                  "--tw-prose-invert-bold": theme("colors.white"),
                  "--tw-prose-invert-counters": theme("colors.white"),
                  "--tw-prose-invert-bullets": theme("colors.white"),
                  "--tw-prose-invert-hr": theme("colors.background-3"),
                  "--tw-prose-invert-quotes": theme("colors.white"),
                  "--tw-prose-invert-quote-borders": theme(
                    "colors.background-3"
                  ),
                  "--tw-prose-invert-captions": theme("colors.text-muted"),
                  "--tw-prose-invert-code": theme("colors.white"),
                  "--tw-prose-invert-pre-code": theme("colors.white"),
                  "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
                  "--tw-prose-invert-th-borders": theme("colors.background-3"),
                  "--tw-prose-invert-td-borders": theme("colors.background-3"),

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
                    color: theme("colors.white"),
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
                    color: theme("colors.white"),
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
