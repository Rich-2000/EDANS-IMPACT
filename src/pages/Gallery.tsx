import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Video
} from "lucide-react";

// Import your images from assets folder
import image1 from '../assets/images/innovation-summit.jpg';
import image2 from '../assets/images/stem-workshop.jpg';
import image3 from '../assets/images/community-outreach.jpg';
import image4 from '../assets/images/leadership-training.jpg';
import image5 from '../assets/images/award-ceremony.jpg';
import image6 from '../assets/images/environmental-project.jpg';
import image7 from '../assets/images/volunteer-team.jpg';
import image8 from '../assets/images/creative-arts.jpg';
import image9 from '../assets/images/environment-project-2.jpg';
import image10 from '../assets/images/career-fair.jpg';
import image11 from '../assets/images/student-success.jpg';
// Import your video
import video1 from '../assets/videos/student-success.mp4';

// Fallback data
const fallbackGalleryItems = [
  {
    id: 1,
    type: "image",
    src: image1,
    title: "Innovation Summit 2023",
    description: "Students presenting their projects at the annual Innovation Summit",
    category: "Events",
  },
  {
    id: 2,
    type: "image",
    src: image2,
    title: "STEM Workshop",
    description: "Hands-on robotics workshop with students in Kumasi",
    category: "Workshops",
  },
  {
    id: 3,
    type: "video",
    src: video1,
    title: "Student Success Story",
    description: "Kofi shares how Edans Impact changed his life",
    category: "Stories",
  },
  {
    id: 4,
    type: "image",
    src: image3,
    title: "Community Outreach",
    description: "Our team visiting partner schools in the Northern Region",
    category: "Community",
  },
  {
    id: 5,
    type: "image",
    src: image4,
    title: "Leadership Training",
    description: "Students participating in leadership development activities",
    category: "Programs",
  },
  {
    id: 6,
    type: "image",
    src: image5,
    title: "Award Ceremony",
    description: "Recognizing outstanding student innovators",
    category: "Events",
  },
  {
    id: 7,
    type: "image",
    src: image6,
    title: "Program Highlights 2023",
    description: "A recap of our programs throughout the year",
    category: "Programs",
  },
  {
    id: 8,
    type: "image",
    src: image7,
    title: "Volunteer Team",
    description: "Our amazing volunteers at a community event",
    category: "Community",
  },
  {
    id: 9,
    type: "image",
    src: image8,
    title: "Creative Arts Session",
    description: "Students exploring creativity through art",
    category: "Workshops",
  },
  {
    id: 10,
    type: "image",
    src: image9,
    title: "Environmental Project",
    description: "Students working on their recycling initiative",
    category: "Programs",
  },
  {
    id: 11,
    type: "image",
    src: image10,
    title: "Career Fair",
    description: "Students meeting industry professionals",
    category: "Events",
  },
  {
    id: 12,
    type: "image",
    src: image11,
    title: "Mentor Interview",
    description: "A mentor shares their experience with the program",
    category: "Stories",
  },
];

const categories = ["All", "Events", "Workshops", "Programs", "Community", "Stories"];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState(fallbackGalleryItems);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://edans-impact-backend.onrender.com/api/gallery");
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.data && data.data.length > 0) {
            // Transform API data to match our structure
            const transformedItems = data.data.map((item: any, index: number) => ({
              id: item._id || index + 1,
              type: item.type || "image",
              src: item.url || item.src || fallbackGalleryItems[index]?.src || image1,
              title: item.title || `Gallery Item ${index + 1}`,
              description: item.description || "Gallery item description",
              category: item.category || ["Events", "Workshops", "Programs", "Community", "Stories"][index % 5]
            }));
            
            setGalleryItems(transformedItems);
            setUsingFallback(false);
          } else {
            setUsingFallback(true);
          }
        } else {
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

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
              Gallery
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Explore photos and videos from our programs, events, and the 
              incredible students we work with.
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

      {/* Filter Categories */}
      <section className="border-b border-border py-6">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 to-secondary/20 transition-transform hover:scale-105"
              >
                {/* Image/Video Preview */}
                {item.type === "video" ? (
                  <div className="relative h-full w-full">
                    <video
                      src={item.src}
                      className="h-full w-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/80 backdrop-blur-sm">
                        <Play className="h-8 w-8 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="font-heading text-lg font-bold text-primary-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-primary-foreground/80 line-clamp-2">
                    {item.description}
                  </p>
                  {item.type === "video" && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/60">
                      <Video className="h-3 w-3" />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute right-2 top-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                  {item.category}
                </div>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No items found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4 backdrop-blur-sm"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-primary-foreground/20 p-2 text-primary-foreground transition-all hover:bg-primary-foreground/30 hover:scale-110"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/20 p-3 text-primary-foreground transition-all hover:bg-primary-foreground/30 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/20 p-3 text-primary-foreground transition-all hover:bg-primary-foreground/30 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Content */}
          <div className="max-h-[90vh] max-w-6xl w-full overflow-hidden rounded-2xl bg-card shadow-2xl">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
              {filteredItems[currentIndex]?.type === "video" ? (
                <video
                  src={filteredItems[currentIndex]?.src}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={filteredItems[currentIndex]?.src}
                  alt={filteredItems[currentIndex]?.title}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            
            {/* Info Panel */}
            <div className="p-6 border-t border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {filteredItems[currentIndex]?.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {filteredItems[currentIndex]?.description}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {filteredItems[currentIndex]?.category}
                </span>
              </div>
              
              {/* Counter */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  {currentIndex + 1} / {filteredItems.length}
                </p>
                <div className="flex gap-2">
                  {filteredItems[currentIndex]?.type === "video" && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Video className="h-4 w-4" />
                      Video
                    </span>
                  )}
                  {filteredItems[currentIndex]?.type === "image" && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload CTA */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Share Your Photos
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Were you part of one of our events or programs? We'd love to feature your photos!
            </p>
            <Button variant="primary-gradient" size="lg" className="mt-8">
              Submit Your Photos
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}