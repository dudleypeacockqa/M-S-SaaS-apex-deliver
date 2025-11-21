declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
  export const frontmatter: {
    title: string;
    slug: string;
    publishDate: string;
    author?: string;
    category: string;
    featured?: boolean;
    excerpt: string;
    featuredImage?: string;
    imageAlt?: string;
    tags?: string[];
    readTime?: number;
    seoTitle?: string;
    metaDescription?: string;
  };
}

declare module '*.mdx?raw' {
  const content: string;
  export default content;
}
