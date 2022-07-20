// @ts-check

const INDICATOR_ICONS = {
  "not-done": "❔️",
  "maybe": "❓",
  "star": "⭐️",
  "together": "🗨️",
  "alone-then-together": "👁‍🗨",
  "alone-then-tick": "🟨",
  "tick": "☑️",
  "ignore": "❎",
  "done": "✅️",
};

/** @typedef {keyof typeof INDICATOR_ICONS} Indicator */

/**
@type {{[K in Indicator]: (params: {
  userFlags: Record<string, boolean>,
  shift: boolean,
  ctrl: boolean,
  alt: boolean,
  altGr: boolean,
  meta: boolean,
  left: boolean,
  middle: boolean,
  right: boolean,
}) => Exclude<Indicator, K>}}
@chart
```mermaid
flowchart LR

    not-done("not-done\n❔")
    maybe("maybe\n❓")
    star("star\n⭐")
    together("together\n🗨️")
    alone-then-together("alone-then-together\n👁‍🗨")
    alone-then-tick("alone-then-tick\n🟨")
    tick("tick\n☑️")
    ignore("ignore\n❎")
    done("done\n✅")

    %% standard transition
    not-done --> star --> done --> not-done

    %% flag transitions
    not-done --->|intro flag XOR shift key| maybe --> star
    maybe --->|intro flag XOR shift key| not-done

    %% shift key transitions
    star -->|shift key| together --> done
    together -->|shift key| alone-then-together --> done
    alone-then-together -->|shift key| alone-then-tick --> done
    alone-then-tick -->|shift key| tick --> done

    %% ctrl key transitions
    star -->|ctrl key| ignore --> not-done
```
*/
const INDICATOR_TRANSITIONS = {
  "not-done": ({userFlags, shift}) => userFlags.intro /*xor*/!== shift ? "maybe" : "star",
  "maybe": ({userFlags, shift}) => userFlags.intro /*xor*/!== shift ? "not-done" : "star",
  "star": ({shift, ctrl}) => shift ? "together" : ctrl ? "ignore" :"done",
  "together": ({shift}) => shift ? "alone-then-together" : "done",
  "alone-then-together": ({shift}) => shift ? "alone-then-tick": "done",
  "alone-then-tick": ({shift}) => shift ? "tick" : "done",
  "tick": () => "done",
  "ignore": () => "not-done",
  "done": () => "not-done",
};

/** @type {Indicator} */
const DEFAULT_INDICATOR = "not-done";

/** @returns {Indicator} */
function convertIndicatorForBackwardCompatibility(indicator) {
  if (indicator === true) return "done";
  if (indicator === false) return "not-done";
  return indicator;
};

/** @typedef {(typeof INDICATOR_ICONS)[Indicator]} EE */

/** @type {Record<string, Indicator[]>} */
const INDICATOR_BIG_FILTERS = {
  "❔️": ["not-done", "maybe"],
  "⭐": ["star", "together", "alone-then-together", "alone-then-tick", "tick"],
  "✅️": ["ignore", "done"],
};
