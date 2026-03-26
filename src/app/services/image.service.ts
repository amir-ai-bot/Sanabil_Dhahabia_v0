import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  // Use proxy URL for images - goes through Angular dev server proxy to backend
  private imageApiUrl = '/api/image.php';
  private publicImagesUrl = '/public/images/products/';
  
  constructor() {}

  /**
   * Retourne l'URL directe au backend pour une image de produit
   */
  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'assets/placeholder.svg';
    }

    // External URL - return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // For local images, use direct public URL through proxy
    // Remove any path prefix and ensure we have the filename
    const filename = imagePath.replace(/^.*[\\\/]/, ''); // Extract filename from path
    return `${this.publicImagesUrl}${filename}`;
  }

  /**
   * Vérifie si une image est accessible
   */
  async isImageAccessible(imagePath: string): Promise<boolean> {
    try {
      const url = this.getImageUrl(imagePath);
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
