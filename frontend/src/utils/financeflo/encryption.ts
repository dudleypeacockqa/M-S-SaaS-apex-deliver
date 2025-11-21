// Data encryption and privacy utilities
import { logger } from '@/utils/logger';

export class DataEncryption {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  // Generate a cryptographically secure key
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt sensitive data
  static async encrypt(data: string, key: CryptoKey): Promise<{ encryptedData: string; iv: string }> {
    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = this.encoder.encode(data);

      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encodedData
      );

      const encryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
      const ivBase64 = btoa(String.fromCharCode(...iv));

      logger.debug('Data encrypted successfully');
      return { encryptedData, iv: ivBase64 };
    } catch (error) {
      logger.error('Encryption failed', error as Error);
      throw new Error('Encryption failed');
    }
  }

  // Decrypt sensitive data
  static async decrypt(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
    try {
      const encryptedBuffer = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      const ivBuffer = new Uint8Array(
        atob(iv).split('').map(char => char.charCodeAt(0))
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer,
        },
        key,
        encryptedBuffer
      );

      const decryptedData = this.decoder.decode(decryptedBuffer);
      logger.debug('Data decrypted successfully');
      return decryptedData;
    } catch (error) {
      logger.error('Decryption failed', error as Error);
      throw new Error('Decryption failed');
    }
  }

  // Hash data for comparison (non-reversible)
  static async hash(data: string): Promise<string> {
    try {
      const encodedData = this.encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      logger.debug('Data hashed successfully');
      return hashHex;
    } catch (error) {
      logger.error('Hashing failed', error as Error);
      throw new Error('Hashing failed');
    }
  }
}

// PII (Personally Identifiable Information) utilities
export class PIIUtils {
  private static readonly EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  private static readonly PHONE_REGEX = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  private static readonly SSN_REGEX = /\b\d{3}-?\d{2}-?\d{4}\b/g;
  private static readonly CREDIT_CARD_REGEX = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;

  // Mask PII data for logging/display
  static maskPII(text: string): string {
    return text
      .replace(this.EMAIL_REGEX, (match) => {
        const [local, domain] = match.split('@');
        return `${local.charAt(0)}***@${domain}`;
      })
      .replace(this.PHONE_REGEX, '***-***-****')
      .replace(this.SSN_REGEX, '***-**-****')
      .replace(this.CREDIT_CARD_REGEX, '**** **** **** ****');
  }

  // Detect if text contains PII
  static containsPII(text: string): boolean {
    return this.EMAIL_REGEX.test(text) ||
           this.PHONE_REGEX.test(text) ||
           this.SSN_REGEX.test(text) ||
           this.CREDIT_CARD_REGEX.test(text);
  }

  // Extract PII from text
  static extractPII(text: string): { type: string; value: string }[] {
    const piiData: { type: string; value: string }[] = [];

    // Extract emails
    const emails = text.match(this.EMAIL_REGEX);
    if (emails) {
      emails.forEach(email => piiData.push({ type: 'email', value: email }));
    }

    // Extract phone numbers
    const phones = text.match(this.PHONE_REGEX);
    if (phones) {
      phones.forEach(phone => piiData.push({ type: 'phone', value: phone }));
    }

    // Extract SSNs
    const ssns = text.match(this.SSN_REGEX);
    if (ssns) {
      ssns.forEach(ssn => piiData.push({ type: 'ssn', value: ssn }));
    }

    // Extract credit cards
    const creditCards = text.match(this.CREDIT_CARD_REGEX);
    if (creditCards) {
      creditCards.forEach(cc => piiData.push({ type: 'credit_card', value: cc }));
    }

    return piiData;
  }
}

// Secure local storage with encryption
export class SecureStorage {
  private static key: CryptoKey | null = null;

  static async initialize(): Promise<void> {
    this.key = await DataEncryption.generateKey();
    logger.info('Secure storage initialized');
  }

  static async setItem(key: string, value: string): Promise<void> {
    if (!this.key) await this.initialize();
    
    try {
      const { encryptedData, iv } = await DataEncryption.encrypt(value, this.key!);
      const storageData = { encryptedData, iv };
      localStorage.setItem(key, JSON.stringify(storageData));
      logger.debug('Secure storage item set', { key });
    } catch (error) {
      logger.error('Failed to set secure storage item', error as Error, { key });
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    if (!this.key) await this.initialize();
    
    try {
      const storageItem = localStorage.getItem(key);
      if (!storageItem) return null;

      const { encryptedData, iv } = JSON.parse(storageItem);
      const decryptedData = await DataEncryption.decrypt(encryptedData, iv, this.key!);
      logger.debug('Secure storage item retrieved', { key });
      return decryptedData;
    } catch (error) {
      logger.error('Failed to get secure storage item', error as Error, { key });
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
    logger.debug('Secure storage item removed', { key });
  }

  static clear(): void {
    localStorage.clear();
    logger.info('Secure storage cleared');
  }
}