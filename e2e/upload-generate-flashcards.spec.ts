import { test, expect } from '@playwright/test';

test.describe('Document Upload and Flashcard Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login credentials and submit
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('/dashboard');
  });

  test('should upload a document and generate flashcards', async ({ page }) => {
    // Navigate to library page
    await page.click('a[href="/dashboard/library"]');
    await page.waitForURL('/dashboard/library');
    
    // Click on upload button
    await page.click('button:has-text("Upload")');
    
    // Wait for upload modal to appear
    await page.waitForSelector('div[role="dialog"]');
    
    // Upload a file
    // Note: In a real test, we would use a test fixture file
    await page.setInputFiles('input[type="file"]', {
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Test document content')
    });
    
    // Click upload button in modal
    await page.click('button:has-text("Upload Document")');
    
    // Wait for upload to complete and document to appear in library
    await page.waitForSelector('div:has-text("test-document.pdf")');
    
    // Click on the uploaded document
    await page.click('div:has-text("test-document.pdf")');
    
    // Wait for document details page to load
    await page.waitForSelector('h1:has-text("test-document.pdf")');
    
    // Click on "Generate Flashcards" button
    await page.click('button:has-text("Generate Flashcards")');
    
    // Wait for flashcard generation to complete
    await page.waitForSelector('div:has-text("Flashcards Generated")');
    
    // Verify flashcards are displayed
    const flashcardsSection = await page.locator('section:has-text("Flashcards")');
    await expect(flashcardsSection).toBeVisible();
    
    // Check if at least one flashcard is visible
    const flashcard = await flashcardsSection.locator('.flashcard').first();
    await expect(flashcard).toBeVisible();
    
    // Test flashcard interaction (flip)
    await flashcard.click();
    await expect(flashcard.locator('.flashcard-back')).toBeVisible();
  });

  test('should view document dashboard with all generated tools', async ({ page }) => {
    // Navigate to library page
    await page.click('a[href="/dashboard/library"]');
    
    // Click on an existing document
    await page.click('div:has-text("test-document.pdf")');
    
    // Wait for document dashboard to load
    await page.waitForSelector('h1:has-text("test-document.pdf")');
    
    // Verify all tool sections are present
    await expect(page.locator('section:has-text("Flashcards")')).toBeVisible();
    await expect(page.locator('section:has-text("Summary")')).toBeVisible();
    await expect(page.locator('section:has-text("Quiz")')).toBeVisible();
    await expect(page.locator('section:has-text("Podcast")')).toBeVisible();
    
    // Test document-specific chatbot
    await page.click('button:has-text("Chat with this document")');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What is this document about?');
    await page.press('textarea[placeholder*="Ask a question"]', 'Enter');
    
    // Wait for response
    await page.waitForSelector('div.chat-message:has-text("document")');
  });
});
