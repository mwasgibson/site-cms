<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

/**
 * Sanitizes HTML from the rich-text editor before it's stored. Written
 * against PHP's built-in DOMDocument rather than a Composer package
 * (e.g. mews/purifier) so there's nothing extra to install and nothing
 * this assumes is available that wasn't verified.
 *
 * Allowlist approach: anything not explicitly permitted is stripped,
 * including all "on*" event-handler attributes and javascript: URLs.
 */
class HtmlSanitizer
{
    private const ALLOWED_TAGS = [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'h2',
        'h3',
        'h4',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'a',
        'img',
    ];
    private const ALLOWED_ATTRIBUTES = [
        'a' => ['href', 'target', 'rel'],
        'img' => ['src', 'alt'],
    ];
    public static function clean(string $html): string
    {
        if (trim($html) === '') {
            return '';
        }
        $dom = new DOMDocument();
        // Wrap in a UTF-8 meta + container so DOMDocument doesn't mangle
        // encoding or require a full <html><body> structure back out.
        @$dom->loadHTML(
            '<?xml encoding="utf-8" ?><div id="__root__">' . $html . '</div>',
            LIBXML_NOERROR | LIBXML_NOWARNING
        );
        $root = $dom->getElementById('__root__');
        if (! $root) {
            return '';
        }
        self::cleanNode($dom, $root);
        $output = '';
        foreach (iterator_to_array($root->childNodes) as $child) {
            $output .= $dom->saveHTML($child);
        }
        return trim($output);
    }
    private static function cleanNode(DOMDocument $dom, DOMNode $node): void
    {
        $children = iterator_to_array($node->childNodes);
        foreach ($children as $child) {
            if ($child->nodeType === XML_TEXT_NODE) {
                continue;
            }
            if (! $child instanceof DOMElement) {
                $node->removeChild($child);
                continue;
            }
            $tag = strtolower($child->tagName);
            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                // Unwrap: keep the children, drop the disallowed wrapper tag
                // (e.g. a <script> or <style> the editor was tricked into
                // emitting), rather than dropping legitimate nested content.
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }
            self::stripDisallowedAttributes($child, $tag);
            self::cleanNode($dom, $child);
        }
    }
    private static function stripDisallowedAttributes(DOMElement $el, string $tag): void
    {
        $allowed = self::ALLOWED_ATTRIBUTES[$tag] ?? [];
        $attrs = iterator_to_array($el->attributes ?? []);
        foreach ($attrs as $attr) {
            $name = strtolower($attr->name);
            if (! in_array($name, $allowed, true)) {
                $el->removeAttribute($attr->name);
                continue;
            }
            if (in_array($name, ['href', 'src'], true) && self::isDangerousUrl($attr->value)) {
                $el->removeAttribute($attr->name);
            }
        }
        if ($tag === 'a' && $el->hasAttribute('href')) {
            $el->setAttribute('rel', 'noopener noreferrer');
        }
    }
    private static function isDangerousUrl(string $url): bool
    {
        $url = trim(strtolower($url));
        return str_starts_with($url, 'javascript:') || str_starts_with($url, 'data:text/html');
    }
}
