# Pixelscape - Professional Image Discovery Platform

## Overview
Pixelscape is a sophisticated image discovery platform that provides access to millions of high-quality, professionally curated images. Built with modern web technologies, it offers a seamless and intuitive interface for exploring, searching, and downloading stunning visuals for creative projects.

## Features

### Immersive Image Discovery
- Dynamic image gallery with Pinterest-style masonry layout
- Real-time image search with instant results
- Smooth infinite scrolling for continuous exploration
- Fluid animations and transitions for enhanced user experience

### Professional Image Quality
- Access to high-resolution professional photographs
- Multiple download resolution options
- Full image attribution and metadata
- Optimized image loading and caching

### Intuitive User Interface
- Clean, modern design aesthetic
- Responsive layout for all devices
- Glass-morphism effects and modern UI elements
- Seamless navigation between sections

### Advanced Search Capabilities
- Category-based image filtering
- Real-time search suggestions
- Smart image categorization
- Trending searches and popular categories

### Technical Excellence
- Built with React and modern JavaScript
- Powered by Unsplash API
- Framer Motion animations
- TailwindCSS styling
- Responsive design principles

## Technology Stack
- React 18
- TailwindCSS
- Framer Motion
- Unsplash API
- Modern JavaScript (ES6+)

## Design Philosophy
Pixelscape emphasizes simplicity and functionality while maintaining a professional aesthetic. The platform is built with performance and user experience at its core, ensuring smooth navigation and efficient image discovery for creative professionals and enthusiasts alike.

## Credits
Powered by Unsplash API, providing access to millions of high-quality images from professional photographers worldwide.

## Deployment Guide (Render)

### Prerequisites
- A Render account (https://render.com)
- Your project pushed to a GitHub repository

### Deployment Steps

1. **Build Configuration**
   Create a `render.yaml` file in your project root:

2. **Environment Setup**
   - Go to Render Dashboard
   - Click "New +"
   - Select "Static Site"
   - Connect your GitHub repository
   - Configure the following settings:
     - Name: `pixelscape` (or your preferred name)
     - Build Command: `npm install && npm run build`
     - Publish Directory: `build`

3. **Environment Variables**
   Add the following environment variables in Render:
   - `REACT_APP_UNSPLASH_ACCESS_KEY`

4. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your site

### Auto Deployment
Render automatically deploys when you push to your repository's main branch.

### Custom Domain (Optional)
1. Go to your site's settings in Render
2. Navigate to "Custom Domains"
3. Add your domain and follow the DNS configuration instructions

---

*Pixelscape - Where Creativity Meets Quality*
