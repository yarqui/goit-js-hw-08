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

const checkForEmptyLocalStorage = async (page: Page, key: string) =>
  await page.waitForFunction(e => {
    console.log('LS: ', localStorage.getItem(e));
    return localStorage.getItem(e) === null;
  }, key);

test.beforeEach(async ({ page, context }) => {
  // throttle the network requests if needed
  // await context.route('**', route => {
  //   setTimeout(() => {
  //     route.continue();
  //   }, 4000);
  // });

  const response = await page.goto(
    'https://yarqui.github.io/goit-js-hw-08/03-feedback.html'
  );

  // check first if the status is successful before each group of tests
  expect(response?.status()).toBe(200);
});

test.describe('Inputs', () => {
  test.beforeEach(async ({ page }) => {
    // create default todos before each test
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

    // clear all inputs
    await email.clear();
    await message.clear();

    // check whether inputs are empty
    await expect(email).toBeEmpty();
    await expect(message).toBeEmpty();
  });

  test('should trim whitespaces and replace double whitespaces with single one on writing to local storage', async ({
    page,
  }) => {
    const email = page.getByLabel('Email');
    const message = page.getByLabel('Message');

    // fill inputs with spaces and double spaces
    await email.fill(INPUTS_WITH_WHITESPACE.email);
    await message.fill(INPUTS_WITH_WHITESPACE.message);

    // check whether inputs were trimmed correctly before writing to local storage
    await checkStateOfLocalStorage(page, INPUT_FILL);
  });

  test('should persist state on page reload', async ({ page }) => {
    const email = page.getByLabel('Email');
    const message = page.getByLabel('Message');

    // fill inputs with spaces and double spaces
    await email.fill(INPUTS_WITH_WHITESPACE.email);
    await message.fill(INPUTS_WITH_WHITESPACE.message);

    // check whether inputs were trimmed correctly before writing to local storage
    await checkStateOfLocalStorage(page, INPUT_FILL);
    // ❗or use waitForTimeout because of the throttle on input.
    // otherwise the message input doesn't have time to be written to local storage
    // await page.waitForTimeout(1000);

    // reloading page to check whether browser correctly persists input values
    await page.reload();

    await expect(email).toHaveValue(INPUT_FILL.email);
    await expect(message).toHaveValue(INPUT_FILL.message);
    await checkStateOfLocalStorage(page, INPUT_FILL);
  });

  test.fixme(
    'should clear inputs and local storage key on "submit button" click',
    async ({ page }) => {
      // FIXME: works only --debug mode. Otherwise it doesn't clear the inputs
      const email = page.getByLabel('Email');
      const message = page.getByLabel('Message');
      const submitBtn = page.getByRole('button', { name: 'Submit' });

      await submitBtn.click();

      await expect(email).toBeEmpty();
      await expect(message).toBeEmpty();
      await checkForEmptyLocalStorage(page, 'feedback-form-state');
    }
  );

  test.fixme(
    'should clear inputs and local storage key on "Enter", while "email" input is focused',
    async ({ page }) => {
      // FIXME: works only in --debug mode. Otherwise it doesn't clear the inputs
      const email = page.getByLabel('Email');
      const message = page.getByLabel('Message');

      await email.press('Enter');

      await expect(email).toBeEmpty();
      await expect(message).toBeEmpty();
      await checkForEmptyLocalStorage(page, 'feedback-form-state');
    }
  );

  test("shouldn't submit if there are empty inputs ", async ({ page }) => {
    const email = page.getByLabel('Email');
    const message = page.getByLabel('Message');
    const submitBtn = page.getByRole('button', { name: 'Submit' });

    await message.clear();
    await submitBtn.click();

    await expect(email).not.toBeEmpty();
    await expect(message).toBeEmpty();

    await message.fill(INPUT_FILL.message);
    await email.clear();
    await email.press('Enter');

    await expect(email).toBeEmpty();
    await expect(message).not.toBeEmpty();
  });
});
