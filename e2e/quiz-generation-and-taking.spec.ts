import { test, expect } from '@playwright/test';

/**
 * E2E test for quiz generation and taking flow
 * This test covers:
 * 1. User login
 * 2. Document upload
 * 3. Quiz generation
 * 4. Taking a quiz
 * 5. Viewing quiz results
 */
test('should generate and take a quiz from an uploaded document', async ({ page }) => {
  // 1. Login
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
  await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'password');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForURL('/dashboard/home');
  await expect(page).toHaveURL('/dashboard/home');
  
  // 2. Navigate to document upload
  await page.click('a[href="/dashboard/documents"]');
  await page.waitForURL('/dashboard/documents');
  await page.click('button:has-text("Upload")');
  
  // 3. Upload a document
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles('./e2e/fixtures/test-document.pdf');
  await page.fill('input[name="title"]', 'Test Document for Quiz');
  await page.click('button[type="submit"]:has-text("Upload")');
  
  // Wait for document processing
  await page.waitForSelector('text=Document uploaded successfully');
  
  // 4. Navigate to document details
  await page.click('a:has-text("Test Document for Quiz")');
  
  // 5. Generate quiz
  await page.click('button:has-text("Generate Quiz")');
  await page.waitForSelector('text=Quiz generated successfully');
  
  // 6. Navigate to quiz
  await page.click('a:has-text("Take Quiz")');
  
  // 7. Take the quiz
  // Answer multiple choice questions
  const multipleChoiceQuestions = await page.locator('.quiz-question.multiple-choice');
  const count = await multipleChoiceQuestions.count();
  
  for (let i = 0; i < count; i++) {
    // Select the first option for each question
    await page.locator('.quiz-question.multiple-choice').nth(i).locator('input[type="radio"]').first().click();
  }
  
  // Answer short answer questions
  const shortAnswerQuestions = await page.locator('.quiz-question.short-answer');
  const shortAnswerCount = await shortAnswerQuestions.count();
  
  for (let i = 0; i < shortAnswerCount; i++) {
    await page.locator('.quiz-question.short-answer').nth(i).locator('textarea').fill('Test answer');
  }
  
  // Submit quiz
  await page.click('button:has-text("Submit Quiz")');
  
  // 8. Verify results page
  await page.waitForSelector('text=Quiz Results');
  await expect(page.locator('h1')).toContainText('Quiz Results');
  
  // Verify score is displayed
  await expect(page.locator('.quiz-score')).toBeVisible();
  
  // 9. Return to document dashboard
  await page.click('a:has-text("Back to Document")');
  await expect(page.locator('h1')).toContainText('Test Document for Quiz');
});

/**
 * E2E test for quiz retaking and improvement
 * This test covers:
 * 1. User login
 * 2. Navigating to an existing quiz
 * 3. Retaking the quiz
 * 4. Verifying score improvement tracking
 */
test('should allow retaking quizzes and track improvement', async ({ page }) => {
  // 1. Login
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
  await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'password');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForURL('/dashboard/home');
  
  // 2. Navigate to documents
  await page.click('a[href="/dashboard/documents"]');
  await page.waitForURL('/dashboard/documents');
  
  // 3. Find and click on existing document
  await page.click('a:has-text("Test Document for Quiz")');
  
  // 4. Navigate to quiz history
  await page.click('a:has-text("Quiz History")');
  
  // 5. Click on retake quiz
  await page.click('button:has-text("Retake Quiz")');
  
  // 6. Take the quiz again with better answers
  // Answer multiple choice questions
  const multipleChoiceQuestions = await page.locator('.quiz-question.multiple-choice');
  const count = await multipleChoiceQuestions.count();
  
  for (let i = 0; i < count; i++) {
    // This time select the correct answers (assuming second option is correct)
    await page.locator('.quiz-question.multiple-choice').nth(i).locator('input[type="radio"]').nth(1).click();
  }
  
  // Answer short answer questions
  const shortAnswerQuestions = await page.locator('.quiz-question.short-answer');
  const shortAnswerCount = await shortAnswerQuestions.count();
  
  for (let i = 0; i < shortAnswerCount; i++) {
    await page.locator('.quiz-question.short-answer').nth(i).locator('textarea').fill('Improved answer with more detail');
  }
  
  // Submit quiz
  await page.click('button:has-text("Submit Quiz")');
  
  // 7. Verify results page shows improvement
  await page.waitForSelector('text=Quiz Results');
  await expect(page.locator('.improvement-indicator')).toBeVisible();
  
  // 8. Verify quiz history is updated
  await page.click('a:has-text("Quiz History")');
  await expect(page.locator('.quiz-attempts')).toContainText('2 attempts');
});
