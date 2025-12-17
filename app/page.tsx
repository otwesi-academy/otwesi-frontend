import Hero from "../components/Hero";
import Section from "../components/Section";
import Card from "../components/Card";

import { courseApi, ebookApi, blogpostApi } from "@/lib/serverApi";

export default async function Home() {
  const courses = (await courseApi.listCourses()).slice(0, 3);
  const ebooks = (await ebookApi.listEbooks()).slice(0, 3);
  const blogposts = (await blogpostApi.listBlogposts()).slice(0, 3);

  return (
    <>
      <Hero />

      <Section title="Featured Courses">
        {courses.map((course) => (
          <Card
            key={course.slug}
            title={course.title}
            description={course.description.substring(0, 100) + "..."}
            link={`/courses/${course.slug}`}
          />
        ))}
      </Section>

      <Section title="Popular Ebooks">
        {ebooks.map((ebook) => (
          <Card
            key={ebook.slug}
            title={ebook.title}
            description={ebook.description.substring(0, 100) + "..."}
            link={`/ebooks/${ebook.slug}`}
          />
        ))}
      </Section>

      <Section title="Latest Blog Posts">
        {blogposts.map((blogpost) => (
          <Card
            key={blogpost.slug}
            title={blogpost.title}
            description={blogpost.content.substring(0, 100) + "..."}
            link={`/blogposts/${blogpost.slug}`}
          />
        ))}
      </Section>
    </>
  );
}
