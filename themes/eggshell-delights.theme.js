const TEXT = "99 99 112"; // #636370
const HEADING = "51 51 61"; // #33333d
const LAYER_0 = "255 255 255"; // #fff
const LAYER_1 = "246 246 250"; // #f6f6fa
const LAYER_2 = "255 255 255"; // #fff
const LAYER_3 = "246 246 250"; // #f6f6fa
const MUTED_1 = "239 239 243"; // #efeff3
const MUTED_2 = "225 225 234"; // #e1e1ea
const MUTED_3 = "221 221 231"; // #dddde7
const PRIMARY = "37 100 235"; // blue 600 #2564eb
const PRIMARY_ACCENT = "30 64 175"; // blue 800 #1e40af
const CRITICAL = "220 38 38"; // red 600 #dc2626
const CRITICAL_ACCENT = "153 27 27"; // red 800 #991b1b
const SECONDARY = "98 98 112"; // #626270
const SECONDARY_ACCENT = "81 81 95"; // #51515f

const HR = MUTED_3;

module.exports = {
  colors: {
    "--color-text": TEXT,
    "--color-heading": HEADING,
    "--color-hr": HR,
    "--color-layer-0": LAYER_0,
    "--color-layer-1": LAYER_1,
    "--color-layer-2": LAYER_2,
    "--color-layer-3": LAYER_3,
    "--color-muted-1": MUTED_1,
    "--color-muted-2": MUTED_2,
    "--color-muted-3": MUTED_3,
    "--color-primary": PRIMARY,
    "--color-primary-accent": PRIMARY_ACCENT,
    "--color-critical": CRITICAL,
    "--color-critical-accent": CRITICAL_ACCENT,
    "--color-secondary": SECONDARY,
    "--color-secondary-accent": SECONDARY_ACCENT,
  },
};
