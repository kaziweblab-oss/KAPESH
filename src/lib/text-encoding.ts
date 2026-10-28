const windows1252Bytes: Record<string, number> = {
  "€": 0x80,
  "‚": 0x82,
  "ƒ": 0x83,
  "„": 0x84,
  "…": 0x85,
  "†": 0x86,
  "‡": 0x87,
  "ˆ": 0x88,
  "‰": 0x89,
  "Š": 0x8a,
  "‹": 0x8b,
  "Œ": 0x8c,
  "Ž": 0x8e,
  "‘": 0x91,
  "’": 0x92,
  "“": 0x93,
  "”": 0x94,
  "•": 0x95,
  "–": 0x96,
  "—": 0x97,
  "˜": 0x98,
  "™": 0x99,
  "š": 0x9a,
  "›": 0x9b,
  "œ": 0x9c,
  "ž": 0x9e,
  "Ÿ": 0x9f,
};

const utf8Decoder = new TextDecoder("utf-8");
const mojibakeMarker = /[àâ][¦§]|à[\u0080-\uFFFF]|[ØÙ][\u0080-\uFFFF]/;
const legacyCharacters = /[\u0000-\u00ff€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]+/g;

export function repairMojibake(value: string): string {
  const decoded = value.replace(legacyCharacters, (segment) => {
    if (!mojibakeMarker.test(segment)) return segment;

    const bytes = new Uint8Array(
      Array.from(segment, (character) => {
        const codePoint = character.codePointAt(0) ?? 0;
        return windows1252Bytes[character] ?? codePoint;
      }),
    );
    const candidate = utf8Decoder.decode(bytes);
    return candidate.includes("\uFFFD") ? segment : candidate;
  });

  return decoded.replace("ইনস্টলেশন কি شما করেন?", "ইনস্টলেশন কি আপনারা করেন?");
}

export function repairMojibakeDeep<T>(value: T): T {
  if (typeof value === "string") return repairMojibake(value) as T;
  if (Array.isArray(value)) {
    return value.map((item) => repairMojibakeDeep(item)) as T;
  }
  if (value === null || typeof value !== "object") return value;

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return value;

  const repaired = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, repairMojibakeDeep(item)]),
  );
  return repaired as T;
}
