import { test, expect } from '@playwright/test';

test.describe('Task Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should add a new task with all fields', async ({ page }) => {
    // Click add task button
    await page.click('button:has-text("Add Task")');
    
    // Fill in task details
    await page.fill('input[placeholder*="task title"]', 'Test Task');
    await page.fill('textarea[placeholder*="description"]', 'Test Description');
    
    // Select category
    await page.click('text=Personal');
    
    // Select priority
    await page.click('text=High');
    
    // Set due date
    await page.fill('input[type="date"]', '2026-12-31');
    
    // Submit
    await page.click('button:has-text("Create Task")');
    
    // Verify task appears
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  test('should search tasks', async ({ page }) => {
    // Add a task first
    await page.click('button:has-text("Add Task")');
    await page.fill('input[placeholder*="task title"]', 'Searchable Task');
    await page.click('button:has-text("Create Task")');
    
    // Search for it
    await page.fill('input[placeholder*="Search"]', 'Searchable');
    
    // Verify it appears
    await expect(page.locator('text=Searchable Task')).toBeVisible();
    
    // Search for non-existent task
    await page.fill('input[placeholder*="Search"]', 'NonExistent');
    await expect(page.locator('text=Searchable Task')).not.toBeVisible();
  });

  test('should filter by category and priority', async ({ page }) => {
    // Click filter button
    await page.click('button:has-text("Filters")');
    
    // Select a category filter
    await page.click('text=Work');
    
    // Verify filter is applied (check URL or visual feedback)
    await expect(page.locator('button:has-text("Work")')).toHaveClass(/active|selected/);
  });

  test('should complete and uncomplete a task', async ({ page }) => {
    // Add a task
    await page.click('button:has-text("Add Task")');
    await page.fill('input[placeholder*="task title"]', 'Complete Me');
    await page.click('button:has-text("Create Task")');
    
    // Complete the task (checkbox or button)
    const taskCard = page.locator('text=Complete Me').locator('..');
    await taskCard.locator('input[type="checkbox"]').first().check();
    
    // Verify completed state (strikethrough, different style, etc.)
    await expect(taskCard).toHaveClass(/completed|done/);
    
    // Uncomplete
    await taskCard.locator('input[type="checkbox"]').first().uncheck();
    await expect(taskCard).not.toHaveClass(/completed|done/);
  });

  test('should delete a task', async ({ page }) => {
    // Add a task
    await page.click('button:has-text("Add Task")');
    await page.fill('input[placeholder*="task title"]', 'Delete Me');
    await page.click('button:has-text("Create Task")');
    
    // Delete the task
    const taskCard = page.locator('text=Delete Me').locator('..');
    await taskCard.hover();
    await taskCard.locator('button[aria-label*="delete" i]').click();
    
    // Confirm deletion if there's a modal
    await page.click('button:has-text("Delete")');
    
    // Verify task is gone
    await expect(page.locator('text=Delete Me')).not.toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find and click dark mode toggle
    await page.click('button[aria-label*="dark mode" i]');
    
    // Verify dark mode is applied (check body class or data attribute)
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back
    await page.click('button[aria-label*="dark mode" i]');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
});
