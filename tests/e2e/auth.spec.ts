import { expect, test, type Page } from "@playwright/test";

const schoolProfile = {
  success: true,
  message: "OK",
  data: {
    school_name: "Sekolah Uji Citra Negara",
    motto: "Belajar dengan aman.",
    contact_email: "",
    support_message: "Bantuan akun tersedia melalui administrator.",
  },
};

async function prepareUnauthenticatedPage(page: Page) {
  await page.route("**/api/v1/school-profile", (route) =>
    route.fulfill({ status: 200, json: schoolProfile }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({
      status: 401,
      json: { success: false, message: "No active test session." },
    }),
  );
}

function sessionEnvelope(mustChangePassword: boolean) {
  const now = "2026-01-01T00:00:00Z";
  return {
    success: true,
    message: "OK",
    data: {
      access_token: "synthetic-e2e-access-token",
      expires_in: 3600,
      user: {
        id: "synthetic-e2e-user",
        identifier: "e2e.student",
        full_name: "Siswa Uji",
        role: "student",
        status: "active",
        must_change_password: mustChangePassword,
        created_at: now,
        updated_at: now,
      },
    },
  };
}

test.beforeEach(async ({ page }) => {
  await prepareUnauthenticatedPage(page);
});

test("redirects an unauthenticated visitor from protected pages to login", async ({
  page,
}) => {
  await page.goto("/student/materials");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Selamat datang" }),
  ).toBeVisible();
});

test("shows a safe message when login fails", async ({ page }) => {
  await page.route("**/api/v1/auth/login", (route) =>
    route.fulfill({
      status: 401,
      json: {
        success: false,
        message: "Synthetic backend diagnostic that must stay private.",
      },
    }),
  );

  await page.goto("/login");
  await page.getByLabel("Identitas").fill("invalid.e2e.user");
  await page
    .getByPlaceholder("Masukkan kata sandi akun Anda")
    .fill("synthetic-invalid-password");
  await page.getByRole("button", { name: "Masuk ke LMS" }).click();

  await expect(page.locator("form [role=alert]")).toHaveText(
    "Identitas atau kata sandi tidak valid.",
  );
  await expect(page.getByText(/Synthetic backend diagnostic/)).toHaveCount(0);
});

test("requires matching password confirmation before submitting a password change", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/login", (route) =>
    route.fulfill({ status: 200, json: sessionEnvelope(true) }),
  );
  let passwordChangeRequests = 0;
  await page.route("**/api/v1/auth/change-password", (route) => {
    passwordChangeRequests += 1;
    return route.fulfill({
      status: 200,
      json: { success: true, message: "OK", data: null },
    });
  });

  await page.goto("/login");
  await page.getByLabel("Identitas").fill("e2e.student");
  await page
    .getByPlaceholder("Masukkan kata sandi akun Anda")
    .fill("synthetic-current-password");
  await page.getByRole("button", { name: "Masuk ke LMS" }).click();

  await expect(page).toHaveURL(/\/change-password$/);
  await expect(
    page.getByRole("heading", { name: "Perbarui kata sandi" }),
  ).toBeVisible();

  await page
    .getByRole("textbox", { name: "Kata sandi saat ini", exact: true })
    .fill("synthetic-current-password");
  await page
    .getByRole("textbox", { name: "Kata sandi baru", exact: true })
    .fill("synthetic-new-password");
  await page
    .getByRole("textbox", { name: "Ulangi kata sandi baru", exact: true })
    .fill("synthetic-other-password");
  await page.getByRole("button", { name: "Perbarui kata sandi" }).click();

  await expect(page.locator("form [role=alert]")).toHaveText(
    "Konfirmasi kata sandi belum sama.",
  );
  expect(passwordChangeRequests).toBe(0);

  await page
    .getByRole("textbox", { name: "Ulangi kata sandi baru", exact: true })
    .fill("synthetic-new-password");
  await page.getByRole("button", { name: "Perbarui kata sandi" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator("form [role=alert]")).toContainText(
    "Kata sandi berhasil diperbarui.",
  );
  expect(passwordChangeRequests).toBe(1);
});

test("keeps the login form usable without horizontal overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");

  await expect(
    page.getByRole("button", { name: "Masuk ke LMS" }),
  ).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("opens the principal control center with school governance navigation", async ({ page }) => {
  const session = sessionEnvelope(false);
  session.data.user.role = "principal";
  session.data.user.full_name = "Kepala Sekolah Uji";
  await page.route("**/api/v1/auth/login", (route) => route.fulfill({ status: 200, json: session }));
  await page.route("**/api/v1/governance/overview", (route) => route.fulfill({ status: 200, json: { success: true, message: "OK", data: { generated_at: "2026-01-01T00:00:00Z", roles: [], courses: 0, classes: 0, active_attempts: 0, pending_requests: 0, draft_results: 0, exams: [], exam_states: [], quality: [], agenda: [] } } }));
  await page.route("**/api/v1/governance/actions/summary", (route) => route.fulfill({ status: 200, json: { success: true, message: "OK", data: { open: 1, overdue: 0 } } }));
  await page.goto("/login");
  await page.getByLabel("Identitas").fill("principal.test");
  await page.getByPlaceholder("Masukkan kata sandi akun Anda").fill("synthetic-password");
  await page.getByRole("button", { name: "Masuk ke LMS" }).click();
  await expect(page.getByRole("heading", { name: "Kepemimpinan sekolah" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Laporan sekolah/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Tindak lanjut sekolah/ })).toBeVisible();
});
