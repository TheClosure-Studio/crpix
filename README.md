# CR Pix Photography

A modern, high-performance portfolio website for CR Pix Photography, built with Next.js. This application showcases photography services, galleries, and videos with a focus on visual excellence and user experience.

## Features

- **Modern Design**: Premium aesthetic with smooth animations, glassmorphism effects, and a responsive layout using Tailwind CSS.
- **Gallery & Media**: robust gallery system with high-performance image loading, lightbox view, and video support (YouTube & Instagram).
- **SEO Optimized**: Fully optimized with dynamic metadata, Open Graph support, sitemaps, and robots.txt.
- **Image Optimization**: Custom shimmer loading effects, responsive image sizing, and priority loading for LCP elements.
- **Admin Dashboard**: Secure admin area for managing portfolio images and videos.
- **Contact Integration**: Easy-to-use contact form and social media integration.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel ready

## Getting Started

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/crpix.git
    cd crpix
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables:
    Create a `.env.local` file with your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run the development server:

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to view the application.

## SEO Configuration

The site is configured for the domain `https://crpix.in`.

- **Sitemap**: Automatically generated at `/sitemap.xml`
- **Robots**: Configured at `/robots.txt`
- **Open Graph**: Dynamic OG images generated via `app/opengraph-image.js`

## Image Optimization

This project uses advanced techniques for image loading:

- **Shimmer Effect**: A custom CSS animation provides a premium loading experience.
- **Responsive Sizes**: Images are served in optimal sizes for different devices to save bandwidth.
- **Priority Loading**: Critical images (Hero, Logo) are prioritized for faster LCP.
