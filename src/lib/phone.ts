/**
 * The phone field's country codes and number check (docs/TRACKER.md F.3), on libphonenumber-js's
 * smallest data set. Loaded only when a form with a phone field comes near the screen or the field
 * is touched (`loadPhoneKit`), never with the page: the library is its own download, and a page
 * whose form asks for no phone never fetches it (Devagya, 27 Nov 2026: "shouldn't affect
 * performance").
 */

export type CountryOption = {
  /** The region code, posted as the field's country: `IN`. */
  value: string;
  /** What the list shows: "India +91". */
  label: string;
  /** What the closed field shows: "+91". */
  short: string;
  /** What typing in the list matches besides the label: the code with and without its plus. */
  keywords: string[];
};

export type PhoneCheck = { valid: true; international: string } | { valid: false };

export type PhoneKit = {
  countries: CountryOption[];
  /** A number as typed, in the chosen country: valid, and how it is sent ("+44 7911 123456"). */
  check: (national: string, region: string) => PhoneCheck;
  /** A pasted international number ("+44 7911 123456"): its country and its national digits. */
  split: (pasted: string) => { region: string; national: string } | undefined;
};

let kit: Promise<PhoneKit> | undefined;

export function loadPhoneKit(): Promise<PhoneKit> {
  kit ??= import('libphonenumber-js/min').then((lib) => {
    const names = new Intl.DisplayNames(['en-GB'], { type: 'region' });
    const countries = lib
      .getCountries()
      .map((region) => {
        const code = `+${lib.getCountryCallingCode(region)}`;
        const name = names.of(region) ?? region;
        return { value: region, label: `${name} ${code}`, short: code, keywords: [code, code.slice(1), region] };
      })
      .sort((a, b) => a.label.localeCompare(b.label, 'en-GB'));
    return {
      countries,
      check(national, region) {
        const number = lib.parsePhoneNumberFromString(national, region as never);
        return number?.isValid() ? { valid: true, international: number.formatInternational() } : { valid: false };
      },
      split(pasted) {
        if (!pasted.trim().startsWith('+')) return undefined;
        const number = lib.parsePhoneNumberFromString(pasted);
        return number?.country ? { region: number.country, national: String(number.nationalNumber) } : undefined;
      },
    };
  });
  return kit;
}
