import StyleDictionary from "style-dictionary";
import { usesReferences, getReferences } from "style-dictionary/utils";

// Keep Style Dictionary's internal token names unique while the custom format
// intentionally removes semantic and theme path prefixes from CSS variables.
StyleDictionary.registerTransform({
  name: "name/ds-unique",
  type: "name",
  transform: (token) => token.path.join("-"),
});

/** Build `var(--ds-…)` when a token references another, else raw value. */
function tokenValue(token, dictionary) {
  const original = token.original.$value ?? token.original.value;
  if (typeof original === "string" && usesReferences(original)) {
    const [ref] = getReferences(original, dictionary.tokens);
    return `var(--ds-${ref.path.join("-")})`;
  }
  return token.$value ?? token.value;
}

/**
 * Full tokens.css: primitives in :root, semantic aliases in :root,
 * dark overrides in .dark — emitted as one file.
 */
StyleDictionary.registerFormat({
  name: "css/ds-tokens",
  format: ({ dictionary }) => {
    const block = (selector, match, strip = 0) => {
      const lines = dictionary.allTokens
        .filter((t) => match(t.path))
        .map((t) => {
          const name = ["ds", ...t.path.slice(strip)].join("-");
          return `  --${name}: ${tokenValue(t, dictionary)};`;
        });
      return `${selector} {\n${lines.join("\n")}\n}`;
    };
    return [
      block(":root", (p) => p[0] === "color"),
      "",
      block(":root", (p) => p[0] === "semantic", 1),
      "",
      block(".dark", (p) => p[0] === "dark", 1),
      "",
    ].join("\n");
  },
});

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transforms: ["name/ds-unique"],
      buildPath: "dist/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/ds-tokens",
        },
      ],
    },
  },
};
