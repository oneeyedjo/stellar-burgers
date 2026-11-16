import { test, expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(path.resolve(process.cwd(), 'tests/hars/api.har'), {
    update: false,
    notFound: 'abort',
    url: '**/api/**',
  });

  await page.context().addCookies([
    { name: 'accessToken', value: 'mock-access-token', domain: 'localhost', path: '/' },
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.goto('/');
});

const INGREDIENT_BUN = 'Краторная булка N-200i';
const INGREDIENT_MAIN = 'Биокотлета из марсианской Магнолии';

test.describe('Модальное окно ингредиента', () => {
  test('открывается с правильными данными и закрывается по крестику', async ({ page }) => {
    await expect(page.locator('#modals')).toBeEmpty();

    await page.getByText(INGREDIENT_BUN).first().click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(INGREDIENT_BUN)).toBeVisible();
    await expect(modal.getByText('Калории, ккал')).toBeVisible();

    await page.locator('#modals svg').first().click();
    await expect(page.locator('#modals')).toBeEmpty();
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    await page.getByText(INGREDIENT_BUN).first().click();
    await expect(page.locator('#modals')).not.toBeEmpty();

    await page.mouse.click(10, 10);
    await expect(page.locator('#modals')).toBeEmpty();
  });
});

test.describe('Добавление ингредиентов в конструктор', () => {
  test('добавляет булку в конструктор', async ({ page }) => {
    await expect(page.getByText(`${INGREDIENT_BUN} (верх)`)).toBeHidden();

    await page.locator('li').filter({ hasText: INGREDIENT_BUN }).locator('button').click();

    await expect(page.getByText(`${INGREDIENT_BUN} (верх)`)).toBeVisible();
    await expect(page.getByText(`${INGREDIENT_BUN} (низ)`)).toBeVisible();
  });

  test('добавляет начинку в конструктор', async ({ page }) => {
    const constructorMain = page.locator('span.constructor-element__text').filter({ hasText: INGREDIENT_MAIN });
    await expect(constructorMain).toBeHidden();

    await page.locator('li').filter({ hasText: INGREDIENT_MAIN }).locator('button').click();

    await expect(constructorMain).toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test('успешно оформляет заказ и очищает конструктор', async ({ page }) => {
    await expect(page.getByText('Тест')).toBeVisible();

    await page.locator('li').filter({ hasText: INGREDIENT_BUN }).locator('button').click();
    await page.locator('li').filter({ hasText: INGREDIENT_MAIN }).locator('button').click();

    await expect(page.getByText(`${INGREDIENT_BUN} (верх)`)).toBeVisible();
    const constructorMain = page.locator('span.constructor-element__text').filter({ hasText: INGREDIENT_MAIN });
    await expect(constructorMain).toBeVisible();
    await expect(page.locator('#modals')).toBeEmpty();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText('12345')).toBeVisible();

    await page.locator('#modals svg').first().click();
    await expect(page.locator('#modals')).toBeEmpty();

    await expect(page.getByText(`${INGREDIENT_BUN} (верх)`)).toBeHidden();
    await expect(constructorMain).toBeHidden();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку').first()).toBeVisible();
  });
});
