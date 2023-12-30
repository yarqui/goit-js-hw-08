import { test, expect, type Page } from '@playwright/test';

const INPUT_FILL = {
  email: 'y.pelykh@gmail.com',
  message: 'Hi. Nice to meet you',
};
const INPUTS_WITH_WHITESPACE = {
  email: '    y.pelykh@gmail.com    ',
  message: '   Hi.   Nice   to meet    you    ',
};

const createDefaultInputs = async (page: Page) => {
  const email = page.getByLabel('Email');
  const message = page.getByLabel('Message');
  await email.fill(INPUT_FILL.email);
  await message.fill(INPUT_FILL.message);
};

const checkStateOfLocalStorage = async (
  page: Page,
  expected: { email: string; message: string }
) => {
  return await page.waitForFunction(
    ({ email: expectedEmail, message: expectedMessage }) => {
      const { email, message } = JSON.parse(
        localStorage.getItem('feedback-form-state')!
      );

      return email === expectedEmail && message === expectedMessage;
    },
    expected
  );
};

test.beforeEach(async ({ page }) => {
  const response = await page.goto(
    'https://yarqui.github.io/goit-js-hw-08/03-feedback.html'
  );

  if (response) {
    expect(response.status()).toBe(200);
  }
});

test.describe('Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultInputs(page);
  });

  test('should have correct values', async ({ page }) => {
    const email = page.getByLabel('Email');
    const message = page.getByLabel('Message');

    await expect(email).toHaveValue(INPUT_FILL.email);
    await expect(message).toHaveValue(INPUT_FILL.message);
  });

  test('should have appropriate Local Storage state', async ({ page }) => {
    await checkStateOfLocalStorage(page, INPUT_FILL);
  });

  test('should allow to clear all inputs', async ({ page }) => {
    const email = page.getByLabel('Email');
    const message = page.getByLabel('Message');
    await email.fill('');
    await message.fill('');

    await expect(email).toBeEmpty();
    await expect(message).toBeEmpty();
  });

  test('should trim whitespaces and replace double whitespaces with single one on writing to local storage', async ({
    page,
  }) => {
    const email = page.getByLabel('Email');
    const message = page.getByLabel('Message');

    await email.fill(INPUTS_WITH_WHITESPACE.email);
    await message.fill(INPUTS_WITH_WHITESPACE.message);

    await checkStateOfLocalStorage(page, INPUT_FILL);
  });

  test('should persist state on page reload', async ({ page }) => {
    const email = page.getByLabel('Email');
    const message = page.getByLabel('Message');

    await email.fill(INPUTS_WITH_WHITESPACE.email);
    await message.fill(INPUTS_WITH_WHITESPACE.message);

    await page.reload();
    await page.waitForURL(
      'https://yarqui.github.io/goit-js-hw-08/03-feedback.html'
    );

    await expect(email).toHaveValue(INPUT_FILL.email);
    await expect(message).toHaveValue(INPUT_FILL.message);

    await checkStateOfLocalStorage(page, INPUT_FILL);
  });
});
