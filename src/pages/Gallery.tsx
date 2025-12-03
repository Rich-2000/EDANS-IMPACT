import { useState } from "react";
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

const galleryItems = [
  {
    id: 1,
    type: "image",
    title: "Innovation Summit 2023",
    description: "Students presenting their projects at the annual Innovation Summit",
    category: "Events",
  },
  {
    id: 2,
    type: "image",
    title: "STEM Workshop",
    description: "Hands-on robotics workshop with students in Kumasi",
    category: "Workshops",
  },
  {
    id: 3,
    type: "video",
    title: "Student Success Story",
    description: "Kofi shares how Edans Impact changed his life",
    category: "Stories",
  },
  {
    id: 4,
    type: "image",
    title: "Community Outreach",
    description: "Our team visiting partner schools in the Northern Region",
    category: "Community",
  },
  {
    id: 5,
    type: "image",
    title: "Leadership Training",
    description: "Students participating in leadership development activities",
    category: "Programs",
  },
  {
    id: 6,
    type: "image",
    title: "Award Ceremony",
    description: "Recognizing outstanding student innovators",
    category: "Events",
  },
  {
    id: 7,
    type: "video",
    title: "Program Highlights 2023",
    description: "A recap of our programs throughout the year",
    category: "Programs",
  },
  {
    id: 8,
    type: "image",
    title: "Volunteer Team",
    description: "Our amazing volunteers at a community event",
    category: "Community",
  },
  {
    id: 9,
    type: "image",
    title: "Creative Arts Session",
    description: "Students exploring creativity through art",
    category: "Workshops",
  },
  {
    id: 10,
    type: "image",
    title: "Environmental Project",
    description: "Students working on their recycling initiative",
    category: "Programs",
  },
  {
    id: 11,
    type: "image",
    title: "Career Fair",
    description: "Students meeting industry professionals",
    category: "Events",
  },
  {
    id: 12,
    type: "video",
    title: "Mentor Interview",
    description: "A mentor shares their experience with the program",
    category: "Stories",
  },
];

const categories = ["All", "Events", "Workshops", "Programs", "Community", "Stories"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
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
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full">
            <path d="M0 100V50C240 16.67 480 0 720 0C960 0 1200 16.67 1440 50V100H0Z" fill="hsl(var(--background))" />
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
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 to-secondary/20"
              >
                {/* Placeholder for actual images */}
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  {item.type === "video" ? (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                  ) : (
                    <ImageIcon className="h-12 w-12 text-primary/50" />
                  )}
                  <p className="mt-4 text-sm font-medium text-foreground">{item.title}</p>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="font-heading text-lg font-bold text-primary-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    {item.description}
                  </p>
                  {item.type === "video" && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/60">
                      <Video className="h-3 w-3" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4">
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-primary-foreground/20 p-2 text-primary-foreground transition-colors hover:bg-primary-foreground/30"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToPrevious}
            className="absolute left-4 rounded-full bg-primary-foreground/20 p-2 text-primary-foreground transition-colors hover:bg-primary-foreground/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 rounded-full bg-primary-foreground/20 p-2 text-primary-foreground transition-colors hover:bg-primary-foreground/30 lg:right-auto lg:left-auto"
            style={{ right: '4rem' }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="max-h-[80vh] max-w-4xl overflow-hidden rounded-2xl bg-card">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {filteredItems[currentIndex]?.type === "video" ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/30">
                  <Play className="h-10 w-10 text-primary" />
                </div>
              ) : (
                <ImageIcon className="h-20 w-20 text-primary/50" />
              )}
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold text-foreground">
                {filteredItems[currentIndex]?.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {filteredItems[currentIndex]?.description}
              </p>
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
