import { FaRegCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "../../../lib/db";
import DOMPurify from 'isomorphic-dompurify';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetails({ params }: Props) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog) {
    notFound();
  }

  return (
    <>
      <section className="main-blog-section w-full pt-12 pb-25 px-7 md:px-10 lg:px-55">
        <div className="blog-details pt-20 flex flex-col justify-center items-start">
          <div className="blog-head mb-3 lg:mb-5">
            <span className="flex justify-start items-center text-white/90 text-md font-medium mb-2">
              <FaRegCalendarAlt /> &nbsp;
              {new Date(blog.blog_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <h1 className="text-white text-2xl lg:text-3xl font-medium">
              {blog.blog_name}
            </h1>
          </div>

          <div className="blog-image relative w-full h-75 md:h-105 lg:h-125 border-3 border-white rounded-lg mb-5">
            <Image
              src={blog.blog_image || "/images/blog-placeholder.jpg"}
              alt={blog.blog_name}
              className="w-full h-auto lg:h-full rounded-md"
              fill
              priority={false}
            />
            <div className="blog-overlay absolute bottom-0 left-0 right-0 z-20 w-full h-full bg-linear-to-t from-red-700/70 via-transparent to-transparent rounded-md"></div>
          </div>
          <div className="w-full max-w-full overflow-hidden">
            <div className="container-section">
        
               <div
                className="prose prose-invert max-w-none 
            prose-p:text-white/90 prose-p:leading-relaxed
            prose-strong:text-white 
            prose-li:text-white/90
            break-words overflow-hidden"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.blog_desc) }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
