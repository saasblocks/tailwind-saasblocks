const TEXT = "171 173 198"; // #abadc6
const HEADING = "255 255 255"; // #fff
const LAYER_0 = "21 24 37"; // #151825
const LAYER_1 = "26 29 45"; // #1a1d2d
const LAYER_2 = "30 34 53"; // #1e2235
const LAYER_3 = "37 42 65"; // #252a41
const MUTED_1 = "37 42 65"; // #252a41
const MUTED_2 = "50 56 85"; // #323855
const MUTED_3 = "66 72 103"; // #424867
const PRIMARY = "37 100 235"; // blue 600 #2564eb
const PRIMARY_ACCENT = "30 64 175"; // blue 800 #1e40af
const CRITICAL = "220 38 38"; // red 600 #dc2626
const CRITICAL_ACCENT = "153 27 27"; // red 800 #991b1b
const SECONDARY = "66 72 103"; // #424867
const SECONDARY_ACCENT = "48 54 80"; // #303650

const HR = MUTED_2;

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
