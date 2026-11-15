import { test, expect } from '@playwright/test';
import { MOCK_INGREDIENTS } from './hars/mock-data';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/ingredients', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: MOCK_INGREDIENTS }),
    })
  );

  await page.route('**/api/auth/user', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, user: { email: 'test@test.ru', name: 'Тест' } }),
    })
  );

  await page.route('**/api/orders', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, name: 'Space Burger', order: { number: 12345 } }),
      });
    } else {
      route.continue();
    }
  });

  await page.context().addCookies([
    { name: 'accessToken', value: 'mock-access-token', domain: 'localhost', path: '/' },
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.goto('/');
});

test.describe('Модальное окно ингредиента', () => {
  test('открывается с правильными данными и закрывается по крестику', async ({ page }) => {
    await expect(page.locator('#modals')).toBeEmpty();

    await page.getByText(MOCK_INGREDIENTS[0].name).first().click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(MOCK_INGREDIENTS[0].name)).toBeVisible();
    await expect(modal.getByText('Калории, ккал')).toBeVisible();

    await page.locator('#modals svg').first().click();
    await expect(page.locator('#modals')).toBeEmpty();
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    await page.getByText(MOCK_INGREDIENTS[0].name).first().click();
    await expect(page.locator('#modals')).not.toBeEmpty();

    await page.mouse.click(10, 10);
    await expect(page.locator('#modals')).toBeEmpty();
  });
});

test.describe('Добавление ингредиентов в конструктор', () => {
  test('добавляет булку в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: MOCK_INGREDIENTS[0].name });
    await bunCard.locator('button').click();

    await expect(page.getByText(`${MOCK_INGREDIENTS[0].name} (верх)`)).toBeVisible();
    await expect(page.getByText(`${MOCK_INGREDIENTS[0].name} (низ)`)).toBeVisible();
  });

  test('добавляет начинку в конструктор', async ({ page }) => {
    const mainCard = page.locator('li').filter({ hasText: MOCK_INGREDIENTS[1].name });
    await mainCard.locator('button').click();

    await expect(page.getByText(MOCK_INGREDIENTS[1].name).last()).toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test('успешно оформляет заказ и очищает конструктор', async ({ page }) => {
    await expect(page.getByText('Тест')).toBeVisible();

    await page.locator('li').filter({ hasText: MOCK_INGREDIENTS[0].name }).locator('button').click();
    await page.locator('li').filter({ hasText: MOCK_INGREDIENTS[1].name }).locator('button').click();

    await expect(page.getByText(`${MOCK_INGREDIENTS[0].name} (верх)`)).toBeVisible();
    await expect(page.getByText(MOCK_INGREDIENTS[1].name).last()).toBeVisible();
    await expect(page.locator('#modals')).toBeEmpty();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText('12345')).toBeVisible();

    await page.locator('#modals svg').first().click();
    await expect(page.locator('#modals')).toBeEmpty();


    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку').first()).toBeVisible();
  });
});
