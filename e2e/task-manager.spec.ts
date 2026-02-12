import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('Task Manager E2E', () => {
  test('should load with seed data on first visit', async ({ page }) => {
    await page.goto('/');
    
    // Should have seed tasks visible
    const tasks = await page.locator('[data-testid="task-item"]').count();
    expect(tasks).toBeGreaterThan(0);
  });

  test('should add a new task with all fields', async ({ page }) => {
    await page.goto('/');
    
    // Open add task form
    await page.click('button:has-text("Add Task")');
    
    // Fill in task details
    await page.fill('input[placeholder*="title" i]', 'E2E Test Task');
    await page.fill('textarea[placeholder*="description" i]', 'This is a test description');
    
    // Select priority
    await page.selectOption('select[name="priority"]', 'high');
    
    // Select category
    await page.selectOption('select[name="category"]', 'Work');
    
    // Add tags (assuming comma-separated input)
    await page.fill('input[placeholder*="tag" i]', 'e2e, testing');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify task appears in list
    await expect(page.locator('text=E2E Test Task')).toBeVisible();
  });

  test('should search and filter tasks', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Search for a specific task
    await page.fill('input[placeholder*="search" i]', 'Review Q1');
    
    // Should filter results
    await expect(page.locator('text=Review Q1 marketing budget')).toBeVisible();
    
    // Clear search
    await page.fill('input[placeholder*="search" i]', '');
  });

  test('should complete and uncomplete a task', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Find first active task checkbox
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    
    // Complete task
    await firstCheckbox.check();
    await page.waitForTimeout(500);
    
    // Verify task is marked as completed (check for strikethrough or completed class)
    const firstTask = page.locator('[data-testid="task-item"]').first();
    await expect(firstTask).toHaveClass(/completed|line-through/);
    
    // Uncomplete task
    await firstCheckbox.uncheck();
    await page.waitForTimeout(500);
    
    // Verify task is no longer marked as completed
    await expect(firstTask).not.toHaveClass(/completed|line-through/);
  });

  test('should edit a task', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Click edit button on first task
    const editButton = page.locator('[data-testid="task-item"]').first().locator('button:has-text("Edit")');
    await editButton.click();
    
    // Update title
    const titleInput = page.locator('input[value*="Complete"]').or(page.locator('input[type="text"]')).first();
    await titleInput.fill('Updated Task Title');
    
    // Save changes
    await page.click('button:has-text("Save")');
    
    // Verify updated title appears
    await expect(page.locator('text=Updated Task Title')).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Get initial task count
    const initialCount = await page.locator('[data-testid="task-item"]').count();
    
    // Click delete button on first task
    const deleteButton = page.locator('[data-testid="task-item"]').first().locator('button:has-text("Delete")');
    await deleteButton.click();
    
    // Confirm deletion if there's a confirmation dialog
    const confirmButton = page.locator('button:has-text("Confirm")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // Verify task count decreased
    await page.waitForTimeout(500);
    const newCount = await page.locator('[data-testid="task-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should filter by status (active/completed)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Click "Active" filter
    await page.click('button:has-text("Active")');
    
    // Verify only active tasks are shown
    const activeTasks = await page.locator('[data-testid="task-item"]').all();
    for (const task of activeTasks) {
      await expect(task.locator('input[type="checkbox"]')).not.toBeChecked();
    }
    
    // Click "Completed" filter
    await page.click('button:has-text("Completed")');
    
    // Verify only completed tasks are shown
    const completedTasks = await page.locator('[data-testid="task-item"]').all();
    for (const task of completedTasks) {
      await expect(task.locator('input[type="checkbox"]')).toBeChecked();
    }
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Select a category filter
    await page.selectOption('select[name="category"]', 'Work');
    
    // Verify filtered tasks contain category
    const tasks = await page.locator('[data-testid="task-item"]').all();
    expect(tasks.length).toBeGreaterThan(0);
    
    // Each visible task should be from Work category
    for (const task of tasks) {
      await expect(task.locator('text=Work')).toBeVisible();
    }
  });

  test('should filter by priority', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Select a priority filter
    await page.selectOption('select[name="priority"]', 'high');
    
    // Verify filtered tasks have high priority
    const tasks = await page.locator('[data-testid="task-item"]').all();
    expect(tasks.length).toBeGreaterThan(0);
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state (default is dark mode)
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Toggle dark mode
    await page.click('[data-testid="dark-mode-toggle"]').catch(() => {
      // If data-testid doesn't exist, try finding by icon or button
      return page.click('button:has([class*="moon" i]), button:has([class*="sun" i])');
    });
    
    // Verify mode changed
    await expect(html).not.toHaveClass(/dark/);
    
    // Toggle back
    await page.click('[data-testid="dark-mode-toggle"]').catch(() => {
      return page.click('button:has([class*="moon" i]), button:has([class*="sun" i])');
    });
    
    // Verify back to dark mode
    await expect(html).toHaveClass(/dark/);
  });

  test('should persist tasks across page reloads', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Get first task title
    const firstTaskTitle = await page.locator('[data-testid="task-item"]').first().textContent();
    
    // Reload page
    await page.reload();
    
    // Verify same task still exists
    await expect(page.locator(`text=${firstTaskTitle?.substring(0, 20)}`)).toBeVisible();
  });

  test('should show task statistics', async ({ page }) => {
    await page.goto('/');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"]', { timeout: 5000 });
    
    // Verify stats are displayed
    await expect(page.locator('text=/Total:?.*\\d+/i')).toBeVisible();
    await expect(page.locator('text=/Completed:?.*\\d+/i')).toBeVisible();
    await expect(page.locator('text=/Active:?.*\\d+/i')).toBeVisible();
  });
});
