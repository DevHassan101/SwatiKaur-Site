

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineModeComment } from "react-icons/md";
import { IoNewspaper } from "react-icons/io5";
import DOMPurify from "isomorphic-dompurify";

type Blog = {
  id: number;
  blog_name: string;
  slug: string; 
  blog_desc: string;
  blog_image: string | null;
  blog_date: string;
};

type BlogCardsProps = {
  limit?: number;
};

export default function BlogCards({ limit }: BlogCardsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const url = limit
          ? `/api/website/blogs?limit=${limit}`
          : "/api/website/blogs";

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) return;

        setBlogs(data.blogs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [limit]);

  const stripHtml = (html: string) => {
    if (!html) return "";
    
    const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    
    const txt = document.createElement("textarea");
    txt.innerHTML = cleanHtml;
    
    return txt.value
      .replace(/\s+/g, ' ')
      .trim();
  };

  if (loading) {
    return (
      <section className="blogs-section w-full pt-12 pb-15 px-7 md:px-10 lg:px-14">
        <div className="text-center">
          <p className="text-white text-lg">Loading blogs...</p>
        </div>
      </section>
    );
  }

  if (!blogs.length) return null;

  return (
    <section className="blogs-section w-full pt-12 pb-15 px-7 md:px-10 lg:px-14">
      <div className="text-center mb-12">
        <h2 className="text-xl md:text-2xl lg:text-4xl inline-flex items-center text-white font-semibold">
          Our Latest Blogs &nbsp;
          <span className="text-red-200">
            <IoNewspaper size={45} />
          </span>
        </h2>
      </div>
      <div className="grid gap-5 md:gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {blogs.map((blog) => (
          <Link
            href={`/blogs/${blog.slug}`}
            key={blog.id}
            className="blog-card rounded-xl shadow-lg bg-white border-2 border-white hover:shadow-2xl transition duration-300 flex flex-col h-full"
          >
            {/* Image */}
            <div className="blog-img relative w-full h-50">
              <Image
                src={blog.blog_image || "/images/blog-placeholder.jpg"}
                alt={blog.blog_name}
                fill
                className="object-cover rounded-t-xl"
              />
              <div className="absolute top-0 left-0 bg-red-700/30 w-full h-full rounded-t-lg" />
            </div>

            {/* Content */}
            <div className="blog-content bg-white border-t-2 border-white py-4 px-5 flex-1 flex flex-col">
              <p className="text-base sm:text-md md:text-lg font-medium text-red-600 hover:text-red-700 transition mb-2 line-clamp-2">
                {blog.blog_name}
              </p>

              {/* ✅ Plain text description with line-clamp */}
              <p className="text-sm text-black/80 leading-relaxed flex-1 line-clamp-3 overflow-hidden">
                {stripHtml(blog.blog_desc)}
              </p>
            </div>

            {/* Footer */}
            <div className="blog-details bg-red-700 text-white rounded-b-xl flex justify-between items-center py-3 px-5 text-xs sm:text-sm">
              <span className="flex items-center">
                <FaRegCalendarAlt className="w-4 h-4 mr-1" />
                {new Date(blog.blog_date).toDateString()}
              </span>

              <span className="flex items-center">
                <MdOutlineModeComment className="w-4 h-4 mr-1" />
                0 Comments
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}