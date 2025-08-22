/**
 * Animation utility functions and classes for consistent animations across the app
 * Respects user's motion preferences automatically via Tailwind's motion-reduce variants
 */

export const fadeInUp = (delay = 0, index = 0) => ({
  className: "animate-fade-in-up motion-reduce:animate-none",
  style: { 
    animationDelay: `${delay + (index * 100)}ms`,
    animationFillMode: 'both'
  }
})

export const fadeInLeft = (delay = 0, index = 0) => ({
  className: "animate-fade-in-left motion-reduce:animate-none", 
  style: { 
    animationDelay: `${delay + (index * 100)}ms`,
    animationFillMode: 'both'
  }
})

export const fadeInRight = (delay = 0, index = 0) => ({
  className: "animate-fade-in-right motion-reduce:animate-none",
  style: { 
    animationDelay: `${delay + (index * 100)}ms`,
    animationFillMode: 'both'
  }
})

export const scaleIn = (delay = 0, index = 0) => ({
  className: "animate-scale-in motion-reduce:animate-none",
  style: { 
    animationDelay: `${delay + (index * 100)}ms`,
    animationFillMode: 'both'
  }
})

export const bounceIn = (delay = 0, index = 0) => ({
  className: "animate-bounce-in motion-reduce:animate-none",
  style: { 
    animationDelay: `${delay + (index * 150)}ms`,
    animationFillMode: 'both'
  }
})

export const slideInRight = (delay = 0, index = 0) => ({
  className: "animate-slide-in-right motion-reduce:animate-none",
  style: { 
    animationDelay: `${delay + (index * 100)}ms`,
    animationFillMode: 'both'
  }
})

// Stagger animation for lists
export const staggerContainer = (children: number) => ({
  className: "motion-reduce:animate-none",
  style: {
    animationDelay: '0ms'
  }
})

// Hover effects
export const hoverScale = "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 motion-reduce:hover:transform-none motion-reduce:active:transform-none motion-reduce:transition-none"

export const hoverLift = "hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:hover:transform-none motion-reduce:transition-none"

export const hoverGlow = "hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 motion-reduce:transition-none"

// Interactive animations
export const cardAnimation = "transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 motion-reduce:hover:transform-none motion-reduce:transition-none animate-fade-in-up"

export const buttonAnimation = "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:transform-none motion-reduce:active:transform-none motion-reduce:transition-none"

// Loading states
export const pulse = "animate-pulse-slow motion-reduce:animate-none"
export const float = "animate-float motion-reduce:animate-none"
export const shimmer = "animate-shimmer motion-reduce:animate-none"

// Page transitions
export const pageEnter = "animate-fade-in motion-reduce:animate-none"
export const modalEnter = "animate-scale-in-bounce motion-reduce:animate-scale-in motion-reduce:duration-100"