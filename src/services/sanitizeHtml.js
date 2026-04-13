import DOMPurify from 'dompurify';

export function sanitizeHtml(html) {
    return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['iframe', 'video', 'source'],
        ADD_ATTR: [
            'class',
            'allow',
            'allowfullscreen',
            'controls',
            'frameborder',
            'height',
            'loading',
            'loop',
            'muted',
            'playsinline',
            'poster',
            'preload',
            'referrerpolicy',
            'src',
            'title',
            'type',
            'width',
        ],
    });
}
