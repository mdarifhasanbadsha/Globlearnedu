export function generateUniversityMeta(university: { name_en: string; description: string; slug: string }) {
  return {
    title: university.name_en + ' | Globlearn Education',
    description: university.description,
    openGraph: {
      title: university.name_en,
      description: university.description,
      url: process.env.NEXT_PUBLIC_APP_URL + '/universities/' + university.slug,
    },
  };
}

export function generateBlogMeta(post: { title: string; excerpt: string; slug: string }) {
  return {
    title: post.title + ' | Globlearn Education Blog',
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: process.env.NEXT_PUBLIC_APP_URL + '/blog/' + post.slug,
    },
  };
}

export function generateProgramMeta(program: { name: string; degree_level: string; slug: string }) {
  return {
    title: program.name + ' | ' + program.degree_level + ' Program | Globlearn Education',
    description: 'Explore ' + program.name + ' with Globlearn Education.',
    openGraph: {
      title: program.name,
      description: 'Explore ' + program.name + ' with Globlearn Education.',
      url: process.env.NEXT_PUBLIC_APP_URL + '/programs/' + program.slug,
    },
  };
}
