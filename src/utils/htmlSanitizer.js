import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'div',
  'em',
  'h2',
  'i',
  'li',
  'ol',
  'p',
  's',
  'span',
  'strike',
  'strong',
  'u',
  'ul',
];

const ALLOWED_ATTR = ['class', 'href', 'rel', 'target'];

export const sanitizeHtml = (html) =>
  DOMPurify.sanitize(html || '', {
    ALLOWED_ATTR,
    ALLOWED_TAGS,
    ALLOW_DATA_ATTR: false,
  });
