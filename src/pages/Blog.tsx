import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  User,
  ArrowRight,
  Search
} from "lucide-react";

// Fallback data
const fallbackFeaturedPost = {
  id: 1,
  title: "How Innovation Summits Are Shaping Ghana's Future Leaders",
  excerpt: "Discover how our annual Innovation Summits have become a launching pad for young Ghanaian innovators, creating opportunities and inspiring the next generation of problem-solvers.",
  author: "Emmanuel Danso",
  date: "February 15, 2024",
  category: "Impact Stories",
  readTime: "8 min read",
};

const fallbackBlogPosts = [
  {
    id: 2,
    title: "5 Students Who Turned Their Ideas Into Community Solutions",
    excerpt: "Meet the inspiring students who participated in our programs and went on to create real change in their communities.",
    author: "Abena Osei",
    date: "February 10, 2024",
    category: "Success Stories",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "The Importance of STEM Education in Rural Ghana",
    excerpt: "Why we're committed to bringing quality STEM education to underserved communities across the country.",
    author: "Kwame Asante",
    date: "February 5, 2024",
    category: "Education",
    readTime: "5 min read",
  },
  {
    id: 4,
    title: "Volunteer Spotlight: Teaching Coding in Kumasi",
    excerpt: "Our volunteer Sarah shares her experience teaching basic coding to students at a local school in Kumasi.",
    author: "Sarah Mensah",
    date: "January 28, 2024",
    category: "Volunteer Stories",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Announcing Our Partnership with Ghana Education Service",
    excerpt: "We're excited to announce a new partnership that will expand our reach to more schools across Ghana.",
    author: "Emmanuel Danso",
    date: "January 20, 2024",
    category: "Announcements",
    readTime: "3 min read",
  },
  {
    id: 6,
    title: "Tips for Students: How to Prepare for Innovation Challenges",
    excerpt: "Practical advice for students looking to participate in innovation competitions and showcases.",
    author: "Ama Sarpong",
    date: "January 15, 2024",
    category: "Tips & Guides",
    readTime: "7 min read",
  },
  {
    id: 7,
    title: "2023 Year in Review: Our Impact and Milestones",
    excerpt: "A comprehensive look at what we achieved in 2023 and our goals for the coming year.",
    author: "Emmanuel Danso",
    date: "January 5, 2024",
    category: "Updates",
    readTime: "10 min read",
  },
];

const categories = [
  "All Posts",
  "Impact Stories",
  "Success Stories",
  "Education",
  "Volunteer Stories",
  "Announcements",
  "Tips & Guides",
  "Updates",
];

export default function Blog() {
  const [featuredPost, setFeaturedPost] = useState(fallbackFeaturedPost);
  const [blogPosts, setBlogPosts] = useState(fallbackBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/blog");
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.data && data.data.length > 0) {
            // Set featured post (first post)
            const firstPost = data.data[0];
            setFeaturedPost({
              id: firstPost._id || 1,
              title: firstPost.title,
              excerpt: firstPost.excerpt,
              author: firstPost.author,
              date: firstPost.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              category: firstPost.category || "Updates",
              readTime: `${Math.ceil(firstPost.content?.length / 1000) || 5} min read`
            });
            
            // Set other blog posts
            const otherPosts = data.data.slice(1, 7).map((post: any, index: number) => ({
              id: post._id || index + 2,
              title: post.title,
              excerpt: post.excerpt,
              author: post.author,
              date: post.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              category: post.category || ["Success Stories", "Education", "Volunteer Stories", "Announcements", "Tips & Guides", "Updates"][index],
              readTime: `${Math.ceil(post.content?.length / 1000) || 5} min read`
            }));
            
            setBlogPosts(otherPosts);
            setUsingFallback(false);
          } else {
            setUsingFallback(true);
          }
        } else {
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Posts" || 
      post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero pb-24 pt-20 lg:pb-28 lg:pt-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              Blog & News
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Stories of impact, educational insights, and updates from our programs 
              across Ghana.
            </p>
            
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 -mb-px">
          <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="block h-[100px] w-full">
            <path
              d="M0 100V50C240 16.67 480 0 720 0C960 0 1200 16.67 1440 50V100H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="border-b border-border py-6">
        <div className="container">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary ${
                    selectedCategory === category
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-xl lg:grid lg:grid-cols-2">
            <div className="aspect-video bg-gradient-hero lg:aspect-auto">
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-primary-foreground">
                  <span className="text-6xl font-bold">📰</span>
                  <p className="mt-4 text-sm">Featured Article</p>
                </div>
              </div>
            </div>
            <div className="p-6 lg:p-8">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {featuredPost.category}
              </span>
              <h2 className="mt-4 font-heading text-2xl font-bold text-foreground lg:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {featuredPost.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{featuredPost.date}</span>
                </div>
                <span>{featuredPost.readTime}</span>
              </div>
              <Button variant="primary-gradient" className="mt-6">
                Read Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Latest Articles
          </h2>
          
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10" />
                <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  {post.category}
                </span>
                <h3 className="mt-3 font-heading text-lg font-bold text-foreground line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <Button variant="ghost" className="mt-4 -ml-3 w-full justify-start">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </article>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="rounded-3xl bg-gradient-hero p-8 lg:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground lg:text-4xl">
                Never Miss an Update
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Subscribe to our newsletter for the latest stories, events, and news.
              </p>
              <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="hero">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}