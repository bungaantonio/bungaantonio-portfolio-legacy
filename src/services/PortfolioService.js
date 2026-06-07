import fm from 'front-matter';
import { formatDate, getExcerpt, normalizeTags } from './PostService';

const itemModules = import.meta.glob('../portfolio-items/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const assetModules = import.meta.glob('../portfolio-items/**/*.{png,jpg,jpeg,gif,webp,avif,svg,mp4,webm,ogg}', {
    import: 'default',
    eager: true,
});

function getItemIdFromPath(path) {
    const normalizedPath = path.replace(/\\/g, '/');
    const segments = normalizedPath.split('/');
    const fileName = segments.pop()?.replace('.md', '') || '';
    const parentFolder = segments.at(-1) || '';

    return fileName === 'index' && parentFolder ? parentFolder : fileName;
}

function getSourceDirectory(path) {
    return path.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
}

function normalizeStack(stack) {
    return Array.isArray(stack) ? stack : [];
}

function normalizeItem(path, markdown) {
    const content = fm(markdown);
    const id = getItemIdFromPath(path);
    const description = content.attributes.description || '';

    return {
        id,
        title: content.attributes.title || 'Sem título',
        description,
        excerpt: getExcerpt(description),
        date: content.attributes.date || '',
        formattedDate: formatDate(content.attributes.date),
        category: content.attributes.category || '',
        stack: normalizeStack(content.attributes.stack),
        tags: normalizeTags(content.attributes.tags),
        body: content.body,
        sourcePath: path.replace(/\\/g, '/'),
        sourceDir: getSourceDirectory(path),
        ...content.attributes,
    };
}

class PortfolioService {
    constructor(modules = itemModules, assets = assetModules) {
        this.modules = modules;
        this.assets = assets;
        this.cachedItems = null;
    }

    formatDate(dateString) {
        return formatDate(dateString);
    }

    getExcerpt(text) {
        return getExcerpt(text);
    }

    async loadItems() {
        if (this.cachedItems) {
            return this.cachedItems;
        }

        const items = Object.entries(this.modules)
            .map(([path, markdown]) => normalizeItem(path, markdown))
            .filter((item) => item.draft !== true && item.status !== 'draft' && item.published !== false)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        this.cachedItems = items;
        return items;
    }

    async getItem(itemId) {
        const items = await this.loadItems();
        return items.find((item) => item.id === itemId) || null;
    }

    resolveAssetPath(item, assetPath) {
        if (!assetPath || !item?.sourceDir) {
            return assetPath;
        }

        const cleanedAssetPath = assetPath
            .trim()
            .replace(/^<|>$/g, '');

        if (/^(https?:|data:|mailto:|tel:|#|\/)/i.test(cleanedAssetPath)) {
            return cleanedAssetPath;
        }

        const normalizedAssetPath = decodeURIComponent(cleanedAssetPath)
            .replace(/^\.\//, '')
            .replace(/\\/g, '/');
        const fullAssetPath = `${item.sourceDir}/${normalizedAssetPath}`;

        return this.assets[fullAssetPath] || cleanedAssetPath;
    }
}

export { PortfolioService };
export default new PortfolioService();
