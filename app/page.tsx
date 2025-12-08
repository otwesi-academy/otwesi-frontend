
import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';

import { courseApi, ebookApi, blogpostApi } from '@/lib/api';

interface Course {
  title: string;
  description: string;
  slug: string;
}


interface Ebook {
  title: string;
  description: string;
  slug: string;
}


interface BlogPost {
  title: string;
  content: string;
  slug: string;
}


export default async function Home() {
  const courses: Course[] = (await courseApi.listCourses()).slice(0, 3);
  const ebooks: Ebook[] = (await ebookApi.listEbooks()).slice(0, 3);
  const blogposts: BlogPost[] = (await blogpostApi.listBlogposts()).slice(0, 3);
  
  return (
    <>
      <Hero />


      <Section title="Featured Courses">

        {
          courses.map((course)=> (
            <Card 
              key={course.slug}
              title={ course.title }
              description={course.description.substring(0, 100) + '...' }
              link={`/courses/${course.slug}`} />
          ))
        }

      </Section>

      <Section title="Popular Ebooks">
        
        {
          ebooks.map((ebook) => (
            <Card
              key={ebook.slug}
              title={ebook.title}
              description={ebook.description.substring(0, 100) + '...'}
              link={`/ebooks/${ebook.slug}`} />
          ))
        }
      </Section>

      <Section title="Latest Blog Posts">
        {
          blogposts.map((blogpost) => (
            <Card
              key={blogpost.slug}
              title={blogpost.title}
              description={blogpost.content.substring(0, 100) + '...'}
              link={`/blogposts/${blogpost.slug}`} />
          ))
        }
      </Section>
    </>
  );
}
