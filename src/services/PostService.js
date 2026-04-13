import fm from 'front-matter';

const postModules = import.meta.glob('../blogs-posts/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});
const assetModules = import.meta.glob('../blogs-posts/**/*.{png,jpg,jpeg,gif,webp,avif,svg,mp4,webm,ogg}', {
    import: 'default',
    eager: true,
});

export function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return 'Data indisponível';
    }

    return date.toLocaleDateString('pt-PT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function getExcerpt(text = '', maxLength = 150) {
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
}

export function normalizeTags(tags) {
    return Array.isArray(tags) ? tags : [];
}

function getPostIdFromPath(path) {
    const normalizedPath = path.replace(/\\/g, '/');
    const segments = normalizedPath.split('/');
    const fileName = segments.pop()?.replace('.md', '') || '';
    const parentFolder = segments.at(-1) || '';

    return fileName === 'index' && parentFolder ? parentFolder : fileName;
}

function getSourceDirectory(path) {
    return path.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
}

function normalizePost(path, markdown) {
    const content = fm(markdown);
    const id = getPostIdFromPath(path);
    const description = content.attributes.description || '';

    return {
        id,
        title: content.attributes.title || 'Sem título',
        description,
        excerpt: getExcerpt(description),
        date: content.attributes.date || '',
        formattedDate: formatDate(content.attributes.date),
        tags: normalizeTags(content.attributes.tags),
        body: content.body,
        sourcePath: path.replace(/\\/g, '/'),
        sourceDir: getSourceDirectory(path),
        ...content.attributes,
    };
}

class PostService {
    constructor(modules = postModules, assets = assetModules) {
        this.modules = modules;
        this.assets = assets;
        this.cachedPosts = null;
    }

    formatDate(dateString) {
        return formatDate(dateString);
    }

    getExcerpt(text) {
        return getExcerpt(text);
    }

    async loadPosts() {
        if (this.cachedPosts) {
            return this.cachedPosts;
        }

        const posts = Object.entries(this.modules)
            .map(([path, markdown]) => normalizePost(path, markdown))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        this.cachedPosts = posts;
        return posts;
    }

    async getPost(postId) {
        const posts = await this.loadPosts();
        const post = posts.find((item) => item.id === postId);

        if (!post) {
            return null;
        }

        return post;
    }

    resolveAssetPath(post, assetPath) {
        if (!assetPath || !post?.sourceDir) {
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
        const fullAssetPath = `${post.sourceDir}/${normalizedAssetPath}`;

        return this.assets[fullAssetPath] || cleanedAssetPath;
    }
}

export { PostService };
export default new PostService();
