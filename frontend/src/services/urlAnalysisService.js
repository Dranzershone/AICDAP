import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class URLAnalysisService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('Response error:', error);

        // Handle specific error cases
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;

          switch (status) {
            case 400:
              throw new Error(data.detail || 'Invalid request');
            case 404:
              throw new Error('Service not found');
            case 429:
              throw new Error('Too many requests. Please try again later.');
            case 500:
              throw new Error('Internal server error. Please try again later.');
            default:
              throw new Error(data.detail || `HTTP ${status} error`);
          }
        } else if (error.request) {
          // Network error
          throw new Error('Network error. Please check your connection and try again.');
        } else {
          // Other error
          throw new Error(error.message || 'An unexpected error occurred');
        }
      }
    );
  }

  /**
   * Analyze a single URL for phishing indicators
   * @param {string} url - The URL to analyze
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeUrl(url) {
    try {
      if (!url || typeof url !== 'string') {
        throw new Error('URL is required and must be a string');
      }

      const response = await this.api.post('/api/analyze-url', { url: url.trim() });
      return response.data;
    } catch (error) {
      console.error('Error analyzing URL:', error);
      throw error;
    }
  }

  /**
   * Analyze multiple URLs in bulk
   * @param {string[]} urls - Array of URLs to analyze (max 50)
   * @returns {Promise<Object>} Bulk analysis results
   */
  async analyzeBulkUrls(urls) {
    try {
      if (!Array.isArray(urls)) {
        throw new Error('URLs must be provided as an array');
      }

      if (urls.length === 0) {
        throw new Error('At least one URL is required');
      }

      if (urls.length > 50) {
        throw new Error('Maximum 50 URLs allowed for bulk analysis');
      }

      // Filter out empty URLs and trim whitespace
      const cleanUrls = urls
        .map(url => url?.trim())
        .filter(url => url && url.length > 0);

      if (cleanUrls.length === 0) {
        throw new Error('No valid URLs provided');
      }

      const response = await this.api.post('/api/analyze-urls/bulk', { urls: cleanUrls });
      return response.data;
    } catch (error) {
      console.error('Error analyzing bulk URLs:', error);
      throw error;
    }
  }

  /**
   * Get URL analysis statistics and detector status
   * @returns {Promise<Object>} Analysis statistics
   */
  async getAnalysisStats() {
    try {
      const response = await this.api.get('/api/url-analysis/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting analysis stats:', error);
      throw error;
    }
  }

  /**
   * Check if a URL is valid
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is valid
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Parse URLs from text (one per line)
   * @param {string} text - Text containing URLs
   * @returns {string[]} Array of parsed URLs
   */
  static parseUrlsFromText(text) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.startsWith('#')) // Allow comments
      .slice(0, 50); // Limit to 50 URLs
  }

  /**
   * Format analysis result for display
   * @param {Object} result - Analysis result
   * @returns {Object} Formatted result
   */
  static formatAnalysisResult(result) {
    if (!result) return null;

    return {
      ...result,
      confidencePercentage: Math.round(result.confidence_score * 100),
      riskLevelDisplay: result.risk_level.replace('-', ' ').toUpperCase(),
      timestamp: new Date(result.analyzed_at || Date.now()).toLocaleString(),
    };
  }

  /**
   * Get risk level color for UI display
   * @param {string} riskLevel - Risk level
   * @returns {string} Material-UI color
   */
  static getRiskColor(riskLevel) {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low-medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  }

  /**
   * Get risk level severity score (0-100)
   * @param {string} riskLevel - Risk level
   * @returns {number} Severity score
   */
  static getRiskSeverity(riskLevel) {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 100;
      case 'medium':
        return 70;
      case 'low-medium':
        return 40;
      case 'low':
        return 20;
      default:
        return 0;
    }
  }

  /**
   * Generate summary statistics from bulk results
   * @param {Object} bulkResults - Bulk analysis results
   * @returns {Object} Summary statistics
   */
  static generateSummaryStats(bulkResults) {
    if (!bulkResults?.results) {
      return {
        totalAnalyzed: 0,
        totalPhishing: 0,
        totalSafe: 0,
        riskPercentage: 0,
        averageConfidence: 0,
        riskDistribution: {},
      };
    }

    const results = bulkResults.results;
    const totalAnalyzed = results.length;
    const totalPhishing = results.filter(r => r.is_phishing).length;
    const totalSafe = totalAnalyzed - totalPhishing;
    const riskPercentage = totalAnalyzed > 0 ? Math.round((totalPhishing / totalAnalyzed) * 100) : 0;

    const averageConfidence = totalAnalyzed > 0
      ? Math.round(results.reduce((sum, r) => sum + r.confidence_score, 0) / totalAnalyzed * 100)
      : 0;

    const riskDistribution = results.reduce((acc, result) => {
      acc[result.risk_level] = (acc[result.risk_level] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAnalyzed,
      totalPhishing,
      totalSafe,
      riskPercentage,
      averageConfidence,
      riskDistribution,
    };
  }
}

// Export singleton instance
const urlAnalysisService = new URLAnalysisService();
export default urlAnalysisService;

// Export class for testing or multiple instances
export { URLAnalysisService };
