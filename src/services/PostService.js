import fm from 'front-matter';

const postModules = import.meta.glob('../blogs-posts/*.md', {
    query: '?raw',
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

function normalizePost(path, markdown) {
    const content = fm(markdown);
    const id = path.split('/').pop().replace('.md', '');
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
        ...content.attributes,
    };
}

class PostService {
    constructor(modules = postModules) {
        this.modules = modules;
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
}

export { PostService };
export default new PostService();
