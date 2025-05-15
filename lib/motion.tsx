// A simple animation library to avoid importing framer-motion
// This provides just basic animations for components

export interface AnimationProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// Simple motion component that adds CSS classes for animations
export const motion = {
  div: ({ initial, animate, exit, transition, className = '', children, ...props }: AnimationProps) => {
    const animationClass = `animate-custom ${className}`;
    
    // In a real implementation, this would handle proper animation logic
    // For now, we're just passing through props and adding a class name
    return (
      <div className={animationClass} {...props}>
        {children}
      </div>
    );
  },
  
  // Add more HTML elements as needed
  section: ({ initial, animate, exit, transition, className = '', children, ...props }: AnimationProps) => {
    const animationClass = `animate-custom ${className}`;
    
    return (
      <section className={animationClass} {...props}>
        {children}
      </section>
    );
  },
  
  span: ({ initial, animate, exit, transition, className = '', children, ...props }: AnimationProps) => {
    const animationClass = `animate-custom ${className}`;
    
    return (
      <span className={animationClass} {...props}>
        {children}
      </span>
    );
  },
  
  // ... other elements
};