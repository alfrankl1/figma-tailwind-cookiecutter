import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-base p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Typography Examples */}
        <div className="bg-neutral-tertiary p-6 rounded-lg">
          <h1 className="font-display text-brand-primary mb-4">
            Design System Demo
          </h1>
          
          <h2 className="font-title text-neutral-primary mb-3">
            Semantic Font Classes
          </h2>
          
          <h3 className="font-title-small text-neutral-secondary mb-2">
            Typography Hierarchy
          </h3>
          
          <h4 className="font-subtitle text-brand-secondary mb-2">
            Subtitle Example
          </h4>
          
          <h5 className="font-subtitle-small text-neutral-tertiary mb-4">
            Subtitle Small Example
          </h5>
          
          <p className="font-body-large text-default-primary mb-3">
            This is large body text that demonstrates how our semantic font classes work with semantic color classes.
          </p>
          
          <p className="font-body-regular text-default-secondary mb-3">
            This is regular body text with proper line height and spacing for optimal readability.
          </p>
          
          <p className="font-body-small text-default-tertiary mb-4">
            This is small body text that might be used for secondary information.
          </p>
          
          <p className="font-caption text-neutral-tertiary mb-4">
            This is caption text for image descriptions or metadata.
          </p>
          
          <div className="font-code bg-neutral text-inverse-primary p-4 rounded mb-4">
            console.log("Code example with monospace font");
          </div>
          
          <div className="space-x-4">
            <button className="font-button bg-brand text-inverse-primary px-4 py-2 rounded bg-brand-hover">
              Primary Button
            </button>
            
            <button className="font-button bg-neutral-secondary text-default-primary px-4 py-2 rounded bg-brand-secondary-hover">
              Secondary Button
            </button>
          </div>
        </div>
        
        {/* Color Examples */}
        <div className="bg-base-secondary p-6 rounded-lg">
          <h2 className="font-title-small text-neutral-primary mb-4">
            Semantic Color Classes
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-brand bg-brand-hover p-4 rounded">
              <p className="font-label text-inverse-primary">Brand</p>
            </div>
            
            <div className="bg-positive bg-positive-hover p-4 rounded">
              <p className="font-label text-inverse-primary">Positive</p>
            </div>
            
            <div className="bg-warning p-4 rounded">
              <p className="font-label text-inverse-primary">Warning</p>
            </div>
            
            <div className="bg-danger p-4 rounded">
              <p className="font-label text-inverse-primary">Danger</p>
            </div>
          </div>
        </div>
        
        {/* Interactive Examples */}
        <div className="bg-brand-tertiary p-6 rounded-lg">
          <h2 className="font-subtitle text-brand-primary mb-4">
            Interactive Elements
          </h2>
          
          <div className="space-y-4">
            <div className="border-brand-secondary border-2 p-4 rounded">
              <label className="font-label text-brand-secondary block mb-2">
                Input Label
              </label>
              <input 
                type="text" 
                placeholder="Type something..."
                className="bg-base border-default border w-full px-3 py-2 rounded focus:border-brand-primary font-input"
              />
            </div>
            
            <div className="bg-positive-tertiary border-positive border-l-4 p-4 rounded">
              <p className="font-body-regular text-positive-primary">
                Success message with semantic colors and typography
              </p>
            </div>
            
            <div className="bg-warning-tertiary border-warning border-l-4 p-4 rounded">
              <p className="font-body-regular text-warning-primary">
                Warning message with semantic colors and typography
              </p>
            </div>
            
            <div className="bg-danger-tertiary border-danger border-l-4 p-4 rounded">
              <p className="font-body-regular text-danger-primary">
                Error message with semantic colors and typography
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
