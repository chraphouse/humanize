/**
 * @chraphouse/humanize
 * Format numbers, bytes, dates, durations, and lists into human-readable strings.
 * Zero dependencies. ESM and CJS compatible.
 */

/**
 * Format bytes into human-readable string
 * @param {number} bytes
 * @param {object} options - { decimals: 1, binary: false }
 * @returns {string}
 */
function bytes(value, options = {}) {
  const { decimals = 1, binary = false } = options;
  if (value === 0) return '0 B';
  const k = binary ? 1024 : 1000;
  const units = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(Math.abs(value)) / Math.log(k));
  const idx = Math.max(0, Math.min(i, units.length - 1));
  return (value / Math.pow(k, idx)).toFixed(decimals) + ' ' + units[idx];
}

/**
 * Format number with commas/locale
 * @param {number} value
 * @param {object} options - { decimals, separator, locale }
 * @returns {string}
 */
function number(value, options = {}) {
  const { decimals, separator = ',', locale } = options;
  if (locale) {
    return new Intl.NumberFormat(locale, decimals !== undefined ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : {}).format(value);
  }
  const parts = (decimals !== undefined ? value.toFixed(decimals) : String(value)).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
}

/**
 * Format number as ordinal (1st, 2nd, 3rd, ...)
 * @param {number} n
 * @returns {string}
 */
function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Format relative time (time ago / time from now)
 * @param {Date|number|string} date
 * @param {Date} now - reference date (default: now)
 * @returns {string}
 */
function timeAgo(date, now = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const seconds = Math.floor((now - d) / 1000);
  const future = seconds < 0;
  const abs = Math.abs(seconds);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(abs / s);
    if (count >= 1) {
      const unit = count === 1 ? label : label + 's';
      return future ? `in ${count} ${unit}` : `${count} ${unit} ago`;
    }
  }

  return future ? 'in a few seconds' : 'just now';
}

/**
 * Format duration in milliseconds to human-readable
 * @param {number} ms - duration in milliseconds
 * @param {object} options - { verbose: false, units: ['d','h','m','s'] }
 * @returns {string}
 */
function duration(ms, options = {}) {
  const { verbose = false, maxUnits = 2 } = options;
  const abs = Math.abs(ms);

  const parts = [
    { value: Math.floor(abs / 86400000), short: 'd', long: 'day' },
    { value: Math.floor((abs % 86400000) / 3600000), short: 'h', long: 'hour' },
    { value: Math.floor((abs % 3600000) / 60000), short: 'm', long: 'minute' },
    { value: Math.floor((abs % 60000) / 1000), short: 's', long: 'second' },
    { value: abs % 1000, short: 'ms', long: 'millisecond' },
  ];

  const result = parts
    .filter(p => p.value > 0)
    .slice(0, maxUnits)
    .map(p => {
      if (verbose) {
        return `${p.value} ${p.long}${p.value !== 1 ? 's' : ''}`;
      }
      return `${p.value}${p.short}`;
    });

  return result.length > 0 ? result.join(verbose ? ', ' : ' ') : (verbose ? '0 seconds' : '0s');
}

/**
 * Format a list with Oxford comma
 * @param {string[]} items
 * @param {object} options - { conjunction: 'and', oxfordComma: true }
 * @returns {string}
 */
function list(items, options = {}) {
  const { conjunction = 'and', oxfordComma = true } = options;
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(', ')}${oxfordComma ? ',' : ''} ${conjunction} ${last}`;
}

/**
 * Truncate string with ellipsis
 * @param {string} str
 * @param {number} length
 * @param {object} options - { ellipsis: '...', wordBoundary: false }
 * @returns {string}
 */
function truncate(str, length, options = {}) {
  const { ellipsis = '...', wordBoundary = false } = options;
  if (str.length <= length) return str;
  const max = length - ellipsis.length;
  let truncated = str.slice(0, max);
  if (wordBoundary) {
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
  }
  return truncated + ellipsis;
}

/**
 * Pluralize a word based on count
 * @param {number} count
 * @param {string} singular
 * @param {string} plural - (default: singular + 's')
 * @returns {string}
 */
function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : (plural || singular + 's')}`;
}

/**
 * Format percentage
 * @param {number} value - decimal (0.5) or percentage (50)
 * @param {object} options - { decimals: 0, autoDetect: true }
 * @returns {string}
 */
function percentage(value, options = {}) {
  const { decimals = 0, autoDetect = true } = options;
  const pct = autoDetect && Math.abs(value) <= 1 ? value * 100 : value;
  return pct.toFixed(decimals) + '%';
}

/**
 * Compact number (1K, 1.2M, 3.5B)
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
function compact(value, decimals = 1) {
  const thresholds = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];

  for (const { value: threshold, suffix } of thresholds) {
    if (Math.abs(value) >= threshold) {
      return (value / threshold).toFixed(decimals) + suffix;
    }
  }
  return String(value);
}

module.exports = {
  bytes,
  number,
  ordinal,
  timeAgo,
  duration,
  list,
  truncate,
  pluralize,
  percentage,
  compact,
};
