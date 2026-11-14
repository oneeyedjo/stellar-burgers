import { test, expect } from '@playwright/test';

const MOCK_INGREDIENTS = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://norma.nomoreparties.space/assets/images/buns/1.png',
    image_mobile: 'https://norma.nomoreparties.space/assets/images/buns/1.png',
    image_large: 'https://norma.nomoreparties.space/assets/images/buns/1.png',
  },
  {
    _id: '2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://norma.nomoreparties.space/assets/images/mains/1.png',
    image_mobile: 'https://norma.nomoreparties.space/assets/images/mains/1.png',
    image_large: 'https://norma.nomoreparties.space/assets/images/mains/1.png',
  },
];

test.describe('add ingredients to constructor works correctly', function () {

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

    await page.context().addCookies([
      { name: 'accessToken', value: 'mock-access-token', domain: 'localhost', path: '/' },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.goto('/');
  });

  test('Добавление ингредиента и работа модалки', async ({ page }) => {
    await page.getByText(MOCK_INGREDIENTS[0].name).first().click();
    await expect(page.locator('#modals')).not.toBeEmpty();

    await page.locator('#modals svg').first().click();
    await expect(page.locator('#modals')).toBeEmpty();

    const bunCard = page.locator('li').filter({ hasText: MOCK_INGREDIENTS[0].name });
    await bunCard.locator('button').click();

    await expect(page.getByText(MOCK_INGREDIENTS[0].name).last()).toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
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

    await expect(page.getByText('Тест')).toBeVisible();

    const bunCard = page.locator('li').filter({ hasText: MOCK_INGREDIENTS[0].name });
    await bunCard.locator('button').click();

    const mainCard = page.locator('li').filter({ hasText: MOCK_INGREDIENTS[1].name });
    await mainCard.locator('button').click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText(/12345/)).toBeVisible();

    await page.locator('#modals svg').first().click();
    await expect(page.locator('#modals')).toBeEmpty();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});
