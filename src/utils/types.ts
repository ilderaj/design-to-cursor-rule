/**
 * Interface for design elements extracted from images
 */
export interface DesignElements {
  /**
   * Array of color hex codes
   */
  colors: string[];
  
  /**
   * Typography information
   */
  typography: {
    /**
     * Array of font family names
     */
    fontFamily: string[];
    
    /**
     * Array of font sizes in pixels
     */
    fontSizes: number[];
    
    /**
     * Array of font weights
     */
    fontWeights: number[];
  };
  
  /**
   * Array of spacing values in pixels
   */
  spacing: number[];
  
  /**
   * Array of border radius values in pixels
   */
  borderRadius: number[];
  
  /**
   * Array of component names
   */
  components: string[];
} 